import { readdirSync } from 'fs';
import { dataParse, decodeMessages } from '../lib/utils.js';

let firstActivityDate = 0;
let lastActivityDate = 0;
let reactionsGiven = 0;
let reactionsReceived = 0;
let lastReactionsGiven = 0;
let messageCount = 0;

const checkReactionsGiven = (message, memberName) => {
    if (message.reactions) {
        message.reactions.forEach(reaction => {
            if (reaction.actor === memberName) {
                reactionsGiven++;
                if (message.timestamp_ms > lastReactionsGiven)
                    lastReactionsGiven = message.timestamp_ms;
            }
        })
    }
}

const checkReactionsReceived = (message) => {
    if (message.reactions)
        reactionsReceived += message.reactions.length;
}

const checkFirstActivity = (message) => {
    if (firstActivityDate == 0 || message.timestamp_ms < firstActivityDate) {
        firstActivityDate = message.timestamp_ms;
    }
}

const checkLastActivity = (message) => {
    if (message.timestamp_ms > lastActivityDate) {
        lastActivityDate = message.timestamp_ms;
    }
    return lastActivityDate;
}

const gatherData = (messages, memberName) => {
    messages.forEach(message => {
        checkReactionsGiven(message, memberName);
        if (message.sender_name === memberName) {
            checkFirstActivity(message);
            checkLastActivity(message);
            checkReactionsReceived(message);
            messageCount++;
        }
    })
}

const display = (memberName) => {
    console.log(`Member : ${memberName}`);
    console.log(`First activity : ${new Date(firstActivityDate)}`);
    console.log(`Last activity : ${new Date(lastActivityDate)}`);
    console.log(`Reactions received : ${reactionsReceived}`);
    console.log(`Reactions given : ${reactionsGiven}`);
    console.log(`Last reaction given : ${new Date(lastReactionsGiven)}`);
    console.log(`Message count : ${messageCount}`);
}

export const member = (dataPath, memberName) => {
    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));
    let messages = [];
    let messagesDecode = [];
    dataFiles.forEach(dataFile => {
        messages = dataParse(dataFile, dataPath);
        messagesDecode = decodeMessages(messages);
        gatherData(messagesDecode, memberName);
    })
    display(memberName);
}