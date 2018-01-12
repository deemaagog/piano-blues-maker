import React, { Component } from 'react';
import SamplerLoader from './lib/SamplerLoader';
import Instrument from './lib/Instrument';
import Player from './lib/Player';
import Header from './Header'
import Scheme from './Scheme'
import Sheet from './Sheet'
import Settings from './Settings'
import presets , {intros, endings} from './presets.json'

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function createNewSection() {
  const {phrases:lhPhrases, ...leftHand} = presets.leftHandPatterns[0];
  const {phrases:rhPhrases, ...rightHand} = presets.rightHandPatterns[0];

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
    const player = new Player(
      this.instrument, 
      [this.state.intro,...this.state.sections,this.state.ending],
      {tempo : this.state.tempo , swing : this.state.swingtempo}
    );
    player.play();
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

  handPatternOnChange = (sectionId,patternId, hand) => {
    // иммутабельно меняем массив секций
    const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');
    const {phrases, ...patternObject} = presets[`${hand}HandPatterns`].find((pattern) => {return pattern.id === patternId });
    const newSections = this.state.sections.map(section => {
         if (section.id === sectionId ) {
            const newPhrases = section.phrases.map((phrase, phraseIndex) => {
               const newBars = phrase.bars.map((bar, barIndex) => {
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
           HandPatternOnChange = {this.handPatternOnChange}
          />
          <Sheet width = {this.state.width} intro = {this.state.intro} sections={this.state.sections} ending={this.state.ending} signature={this.state.key}   />
          <Settings 
            visible = {this.state.showSettings}
            toggleSettings={this.toggleSettings} 
            keyOnChange={this.keyOnChange} 
            signature={this.state.key} 
            swingOnChange={this.swingOnChange} 
            swing={this.state.swing} 
            tempoOnChange={this.tempoOnChange}
            tempo={this.state.tempo}
          />        
        </div>
      </div>


    );
  }
}

export default App;
