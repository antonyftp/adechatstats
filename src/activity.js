import { readdirSync } from 'fs';
import { dataParse, decodeMessages } from '../lib/utils.js';
import { member } from './member.js';

let messageCountPerMember = [];

const sortMessageCountPerMember = () => {
    const messageCountPerMemberArray = Object.entries(messageCountPerMember);
    messageCountPerMemberArray.sort((a, b) => b[1] - a[1]);
    messageCountPerMember = messageCountPerMemberArray;
}

const countMessagesPerMember = (message) => {
    const senderName = message.sender_name;
    messageCountPerMember[senderName] = (messageCountPerMember[senderName] || 0) + 1;
}

const gatherData = (messages, argv) => {
    messages.forEach(message => {
        if (message.timestamp_ms >= argv[3] && message.timestamp_ms <= argv[4])
            countMessagesPerMember(message);
    })
}

const display = (argv) => {
    console.log("Messages count per member between " + new Date(parseInt(argv[3])).toLocaleString() + " and " + new Date(parseInt(argv[4])).toLocaleString() + " :");
    for (const member in messageCountPerMember)
        console.log(`${messageCountPerMember[member]} messages`);
}

export const activity = (dataPath, argv) => {
    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));
    let messages = [];
    let messagesDecode = [];
    dataFiles.forEach(dataFile => {
        messages = dataParse(dataFile, dataPath);
        messagesDecode = decodeMessages(messages);
        gatherData(messagesDecode, argv);
    });
    sortMessageCountPerMember();
    display(argv);
}