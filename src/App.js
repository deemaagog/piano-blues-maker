import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import Stave from './Stave'
import SamplerLoader from './lib/SamplerLoader';
import Instrument from './lib/Instrument';

// function getRandomNote() {
//   const randomNotes = ['C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4'];
//   const rand = Math.floor(Math.random() * (randomNotes.length - 0)) + 0
//   return randomNotes[rand];
// }

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const durations = {
  '32': 0.125,
  '16': 0.25,
  '8': 0.5,
  'q': 1,
  'h': 2,
  'w': 4
};

function getRandomSection() {
  return {
    id: generateId(),
    presetId: '',
    type: 'PROGRESSION',
    phrases: [
      {
        id: generateId(),
        type: 'I-I-I-I',
        bars: [
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['E/4'], duration: '8', id: '', stem: 'up' },
                  { keys: ['Bb/4', 'C/5'], duration: '8' },
                  { keys: ['C/5'], duration: 'q', id: '', type: 'REST' },
                  { keys: ['C/5'], duration: 'h', id: '', type: 'REST' },
                ],
                tuplets: [],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['C/2'], duration: 'q', id: '', clef: 'bass', stem: 'up' },
                  { keys: ['G/2'], duration: '8', id: '', clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: '', clef: 'bass' },
                  { keys: ['G/2'], duration: 'q', id: '', clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: '', clef: 'bass' },
                  { keys: ['G/2'], duration: '8', id: '', clef: 'bass' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

function getRandomBlues() {
  return [
    {
      id: generateId(),
      presetId: '',
      type: 'PROGRESSION',
      phrases: [
        {
          id: generateId(),
          type: 'I-I-I-I',
          bars: [
            {
              id: generateId(),
              trebleVoices: [
                {
                  notes: [
                    { keys: ['b/4'], duration: 'q', id: '', type: 'REST' },
                    { keys: ['E/4', 'G/4'], duration: '8' },
                    { keys: ['C/5'], duration: '8' },
                    { keys: ['E/4', 'G/4'], duration: '8' },
                    { keys: ['Eb/4', 'Gb/4'], duration: '8' },
                    { keys: ['C/5'], duration: '8' },
                    { keys: ['Eb/4', 'Gb/4'], duration: '8' },
                    { keys: ['d/4', 'f/4'], duration: '8' },
                    { keys: ['C/5'], duration: '8' },
                    { keys: ['d/4', 'f/4'], duration: '8' },
                  ],
                  beams: [
                    {from: 1, to: 4},
                    {from: 4, to: 7},
                    {from: 7, to: 10}
                  ],
                  tuplets: [
                    {from: 1, to: 4},
                    {from: 4, to: 7},
                    {from: 7, to: 10}
                  ],
                  ties: []
                }
              ],
              bassVoices: [
                {
                  notes: [
                    { keys: ['d/3'], duration: 'q', id: '', clef: 'bass', type: 'REST' },
                    { keys: ['Bb/3'], duration: 'q', id: '', clef: 'bass' },
                    { keys: ['A/3'], duration: 'q', id: '', clef: 'bass' },
                    { keys: ['Ab/3'], duration: 'q', id: '', clef: 'bass' }
                  ]
                }
              ]
            } ,
            {
              id: generateId(),
              trebleVoices: [
                {
                  notes: [
                    { keys: ['C/4', 'E/4'], duration: '8' },
                    { keys: ['C/5'], duration: '8' },
                    { keys: ['C/4', 'E/4'], duration: '8' },
                    { keys: ['C/4', 'Eb/4'], duration: '8' },
                    { keys: ['C/5'], duration: '8' },
                    { keys: ['C/4', 'Eb/4'], duration: '8' },
                    { keys: ['b/3', 'd/4'], duration: 'h' }
                  ],
                  tuplets: [
                    {from: 0, to: 3},
                    {from: 3, to: 6},
                  ],
                  beams: [
                    {from: 0, to: 3},
                    {from: 3, to: 6},
                  ],
                  ties: []
                }
              ],
              bassVoices: [
                {
                  notes: [
                    { keys: ['g/3'], duration: 'q', id: '', clef: 'bass' },
                    { keys: ['gb/3'], duration: 'q', id: '', clef: 'bass' },
                    { keys: ['g/2','f/3'], duration: 'h', id: '', clef: 'bass' }
                  ]
                }
              ]
            } 
          ]
        }
      ]
    }
  ]
}


class App extends Component {

  state = {
    loading: true,
    sections: getRandomBlues(),
    tempo: 60,
    barsPerRow: 3,
    key: 'C',
    swing: true,
    instrument: 'piano',
    playing: false
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
      let offset = 0;
      voice.notes.forEach((note) => {
        const duration = durations[note.duration] * timeDenominator;
        note.keys.forEach((key) => {
          if (note.type !== 'REST') {
            schedule.push({ note: key.replace('/', ''), duration: duration, time: currentTime + offset });
          }
        });
        offset = offset + duration;
        console.log(this);
      });
    };

    this.state.sections.forEach((section) => {
      section.phrases.forEach((phrase) => {
        phrase.bars.forEach((bar) => {

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
  }

  deleteSection = (id) => {
    let newSections = this.state.sections.filter(item => item.id !== id)
    this.setState({ sections: newSections });
  }

  barsPerRowOnChange = (e) => {
    this.setState({ barsPerRow: e.target.value });
  }

  tempoOnChange = (e) => {
    this.setState({ tempo: e.target.value });
  }

  swingOnChange = () => {
    this.setState({ swing: !this.state.swing });
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


  render() {
    console.log('app render');
    return (

      <div className="App">
        <button className='button' onClick={this.deleteAll}> Очистить </button>
        <button className='button' onClick={this.play}> Play </button>
        <button className='button' onClick={this.add}> Добавить </button>
        <select value={this.state.barsPerRow} onChange={this.barsPerRowOnChange}>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='6'>6</option>
          <option value='7'>7</option>
          <option value='8'>8</option>
        </select>
        <select value={this.state.tempo} onChange={this.tempoOnChange}>
          <option value='50'>50</option>
          <option value='60'>60</option>
          <option value='70'>70</option>
          <option value='80'>80</option>
          <option value='90'>90</option>
          <option value='100'>100</option>
          <option value='110'>110</option>
          <option value='120'>120</option>
        </select>
        <label> <input type="checkbox" checked={this.state.swing} onChange={this.swingOnChange} /> Swing</label>
        <Stave sections={this.state.sections} barsPerRow={this.state.barsPerRow} deleteSection={this.deleteSection} />
      </div>
    );
  }
}

export default App;
