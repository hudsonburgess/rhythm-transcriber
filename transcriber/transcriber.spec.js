const Transcriber = require('./transcriber');

describe('Transcriber', () => {

    let transcriber;

    describe('constructor', () => {

        it(`accepts a tempo parameter`, () => {
            transcriber = new Transcriber(100); 
            expect(transcriber.tempo).toEqual(100);
        });

        it(`calculates the 16th note duration in ms for the given tempo`, () => {
            transcriber = new Transcriber(100);
            const expectedDuration = 60 / 100 / 4 * 1000;
            expect(transcriber.noteDuration16th).toEqual(expectedDuration);
        });

    });

    describe('transcribe', () => {

        const tempo = 100;
        const QUARTER = 60 / tempo;
        const EIGHTH = 60 / tempo / 2;
        const SIXTEENTH = 60 / tempo / 4;

        let notes;
        let transcription;

        function createRhythm(rhythm, createError) {
            const result = [];
            rhythm.forEach((n, i) => {
                if (n === 'x') {
                    const noteSeconds = createError ?
                        i * SIXTEENTH + createRhythmicError() :
                        i * SIXTEENTH;
                    const noteMs = Math.round(noteSeconds * 1000);
                    result.push(noteMs);
                }
            });
            return result;
        }

        function createRhythmicError() {
            return (Math.random() - 0.5) * SIXTEENTH;
        }

        function rhythmTest(rhythm, createError) {
            notes = createRhythm(rhythm, createError);
            transcription = transcriber.transcribe(notes);
            expect(transcription).toEqual(rhythm);
        }

        beforeEach(() => {
            transcriber = new Transcriber(tempo);
        });

        describe('exact rhythm matches', () => {

            it(`exact rhythm test 1`, () => {
                rhythmTest([
                    'x', '', '', '',
                    'x', '', '', '',
                    'x', '', '', '',
                    'x', '', '', '',
                ], false);
            });

            it(`exact rhythm test 2`, () => {
                rhythmTest([
                    'x', '', '', '',
                    'x', '', 'x', '',
                    'x', 'x', 'x', 'x',
                    'x', '', 'x', 'x',
                ], false);
            });

        });

        describe('rhythms with error', () => {

            it(`exact rhythm test 1`, () => {
                rhythmTest([
                    'x', '', '', '',
                    'x', '', '', '',
                    'x', '', '', '',
                    'x', '', '', '',
                ], true);
            });

            it(`exact rhythm test 2`, () => {
                rhythmTest([
                    'x', '', '', '',
                    'x', '', 'x', '',
                    'x', 'x', 'x', 'x',
                    'x', '', 'x', 'x',
                ], true);
            });

        });

    });

    describe('hasNoteAtPosition', () => {

        beforeEach(() => {
            transcriber = new Transcriber(60);
        });

        it(`returns true if the given rhythm has a note at roughly the given 16th note position`, () => {
            // beat 2 would be the fifth 16th note in a bar, which is position 4 in a zero-based array
            const beat2 = 4;

            // since the tempo is 60 (1 beat per sec), 16th notes will fall every 250ms
            // therefore, a note at 900ms would be closest to beat 2
            const rhythm = [0, 900];

            expect(transcriber.hasNoteAtPosition(rhythm, beat2)).toBeTruthy();
        });

        it(`returns true if the given rhythm has a note at exactly the given 16th note position`, () => {
            const beat1 = 0;
            const rhythm = [0, 1000, 2000, 3000];
            expect(transcriber.hasNoteAtPosition(rhythm, beat1)).toBeTruthy();
        });

        it(`returns false if the given rhythm doesn't have a note near the given 16th note position`, () => {
            const beat4 = 12;
            const rhythm = [0, 2800];
            expect(transcriber.hasNoteAtPosition(rhythm, beat4)).toBeFalsy();
        });

    });

});
