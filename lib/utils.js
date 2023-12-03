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

export const decodeMessages = (messageArray) => {
    return messageArray.map(processMessage);
}

export const dataParse = (dataFile, dataPath) => {
    const filePath = join(dataPath, dataFile);
    const jsonData = readFileSync(filePath);
    const data = JSON.parse(jsonData);
    return(data.messages)
}