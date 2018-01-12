// todo
// ties, ties between bars
// grace notes
// tuplets 
// swing feel

// q = 1 = 60bpm
// bar = 4

const durations = {
  '32': 0.125,
  '16': 0.25,
  '8': 0.5,
  'q': 1,
  'h': 2,
  'w': 4
};

class Player {
  constructor(insrument, sections, { tempo, swing }) {
    this.instrument = insrument;
    this.blues = [];
    this.timeDenominator = 60 / tempo;
    this.swing = swing;
    this.currentTime = 0;
    this.nBeats = 4;

    sections.forEach((section) => {
      if (section !== undefined) {
        section.phrases.forEach((phrase) => {
          phrase.bars.forEach((bar) => {
            bar.trebleVoices.forEach((voice) => {
              this.parceVoice(voice);
            });

            bar.bassVoices.forEach((voice) => {
              this.parceVoice(voice);
            });
            this.currentTime += this.nBeats * this.timeDenominator;
          });
        });
      }
    });

  }

  parceVoice(voice) {
    const notesDurationDenominators = {};
    let offset = 0;

    if (voice.tuplets) {
      voice.tuplets.forEach(tuplet => {
        const { from, to } = tuplet;
        for (var x = from; x < to; x++) {
          notesDurationDenominators[x] = 2 / (to - from);
        }

      })
    }

    voice.notes.forEach((note, index) => {

      const vexDuration = note.duration.toLowerCase();
      const isRest = vexDuration.indexOf('r') !== -1;

      let duration = durations[isRest ? vexDuration.replace('r', '') : vexDuration] * this.timeDenominator;
      if (notesDurationDenominators[index]) {
        duration = duration * notesDurationDenominators[index]
      }
      if (!isRest) {
        note.keys.forEach((key) => {
          this.blues.push({ note: key.replace('/', '').replace('n', ''), duration: duration, time: this.currentTime + offset, id: note.id });

          // if (note.id) {
          //   (function (noteId) {
          //     setTimeout(() => {
          //       const el = document.getElementById(noteId);
          //       //
          //       if (el !== null) {
          //         el.classList.add("currentNote");
          //         setTimeout(() => {
          //           el.classList.remove("currentNote");
          //         }, duration * 1000);
          //       }
          //     }, (currentTime + offset) * 1000)
          //   })(`vf-${note.id}`);
          // }
        });
      }
      offset = offset + duration;
    });
  };

  play() {
    this.instrument.schedule(0, this.blues);
  }

  stop() {

  }
}

export default Player