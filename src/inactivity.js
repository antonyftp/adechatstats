import { readdirSync } from 'fs';
import { dataParse, decodeMessages, participantsList } from '../lib/utils.js';

const getMessagesCountPerMember = (messagesDecode, counts, lastMessages, startTs, endTs) => {
    messagesDecode.forEach(message => {
        const ts = message.timestamp_ms;
        const inWindow = (startTs == null || ts >= startTs) && (endTs == null || ts <= endTs);
        if (inWindow) {
            const name = message.sender_name;
            counts[name] = (counts[name] || 0) + 1;
            if (!lastMessages[name] || ts > lastMessages[name].timestamp_ms) {
                lastMessages[name] = message;
            }
        }
    });
};

const getInactiveMembers = (memberList, counts, minMessages) => {
    const inactive = [];
    memberList.forEach(member => {
        const count = counts[member.name] || 0;
        if (count < minMessages) {
            inactive.push(member.name);
        }
    });
    return inactive;
};

const display = (inactive, counts, lastMessages) => {
    console.log('\nInactive members:');
    inactive.forEach(member => {
        const count = counts[member] || 0;
        const lastMsg = lastMessages[member];
        const content = lastMsg && lastMsg.content ? lastMsg.content : '(no text content)';
        const timestamp = lastMsg ? new Date(lastMsg.timestamp_ms).toLocaleString() : 'N/A';
        console.log(`\n${member}:`);
        console.log(`  Messages sent: ${count}`);
        console.log(`  Last message: "${content}"`);
        console.log(`  Last message time: ${timestamp}`);
    });
    console.log('\nNumber of inactive members: ' + inactive.length);
};

export const inactivity = (dataPath, argv) => {
    const startTs = argv[3] ? Number(argv[3]) : null;
    const endTs = argv[4] ? Number(argv[4]) : null;
    const minMessages = argv[5] ? Number(argv[5]) : 10;

    if ((argv[3] && Number.isNaN(startTs)) || (argv[4] && Number.isNaN(endTs)) || Number.isNaN(minMessages)) {
        console.log('Invalid arguments for -i. Expected: -i <startTs> <endTs> [minMessages]');
        return;
    }

    let start = startTs;
    let end = endTs;
    if (start != null && end != null && start > end) {
        console.log('Note: start timestamp is greater than end. Swapping the values.');
        const tmp = start;
        start = end;
        end = tmp;
    }

    const memberList = participantsList(dataPath);
    const messageCountPerMember = {};
    const lastMessagePerMember = {};

    let dataFiles = readdirSync(dataPath);
    dataFiles = dataFiles.filter(dataFile => dataFile.endsWith('.json'));

    let totalCounted = 0;
    dataFiles.forEach(dataFile => {
        const messages = dataParse(dataFile, dataPath);
        const messagesDecode = decodeMessages(messages);
        getMessagesCountPerMember(messagesDecode, messageCountPerMember, lastMessagePerMember, start, end);
        messagesDecode.forEach(m => {
            const ts = m.timestamp_ms;
            const inWindow = (start == null || ts >= start) && (end == null || ts <= end);
            if (inWindow) totalCounted++;
        });
    });

    const inactiveMembers = getInactiveMembers(memberList, messageCountPerMember, minMessages);
    console.log('Time window:', start ? new Date(start).toLocaleString() : 'earliest', '->', end ? new Date(end).toLocaleString() : 'latest');
    console.log('Min messages threshold:', minMessages);
    console.log('Total messages counted in window:', totalCounted);
    display(inactiveMembers, messageCountPerMember, lastMessagePerMember);
};