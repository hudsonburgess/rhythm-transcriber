const rhythmTapper = require('./rhythm-tapper');
const Transcriber = require('./transcriber');

console.log('Hello from transcriber\n----------\n');

const tempo = 186;
console.log(`tap a rhythm @ ${tempo} bpm...`);
rhythmTapper.listenFor(10000).then(keyTimes => {
    // assume first note is downbeat
    const firstNote = keyTimes[0];
    keyTimes = keyTimes.map(kt => kt - firstNote);

    const transcriber = new Transcriber(tempo);
    const transcription = transcriber.transcribe(keyTimes);
    console.log('\n' + transcriber.formatAs16ths(transcription));

    console.log('\n----------\nDone');
    process.exit(0);
});
