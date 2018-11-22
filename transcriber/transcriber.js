class Transcriber {

    constructor(tempo) {
        this.tempo = tempo;
        this.noteDuration16th = 60 / tempo / 4 * 1000;
    }

    transcribe(rhythm) {
        const transcription = [];
        range(112).forEach(pos => {
            if (this.hasNoteAtPosition(rhythm, pos)) {
                transcription.push('x');
            } else {
                transcription.push('');
            }
        });

        return transcription;
    }

    hasNoteAtPosition(rhythm, notePos) {
        const maxError = this.noteDuration16th / 2;
        const minPos = notePos * this.noteDuration16th - maxError;
        const maxPos = notePos * this.noteDuration16th + maxError;
        return typeof rhythm.find(n => n > minPos && n < maxPos) !== 'undefined';
    }

    formatAs16ths(transcription) {
        return transcription.map((note, i) => {
            if (note === '') {
                return i % 4 === 0 ? ' .' : '.';
            }
            switch (i % 4) {
                case 0: return ' ' + (i / 4 % 7 + 1);
                case 1: return 'e';
                case 2: return '+';
                case 3: return 'a';
            }
        }).join('').trim();
    }

}

function range(n) {
    const vals = [];
    for (let i = 0; i < n; i++) {
        vals.push(i);
    }
    return vals;
}

module.exports = Transcriber;
