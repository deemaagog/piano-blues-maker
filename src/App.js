import React, { Component } from 'react';
// import './App.css';
import Stave from './Stave'
import SamplerLoader from './lib/SamplerLoader';
import Instrument from './lib/Instrument';
import Header from './Header'
import Scheme from './Scheme'
import Sheet from './Sheet'
import sectionCollection from './randomSections'



// function getRandomNote() {
//   const randomNotes = ['C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4'];
//   const rand = Math.floor(Math.random() * (randomNotes.length - 0)) + 0
//   return randomNotes[rand];
// }

function getRandomSection() {
  const rand = Math.floor(Math.random() * (sectionCollection.length - 0)) + 0
  return sectionCollection[rand];
}

const durations = {
  '32': 0.125,
  '16': 0.25,
  '8': 0.5,
  'q': 1,
  'h': 2,
  'w': 4
};

class App extends Component {



  state = {
    loading: true,
    sections: [sectionCollection[0]],
    tempo: 60,
    barsPerRow: 3,
    key: 'C',
    swing: true,
    instrument: 'piano',
    playing: false,
    width: window.innerWidth
  };

  add = () => {
    this.setState({ sections: [...this.state.sections, getRandomSection()] })
  }

  deleteAll = () => {
    this.setState({ sections: [] })
  }

  play = () => {
    // todo
    // ties, ties between bars
    // grace notes
    // tuplets 
    // swing feel

    // q = 1 = 60bpm
    // bar = 4
    const schedule = [];
    let currentTime = 0;
    const timeDenominator = 60 / this.state.tempo;
    const nBeats = 4;


    function parceVoice(voice) {
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



        let duration = durations[isRest ? vexDuration.replace('r', '') : vexDuration] * timeDenominator;
        if (notesDurationDenominators[index]) {
          duration = duration * notesDurationDenominators[index]
        }
        if (!isRest) {
          note.keys.forEach((key) => {
            schedule.push({ note: key.replace('/', ''), duration: duration, time: currentTime + offset, id: note.id });

            if (note.id) {
              (function (noteId) {
                setTimeout(() => {
                  const el = document.getElementById(noteId);
                  //
                  if (el !== null) {
                    el.classList.add("currentNote");
                    setTimeout(() => {
                      el.classList.remove("currentNote");
                    }, duration * 1000);
                  }
                }, (currentTime + offset) * 1000)
              })(`vf-${note.id}`);
            }
          });
        }
        offset = offset + duration;
      });
    };

    this.state.sections.forEach((section) => {
      section.phrases.forEach((phrase) => {
        phrase.bars.forEach((bar) => {
          //let notesIds = 100000;
          bar.trebleVoices.forEach((voice) => {
            parceVoice(voice);
          });

          bar.bassVoices.forEach((voice) => {
            parceVoice(voice);
          });
          currentTime = currentTime + nBeats * timeDenominator;
        });
      });
    });

    //TODO: generate schedule
    this.instrument.schedule(0, schedule);





    //this.instrument.on(function (eventName, when, obj, opts) {
    //console.log('ended', eventName,when,obj,opts)
    //})
  }

  deleteSection = (id) => {
    let newSections = this.state.sections.filter(item => item.id !== id)
    this.setState({ sections: newSections });
  }

  barsPerRowOnChange = (e) => {
    this.setState({ barsPerRow: e.target.value });
  }

  keyOnChange = (value) => {
    this.setState({ key: value });
  }

  tempoOnChange = (value) => {
    this.setState({ tempo: value });
  }

  swingOnChange = () => {
    this.setState({ swing: !this.state.swing});
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth});
  }

  componentWillMount() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ac = new AudioContext();
    const samplerLoader = new SamplerLoader(ac, {
      uri: 'instruments',
      file: 'piano.json'
    });

    samplerLoader.load().then((sampler) => {
      console.log('sampler loaded');
      this.instrument = new Instrument(sampler, ac, { gain: 3, release: 1 });
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  

  componentDidMount() {
    //console.log('app did mount');
    window.addEventListener("resize", this.updateDimensions);
  }
  

  render() {
    console.log('app render');

    return (

      <div className='app'>
        <Header play={this.play}  swingOnChange={this.swingOnChange} swing={this.state.swing} tempoOnChange={this.tempoOnChange}  />
        <div id = 'qwe' className='main'>
          <Scheme deleteAll={this.deleteAll} add={this.add} sections={this.state.sections} keyOnChange={this.keyOnChange} signature={this.state.key} />
          {/* <div className='sheet'>
            <Stave sections={this.state.sections} barsPerRow={this.state.barsPerRow} deleteSection={this.deleteSection} />
          </div> */}
          <Sheet width = {this.state.width} sections={this.state.sections} signature={this.state.key} /> 
        </div>
      </div>


    );
  }
}

export default App;
