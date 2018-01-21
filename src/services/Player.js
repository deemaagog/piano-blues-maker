import SoundFont from 'soundfont-player'

// TODO:
// ties, ties between bars
// grace notes
// dots
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
  constructor() {
    this.nBeats = 4;
  }

  loadSamples() {

    function localUrl(name) {
      return 'instruments/' + name + '.js'
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext || false;
    if (!AudioContext) {
      alert(`Sorry, but the Web Audio API is not supported by your browser.
             Please, consider upgrading to the latest version or downloading 
             Google Chrome or Mozilla Firefox`);
    }
    const ac = new AudioContext();

    SoundFont.instrument(ac, 'piano', {
      nameToUrl: localUrl,
      gain: 3,
      release: 1
    }).then((instrument) => {
      this.instrument = instrument;
    }).catch(function (err) {
      console.log('err', err)
    })

  }


  parceVoice(voice) {
    const notesDurationDenominators = {};
    let offset = 0;

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

      const vexDuration = note.duration.toLowerCase();
      const isRest = vexDuration.indexOf('r') !== -1;

      let duration = durations[isRest ? vexDuration.replace('r', '') : vexDuration] * this.timeDenominator;
      if (notesDurationDenominators[index]) {
        duration = duration * notesDurationDenominators[index]
      }

      // swing feel
      if (this.swing) {

      }

      if (!isRest) {
        note.keys.forEach((key) => {
          this.events.push(
            {
              type: 'noteStart',
              id: note.id,
              note: key.replace('/', '').replace('n', ''),
              time: (this.currentTime + offset),
              duration
            }
          )

          // this.events.push(
          //   {
          //     type: 'noteStop',
          //     id: note.id,
          //     note: key.replace('/', '').replace('n', ''),
          //     time: (this.currentTime + offset+ duration) * 1000,
          //     duration
          //   }
          // )
        });
      }
      offset = offset + duration;
    });
  };

  play() {

    const curEvent = this.events[this.curEventIndex];
    this.instrument.play(curEvent.note, curEvent.time, curEvent);

    if (curEvent.id) {
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

  start(sections, { tempo, swing }) {
    if (this.onStartPlayingCallback) {
      this.onStartPlayingCallback();
    }

    this.timeDenominator = 60 / tempo;
    this.swing = swing;
    this.events = [];
    this.currentTime = 0;

    this.curEventIndex = 0;
    sections.forEach((section) => {
      if (section !== null) {
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