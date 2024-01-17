import { leaderboard } from './src/leaderboard.js';
import { member } from './src/member.js';
import { stats } from './src/stats.js';
import { activity } from './src/activity.js';

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
    case "-s":
        stats(dataPath, process.argv)
        break;
    case "-a":
        activity(dataPath, process.argv)
        break;
    default:
        console.log("Usage: node index.js <flag>");
        console.log("-l <leaderboardLength> : Leaderboard of <leaderboardLength> most active users");
        console.log("-m <memberName> : Stats about a <memberName>");
        console.log("-s <startingDate> <endDate> : Stats about the groupchat bewteen <startingDate> and <endDate> (timestamp in ms) (optional)")
        console.log("-a <startingDate> <endDate> : Activity of the groupchat bewteen <startingDate> and <endDate>")
        break;
}