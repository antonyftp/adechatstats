import { readdirSync } from 'fs';
import { dataParse, decodeMessages } from '../lib/utils.js';

let firstActivityDate = 0;
let lastActivityDate = 0;
let messageCount = 0;

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
        if (message.sender_name === memberName) {
            checkFirstActivity(message);
            checkLastActivity(message);
            messageCount++;
        }
    })
}

const display = (memberName) => {
    console.log(`Member : ${memberName}`);
    console.log(`First activity : ${new Date(firstActivityDate)}`);
    console.log(`Last activity : ${new Date(lastActivityDate)}`);
    console.log(`Message count : ${messageCount}`);
}

export const member = (dataPath, memberName) => {
    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));
    let messages = [];
    dataFiles.forEach(dataFile => {
        messages = dataParse(dataFile, dataPath);
        gatherData(messages, memberName);
    })
    display(memberName);
}