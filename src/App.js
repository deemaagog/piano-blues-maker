import React, { Component } from 'react';
import SamplerLoader from './services/SamplerLoader';
import Instrument from './services/Instrument';
import Player from './services/Player';
import Header from './containers/Header'
import Scheme from './containers/Scheme'
import Sheet from './containers/Sheet'
import presets, { intros, endings } from './presets.json'

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateIds(phrases, sectionId, vName) {

  const voicesArray = vName ? [{ name: vName, shortName: vName.charAt(0) }] : [{ name: 'trebleVoices', shortName: 't' }, { name: 'bassVoices', shortName: 'v' }];

  return phrases.map((phrase, phraseIndex) => {
    const newBars = phrase.bars.map((bar, barIndex) => {
      const voicesObject = {};
      voicesArray.forEach(v => {
        const newVoices = bar[v.name].map((voice, voiceIndex) => {
          const newNotes = voice.notes.map((note, noteIndex) => {
            return { ...note, ...{ id: `${sectionId}-${phraseIndex}-${barIndex}-${v.shortName}-${voiceIndex}-${noteIndex}` } }
          })
          return { ...voice, ...{ notes: newNotes } }
        });
        voicesObject[v.name] = newVoices;
      })
      return { ...bar, ...voicesObject }
    });
    return { ...phrase, ...{ bars: newBars } }
  })
}



function createNewSection() {
  const { phrases: lhPhrases, ...leftHand } = presets.leftHandPatterns[0];
  const { phrases: rhPhrases, ...rightHand } = presets.rightHandPatterns[0];

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

class App extends Component {

  state = {
    loading: true,
    sections: [],
    tempo: 60,
    key: 'C',
    scale: 1,
    swing: true,
    playing: false,
    intro: intros[0],
    ending: null,
  };

  add = () => {
    this.setState({ sections: [...this.state.sections, createNewSection()] })
  }

  deleteAll = () => {
    this.setState({ sections: [] })
  }

  play = () => {
    this.player.start([this.state.intro, ...this.state.sections, this.state.ending],{ tempo: this.state.tempo, swing: this.state.swingtempo });
  }

  deleteSection = (id) => {
    let newSections = this.state.sections.filter(item => item.id !== id)
    this.setState({ sections: newSections });
  }

  introOnChange = (id) => {
    const newIntro = (id === null ? null : intros.find((intro) => { return intro.id === id }));
    this.setState({ intro: newIntro });

    // const {phrases , ...introObject} = (id === null ? undefined : intros.find((intro) => { return intro.id === id }));
    // this.setState({ intro: {...introObject, phrases: generateIds(phrases)} });
  }

  endingOnChange = (id) => {
    const newEnding = (id === null ? null : endings.find((ending) => { return ending.id === id }));
    this.setState({ ending: newEnding });
  }

  handPatternOnChange = (sectionId, patternId, hand) => {
    // иммутабельно меняем массив секций
    const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');
    const { phrases: patternPhrases, ...patternObject } = presets[`${hand}HandPatterns`].find((pattern) => { return pattern.id === patternId });

    // generate Ids for all notes
    const phrases = generateIds(patternPhrases, sectionId, voicesObjectName);

    const newSections = this.state.sections.map(section => {
      if (section.id === sectionId) {
        const newPhrases = section.phrases.map((phrase, phraseIndex) => {
          const newBars = phrase.bars.map((bar, barIndex) => {
            return { ...bar, ...{ [voicesObjectName]: phrases[phraseIndex].bars[barIndex][voicesObjectName] } }
          })
          return { ...phrase, ...{ bars: newBars } }
        })
        return { ...section, ...{ [`${hand}Hand`]: patternObject }, ...{ phrases: newPhrases } }
      }
      return section;
    });
    this.setState({ sections: newSections });
  }

  componentWillMount() {
    const AudioContext = window.AudioContext || window.webkitAudioContext || false;
    if (!AudioContext) {
      alert(`Sorry, but the Web Audio API is not supported by your browser.
             Please, consider upgrading to the latest version or downloading 
             Google Chrome or Mozilla Firefox`);
    }
    const ac = new AudioContext();
    const samplerLoader = new SamplerLoader(ac, {
      uri: 'instruments',
      file: 'piano.json'
    });

    samplerLoader.load().then((sampler) => {
      console.log('sampler loaded');
      this.instrument = new Instrument(sampler, ac, { gain: 3, release: 1 });

      this.player = new Player(this.instrument);
  
      this.player.onStartPlaying(() => {
        this.setState({ playing: true });
      })
  
      this.player.onFinishPlaying(() => {
        this.setState({ playing: false });
      })

      this.setState({ loading: false });
    }).catch(function (e) {
      console.log(e);
    });
  }

  render() {
    console.log('app render');

    return (

      <div className='app'>
        <Header play={this.play} />
        <div className='main'>
          <Scheme
            deleteAll={this.deleteAll}
            add={this.add}
            sections={this.state.sections}
            intro={this.state.intro === null ? undefined : { value: this.state.intro.id, label: this.state.intro.description }}
            introOnChange={this.introOnChange}
            ending={this.state.ending === null ? undefined : { value: this.state.ending.id, label: this.state.ending.description }}
            endingOnChange={this.endingOnChange}
            HandPatternOnChange={this.handPatternOnChange}
          />
          <Sheet/>
        </div>
      </div>


    );
  }
}

export default App;
