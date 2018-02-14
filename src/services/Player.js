import SoundFont from 'soundfont-player'
import {midi} from 'note-parser'

// TODO:
// ties, ties across bars
// grace notes
// dots
// swing feel

const durations = {
  '32': 0.125,
  '16': 0.25,
  '8': 0.5,
  'q': 1,
  'h': 2,
  'w': 4
};

const keysOffset = {
  'C': 0,
  'Db': 1,
  'D': 2,
  'Eb': 3,
  'E': 4,
  'F': 5,
  'Gb': -6,
  'G': -5,
  'Ab': -4,
  'A': -3,
  'Bb': -2,
  'B': -1
}

const keysAccidentals = {
  'C': [],
  'Db': ['Bb','Eb','Ab','Db','Gb'],
  'D': ['F#','C#'],
  'Eb': ['Bb','Eb','Ab'],
  'E': ['F#','C#','G#','D#'],
  'F': ['Bb','Eb','Ab','Db','Gb'],
  'Gb': ['Bb','Eb','Ab','Db','Gb','Cb'],
  'G': ['F#'],
  'Ab': ['Bb','Eb','Ab','Db','Gb'],
  'A': ['F#','C#','G#'],
  'Bb': ['Bb','Eb'],
  'B': ['F#','C#','G#','D#','A#']  
}

class Player {
  constructor() {
    // q = 1 = 60bpm
    // bar = 4
    this.nBeats = 4;
  }

  loadSamples(callback) {

    function localUrl(name) {
      return 'instruments/' + name + '.js'
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext || false;
    if (!AudioContext) {
      alert(`Sorry, but the Web Audio API is not supported by your browser.
             Please, consider upgrading to the latest version or downloading 
             Google Chrome or Mozilla Firefox`);
      return callback();
    }
    const ac = new AudioContext();

    SoundFont.instrument(ac, 'piano', {
      nameToUrl: localUrl,
      gain: 3,
      release: 1
    }).then((instrument) => {
      this.instrument = instrument;
      //setTimeout(() => {
      callback();
      //}, 2000)

    }).catch(function (err) {
      console.log('err', err)
    })

  }


  parceVoice(voice,symbol, vInd, bInd, pInd, sInd) {
    const notesDurationDenominators = {};
    let offset = 0;
    this.beatCounter = 0;
    const notesToSwing = [];

    // ограничения по мультиолям
    // поддерживаются только с основанием 2
    // вложенность не поддерживается
    if (voice.tuplets) {
      voice.tuplets.forEach(tuplet => {
        const { from, to } = tuplet;
        for (var x = from; x < to; x++) {
          notesDurationDenominators[x] = 2 / (to - from);
        }
      })
    }

    voice.notes.forEach((note, index) => {
      const noteId = `${sInd}-${pInd}-${bInd}-${symbol}-${vInd}-${index}`;
      const vexDuration = note.duration.toLowerCase();
      const isRest = vexDuration.indexOf('r') !== -1;

      let normalDuration = durations[isRest ? vexDuration.replace('r', '') : vexDuration];

      if (note.dots) {
        normalDuration = normalDuration * 1.5;
      }

      let duration = normalDuration * this.timeDenominator;
      if (notesDurationDenominators[index]) {
        duration = duration * notesDurationDenominators[index]
      }

      // swing feel
      if (this.swing && normalDuration === 0.5 && notesDurationDenominators[index] === undefined) {
        const beat = Math.floor(this.beatCounter)
        if (!notesToSwing[beat]) {
          notesToSwing[beat] = [];
        }
        notesToSwing[beat].push({ id: noteId })
      }

      this.beatCounter = this.beatCounter + normalDuration;


      //if (!isRest) {
      note.keys.forEach((key) => {
        this.events.push(
          {
            type: 'noteStart',
            id: noteId,
            note: midi(key.replace('/', '').replace('n', ''))+ this.keyOffset,
            time: (this.currentTime + offset),
            duration,
            isRest
          }
        )
      });
      //}
      offset = offset + duration;
    });

    if (this.swing) {
      notesToSwing.forEach((notePair) => {
        if (notePair.length === 2) {
          let firstNoteId = notePair[0].id;
          let secondNoteId = notePair[1].id;
          this.events.forEach((ev) => {
            if (ev.id === firstNoteId) {
              ev.duration = ev.duration + this.swingExtraDuration;
            } else if (ev.id === secondNoteId) {
              ev.duration = ev.duration - this.swingExtraDuration;
              ev.time = ev.time + this.swingExtraDuration;
            }
          })
        }
      })
    }

  };

  play() {

    const curEvent = this.events[this.curEventIndex];
    if (!curEvent.isRest) {
      this.instrument.play(curEvent.note, curEvent.time, curEvent);
    }

    if (this.follow && curEvent.id) {
      const el = document.getElementById(`vf-${curEvent.id}`);
      if (el !== null) {
        // window.scrollBy({ 
        //   top: x,
        //   left: 0, 
        //   behavior: 'smooth' 
        // });
        el.classList.add("currentNote");
        setTimeout(() => {
          el.classList.remove("currentNote");
        }, curEvent.duration * 1000);
      }
    }

    if (this.curEventIndex === this.events.length - 1) {
      return this.onFinishPlayingCallback();
    }

    const timeUntilNextEvent = this.events[this.curEventIndex + 1].time - curEvent.time;

    this.curEventIndex++;
    this.timerId = setTimeout(() => { this.play() }, timeUntilNextEvent * 1000);
  }

  start(sections, { tempo, swing, key, follow }) {
    if (this.onStartPlayingCallback) {
      this.onStartPlayingCallback();
    }

    this.follow = follow;

    this.keyOffset = keysOffset[key];

    this.events = [];
    this.curEventIndex = 0;
    this.currentTime = 0;
    this.timeDenominator = 60 / tempo;

    // swing feel implementation
    this.swing = swing;
    this.swingExtraDuration = (this.timeDenominator * 2 / 3) - (this.timeDenominator / 2);


    sections.forEach((section,sInd) => {
      if (section !== null) {
        section.phrases.forEach((phrase, pInd) => {
          phrase.bars.forEach((bar,bInd) => {
            bar.trebleVoices.forEach((voice, vInd) => {
              this.parceVoice(voice,'t', vInd, bInd, pInd, sInd);
            });

            bar.bassVoices.forEach((voice, vInd) => {
              this.parceVoice(voice,'b', vInd, bInd, pInd, sInd);
            });
            this.currentTime += this.nBeats * this.timeDenominator;
          });
        });
      }
    });

    this.events.sort(function (a, b) {
      return a.time - b.time
    })

    if (this.events) {
      this.play();
    }
  }

  stop() {
    if (this.timerId) {
      //this.instrument.stop();
      clearTimeout(this.timerId);
      this.timerId = null;
      this.curEventIndex = 0;
      //this.events.length = 0;
    }
  }

  onFinishPlaying(callback) {
    this.onFinishPlayingCallback = callback;
  }

  onStartPlaying(callback) {
    this.onStartPlayingCallback = callback;
  }
}

export default Player