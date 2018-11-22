const keypress = require('keypress');

module.exports = {

    async listenFor(ms) {
        return new Promise((resolve, reject) => {
            console.log('go!');
            keypress(process.stdin);
            const startTime = new Date();

            const keyTimes = [];
            process.stdin.on('keypress', (str, key) => {
                exitIfCtrlC(key);
                const curTime = new Date();
                const t = (curTime - startTime).valueOf();
                console.log(t);
                keyTimes.push(t)
            });

            process.stdin.setRawMode(true);
            process.stdin.resume();

            setTimeout(() => resolve(keyTimes), ms);
        });
    }

}

function exitIfCtrlC(key) {
    if (key.ctrl && key.name === 'c') {
        process.exit();
      }
}