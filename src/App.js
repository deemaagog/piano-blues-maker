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
                  { keys: ['E/4'], duration: '8', id: generateId(), stem: 'up' },
                  { keys: ['Bb/4', 'C/5'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: 'qr', id: generateId() },
                  { keys: ['C/5'], duration: 'hr', id: generateId() },
                ],
                tuplets: [],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['C/2'], duration: 'q', id: generateId(), clef: 'bass', stem: 'up' },
                  { keys: ['G/2'], duration: '8', id: generateId(), clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: generateId(), clef: 'bass' },
                  { keys: ['G/2'], duration: 'q', id: generateId(), clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: generateId(), clef: 'bass' },
                  { keys: ['G/2'], duration: '8', id: generateId(), clef: 'bass' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

function getRandomSectionTest() {
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
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
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
                    { keys: ['b/4'], duration: 'qr', id: generateId() },
                    { keys: ['E/4', 'G/4'], duration: '8', id: generateId() },
                    { keys: ['C/5'], duration: '8', id: generateId() },
                    { keys: ['E/4', 'G/4'], duration: '8', id: generateId() },
                    { keys: ['Eb/4', 'Gb/4'], duration: '8', id: generateId() },
                    { keys: ['C/5'], duration: '8', id: generateId() },
                    { keys: ['Eb/4', 'Gb/4'], duration: '8', id: generateId() },
                    { keys: ['d/4', 'f/4'], duration: '8', id: generateId() },
                    { keys: ['C/5'], duration: '8', id: generateId() },
                    { keys: ['d/4', 'f/4'], duration: '8', id : generateId() },
                  ],
                  beams: [
                    { from: 1, to: 4 },
                    { from: 4, to: 7 },
                    { from: 7, to: 10 }
                  ],
                  tuplets: [
                    { from: 1, to: 4 },
                    { from: 4, to: 7 },
                    { from: 7, to: 10 }
                  ],
                  ties: []
                }
              ],
              bassVoices: [
                {
                  notes: [
                    { keys: ['d/3'], duration: 'qr', id: generateId(), clef: 'bass' },
                    { keys: ['Bb/3'], duration: 'q', id: generateId(), clef: 'bass' },
                    { keys: ['A/3'], duration: 'q', id: generateId(), clef: 'bass' },
                    { keys: ['Ab/3'], duration: 'q', id: generateId(), clef: 'bass' }
                  ]
                }
              ]
            },
            {
              id: generateId(),
              trebleVoices: [
                {
                  notes: [
                    { keys: ['C/4', 'E/4'], duration: '8', id: generateId() },
                    { keys: ['C/5'], duration: '8' , id: generateId()},
                    { keys: ['C/4', 'E/4'], duration: '8', id : generateId() },
                    { keys: ['C/4', 'Eb/4'], duration: '8', id :generateId() },
                    { keys: ['C/5'], duration: '8' , id: generateId()},
                    { keys: ['C/4', 'Eb/4'], duration: '8', id: generateId() },
                    { keys: ['b/3', 'd/4'], duration: 'h', id: generateId() }
                  ],
                  tuplets: [
                    { from: 0, to: 3 },
                    { from: 3, to: 6 },
                  ],
                  beams: [
                    { from: 0, to: 3 },
                    { from: 3, to: 6 },
                  ],
                  ties: []
                }
              ],
              bassVoices: [
                {
                  notes: [
                    { keys: ['g/3'], duration: 'q', id: generateId(), clef: 'bass' },
                    { keys: ['ab/2', 'gb/3'], duration: 'q', id: generateId(), clef: 'bass' },
                    { keys: ['g/2', 'f/3'], duration: 'h', id: generateId(), clef: 'bass' }
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

        

        let duration = durations[isRest ? vexDuration.replace('r','') : vexDuration] * timeDenominator;
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

  keyOnChange = (e) => {
    this.setState({ key: e.target.value });
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
        <select value={this.state.key} onChange={this.keyOnChange}>
          <option value='C'>C</option>
          <option value='Db'>D♭</option>
          <option value='D'>D</option>
          <option value='Eb'>E♭</option>
          <option value='E'>E</option>
          <option value='F'>F</option>
          <option value='Gb'>G♭</option>
          <option value='G'>G</option>
          <option value='Ab'>A♭</option>
          <option value='A'>A</option>
          <option value='Bb'>B♭</option>
          <option value='B'>B</option>
        </select>
        <Stave sections={this.state.sections} barsPerRow={this.state.barsPerRow} deleteSection={this.deleteSection} />
      </div>
    );
  }
}


function t() {
  // [1,2,3,4,5].forEach(x=>{
  //   setTimeout(() => {
  //     console.log(x)
  //   }, 1000);
  // })

  for (var s = 0; s < 6; s++) {
    (function () {
      setTimeout(() => {
        console.log(s)
      }, 1000);
    })()
  }
}

export default App;
