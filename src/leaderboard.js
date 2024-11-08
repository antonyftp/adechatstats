import { readdirSync } from 'fs';
import { dataParse, decodeMessages } from '../lib/utils.js';

const messageCount = {};

const countMessages = (messages) => {
    messages.forEach(message => {
        const senderName = message.sender_name;
        messageCount[senderName] = (messageCount[senderName] || 0) + 1;
    });
}

const display = (messageCountArray, leaderboardLength) => {
    console.log(`Top ${leaderboardLength} senders (data from July 2023) :`);
    for (let i = 0; i < leaderboardLength && i < messageCountArray.length; i++)
        console.log(`${i + 1} - ${messageCountArray[i][0]} : ${messageCountArray[i][1]} messages`);
}

export const leaderboard = (dataPath, leaderboardLength) => {
    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));
    let messages = [];
    let messagesDecode = [];
    let messageCountArray = [];

    dataFiles.forEach(dataFile => {
        messages = dataParse(dataFile, dataPath);
        messagesDecode = decodeMessages(messages);
        countMessages(messagesDecode);
    })
    messageCountArray = Object.entries(messageCount);
    messageCountArray.sort((a, b) => b[1] - a[1]);
    display(messageCountArray, leaderboardLength);
}