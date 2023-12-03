import { leaderboard } from './src/leaderboard.js';
import { member } from './src/member.js';

const dataPath = 'data/';

switch (process.argv[2]) {
    case "-l":
        if (process.argv.length < 4) {
            console.log("Usage: node index.js -l <leaderboardLength>");
            break;
        }
        leaderboard(dataPath, process.argv[3])
        break;
    case "-m":
        if (process.argv.length < 4) {
            console.log("Usage: node index.js -m <memberName>");
            break;
        }
        member(dataPath, process.argv[3])
        break;
    default:
        console.log("Usage: node index.js <flag>");
        console.log("-l <leaderboardLength> : Leaderboard of <leaderboardLength> most active users");
        console.log("-m <memberName> : Stats about a <memberName>");
        break;
}