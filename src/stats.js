import { readdirSync } from 'fs';
import { dataParse, decodeMessages } from '../lib/utils.js';

let top3Members = [];
let mostReactedMessage = {
    "content": "",
    "reactions": []
}
let messageCount = 0;
let messageCountPerMember = [];
let topReactionsGiver = [];
let topReactionsGiverArray = [];
let topReactionsReceiver = [];
let topReactionsReceiverArray = [];

const countReactionsPerMember = (message) => {
    if (message.reactions) {
        message.reactions.forEach(reaction => {
            topReactionsGiver[reaction.actor] = (topReactionsGiver[reaction.actor] || 0) + 1;
        })
    }
    topReactionsGiverArray = Object.entries(topReactionsGiver);
    topReactionsGiverArray.sort((a, b) => b[1] - a[1]);
}

const countReactionsReceivedPerMember = (message) => {
    if (message.reactions) {
        message.reactions.forEach(reaction => {
            topReactionsReceiver[message.sender_name] = (topReactionsReceiver[message.sender_name] || 0) + 1;
        })
    }
    topReactionsReceiverArray = Object.entries(topReactionsReceiver);
    topReactionsReceiverArray.sort((a, b) => b[1] - a[1]);
}

const checkTop3Members = (messageCountPerMember) => {
    const messageCountPerMemberArray = Object.entries(messageCountPerMember);
    messageCountPerMemberArray.sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < 3 && i < messageCountPerMemberArray.length; i++)
        top3Members.push(messageCountPerMemberArray[i]);
}

const countMessagesPerMember = (message) => {
    const senderName = message.sender_name;
    messageCountPerMember[senderName] = (messageCountPerMember[senderName] || 0) + 1;
}

const checkMostReactedMessage = (message) => {
    if (message.reactions) {
        if (message.reactions.length > mostReactedMessage.reactions.length)
            mostReactedMessage = message;
    }
}

const gatherData = (messages, argv) => {
    if (argv[3] && argv[4]) {
        messages.forEach(message => {
            if (message.timestamp_ms >= argv[3] && message.timestamp_ms <= argv[4]) {
                countMessagesPerMember(message);
                checkMostReactedMessage(message);
                countReactionsPerMember(message);
                countReactionsReceivedPerMember(message);
                messageCount++;
            }
        })
    } else {
        messages.forEach(message => {
            countMessagesPerMember(message);
            checkMostReactedMessage(message);
            countReactionsPerMember(message);
            countReactionsReceivedPerMember(message);
            messageCount++;
        })
    }
}

const display = () => {
    console.log('Top 3 most active members :')
    for (let i = 0; i < top3Members.length; i++)
        console.log(`${i + 1} - ${top3Members[i][0]} : ${top3Members[i][1]} messages`);
    console.log('\n')
    console.log('Top 3 reactions giver :')
    for (let i = 0; i < 3 && i < topReactionsGiverArray.length; i++)
        console.log(`${i + 1} - ${topReactionsGiverArray[i][0]} : ${topReactionsGiverArray[i][1]} reactions`);
    console.log('\n')
    console.log('Top 3 reactions receiver :')
    for (let i = 0; i < 3 && i < topReactionsReceiverArray.length; i++)
        console.log(`${i + 1} - ${topReactionsReceiverArray[i][0]} : ${topReactionsReceiverArray[i][1]} reactions`);
    console.log('\n')
    console.log(`Most reacted message (from ${mostReactedMessage.sender_name} with ${mostReactedMessage.reactions.length} reactions): \n\n${mostReactedMessage.content}`);
    console.log('\n')
    console.log(`Message count : ${messageCount}`)
}

export const stats = (dataPath, argv) => {
    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));
    let messages = [];
    let messagesDecode = [];
    dataFiles.forEach(dataFile => {
        messages = dataParse(dataFile, dataPath);
        messagesDecode = decodeMessages(messages);
        gatherData(messagesDecode, argv);
    })
    checkTop3Members(messageCountPerMember);
    display();
}