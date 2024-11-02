import { readdirSync } from 'fs';
import { dataParse, decodeMessages, participantsList } from '../lib/utils.js';

const inactiveMembers = [];
const messageCountPerMember = [];

const getInactiveMembers = (memberList, messageCountPerMember) => {
    memberList.forEach(member => {
        // Change 0 by the number of messages you want to set as the minimum to be considered active
        if (messageCountPerMember[member.name] < 10 || !messageCountPerMember[member.name]) 
            inactiveMembers.push(member.name);
    });
}

const getMessagesCountPerMember = (messagesDecode, argv) => {
    messagesDecode.forEach(message => {
        if (message.timestamp_ms >= argv[3] && message.timestamp_ms <= argv[4])
            messageCountPerMember[message.sender_name] = (messageCountPerMember[message.sender_name] || 0) + 1;
    })
}

const display = () => {
    console.log("Inactive members :");
    inactiveMembers.forEach(member => {
        console.log(member);
    });
    console.log("Number of inactive members : " + inactiveMembers.length);
}

export const inactivity = (dataPath, argv) => {
    const memberList = participantsList(dataPath);
    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));
    let messages = [];
    let messagesDecode = [];
    dataFiles.forEach(dataFile => {
        messages = dataParse(dataFile, dataPath);
        messagesDecode = decodeMessages(messages);
        getMessagesCountPerMember(messagesDecode, argv);
    });
    getInactiveMembers(memberList, messageCountPerMember);
    display();
}