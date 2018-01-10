import React, { Component } from 'react';
// import './App.css';
import SamplerLoader from './lib/SamplerLoader';
import Instrument from './lib/Instrument';
import Header from './Header'
import Scheme from './Scheme'
import Sheet from './Sheet'
import Settings from './Settings'
import sectionCollection from './randomSections'
import presets ,{intros, endings, leftHandPatterns , rightHandPatterns} from './presets.json'

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// function getRandomNote() {
//   const randomNotes = ['C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4'];
//   const rand = Math.floor(Math.random() * (randomNotes.length - 0)) + 0
//   return randomNotes[rand];
// }

function getRandomSection() {
  const rand = Math.floor(Math.random() * (sectionCollection.length - 0)) + 0
  return sectionCollection[rand];
}

function createNewSection() {
  const {phrases:lhPhrases, ...leftHand} = leftHandPatterns[0];
  const {phrases:rhPhrases, ...rightHand} = rightHandPatterns[0];

  lhPhrases.forEach((lhPhrase, phraseIndex) => {
    lhPhrase.bars.forEach((bar, barIndex) => {
      bar.trebleVoices = rhPhrases[phraseIndex].bars[barIndex].trebleVoices;
    })
  })

  return {
    id: generateId(),
    type: 'PROGRESSION',
    leftHand,
    rightHand,
    phrases: lhPhrases
  }
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
    sections: [],
    tempo: 60,
    key: 'C',
    scale: 1,
    swing: true,
    instrument: 'piano',
    playing: false,
    width: window.innerWidth,
    intro: intros[0],
    ending: undefined,
    showSettings: false
  };

  add = () => {
    this.setState({ sections: [...this.state.sections, createNewSection()] })
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
            schedule.push({ note: key.replace('/', '').replace('n', ''), duration: duration, time: currentTime + offset, id: note.id });

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

  toggleSettings = () => {
    this.setState({showSettings: !this.state.showSettings});
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

  introOnChange = (id) => {
    const newIntro = (id === null ? undefined : intros.find((intro) => { return intro.id === id }));
    this.setState({ intro: newIntro});
  }

  endingOnChange = (id) => {
    const newEnding = (id === null ? undefined : endings.find((ending) => { return ending.id === id }));
    this.setState({ ending: newEnding});
  }

  HandPatternOnChange = (sectionId,patternId, hand) => {
    // иммутабельно меняем массив секций

    const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');

    const {phrases, ...patternObject} = presets[`${hand}HandPatterns`].find((pattern) => {return pattern.id === patternId });
    const newSections = this.state.sections.map(section => {
         if (section.id === sectionId ) {
            const newPhrases = section.phrases.map((phrase, phraseIndex) => {
               const newBars = phrase.bars.map((bar, barIndex) => {
                //return {...bar, ...{bassVoices:phrases[phraseIndex].bars[barIndex].bassVoices}}
                return {...bar, ...{[voicesObjectName]:phrases[phraseIndex].bars[barIndex][voicesObjectName]}}
               })
               return {...phrase, ...{bars:newBars}} 
            })
            return {...section, ...{[`${hand}Hand`]:patternObject} , ...{phrases: newPhrases}}  
         }
         return section;
    });
    this.setState({sections: newSections});
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

    // const blues = [this.state.intro,...this.state.sections,this.state.ending];

    // в Sheet всегда передаем разный key, чтобы реакт каждый раз полностью пересоздавал компонент
    // https://stackoverflow.com/questions/21749798/how-can-i-reset-a-react-component-including-all-transitively-reachable-state
    return (

      <div className='app'>
        <Header play={this.play} toggleSettings={this.toggleSettings}/>
        <div className='main'>
          <Scheme 
           deleteAll={this.deleteAll}
           add={this.add} 
           sections={this.state.sections}
           intro = {this.state.intro === undefined ? undefined :{value: this.state.intro.id, label: this.state.intro.description}}
           introOnChange = {this.introOnChange}
           ending = {this.state.ending === undefined ? undefined :{value: this.state.ending.id, label: this.state.ending.description}}
           endingOnChange = {this.endingOnChange} 
           HandPatternOnChange = {this.HandPatternOnChange}
          />
          {/* <Sheet width = {this.state.width} sections={blues} signature={this.state.key}   />  */}
          <Sheet width = {this.state.width} intro = {this.state.intro} sections={this.state.sections} ending={this.state.ending} signature={this.state.key}   />
          {/* {this.state.showSettings && <Settings toggleSettings={this.toggleSettings} 
          keyOnChange={this.keyOnChange} signature={this.state.key} swingOnChange={this.swingOnChange} swing={this.state.swing} tempoOnChange={this.tempoOnChange} /> } */}
        
          <Settings visible = {this.state.showSettings} toggleSettings={this.toggleSettings} 
          keyOnChange={this.keyOnChange} signature={this.state.key} swingOnChange={this.swingOnChange} swing={this.state.swing} tempoOnChange={this.tempoOnChange} />        
        </div>
      </div>


    );
  }
}

export default App;
