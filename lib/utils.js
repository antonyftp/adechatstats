import { readFileSync } from 'fs';
import { join } from 'path';

const decodeFBString = (str) => {
    let arr = [];
    for (var i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    return Buffer.from(arr).toString("utf8");
}

const processMessage = (message) => {
    return Object.keys(message).reduce((obj, key) => {
        obj[key] = (typeof message[key] === "string") ? decodeFBString(message[key]): message[key];
        return obj
    }, {});
}

const processReactions = (reactions) => {
    return reactions.map(reaction => {
        return Object.keys(reaction).reduce((obj, key) => {
            obj[key] = (typeof reaction[key] === "string") ? decodeFBString(reaction[key]): reaction[key];
            return obj
        }, {});
    });
}

export const decodeMessages = (messageArray) => {
    return messageArray.map(message => {
        message = processMessage(message);
        if (message.reactions) {
            message.reactions = processReactions(message.reactions);
        }
        return message;
    });
}

const processParticipants = (participant) => {
    return Object.keys(participant).reduce((obj, key) => {
        obj[key] = (typeof participant[key] === "string") ? decodeFBString(participant[key]): participant[key];
        return obj
    }, {});
}

export const decodeParticipants = (participantArray) => {
    return participantArray.map(participant => {
        return processParticipants(participant);
    });
}

export const participantsList = (dataPath) => {
    const filePath = join(dataPath, "message_41.json");
    const jsonData = readFileSync(filePath);
    const data = JSON.parse(jsonData);
    const participants = decodeParticipants(data.participants);
    return(participants);
}

export const dataParse = (dataFile, dataPath) => {
    const filePath = join(dataPath, dataFile);
    const jsonData = readFileSync(filePath);
    const data = JSON.parse(jsonData);
    return(data.messages)
}