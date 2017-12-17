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

function getRandomSection() {
  return {
    id: generateId(),
    presetId: '',
    type: 'INTRO',
    phrases: [
      {
        id: generateId(),
        type: 'IIII',
        bars: [
          {
            id: generateId(),
            trebleVoices: [

            ],
            bassVoices: [
              {
                notesGroupes: [
                  {
                    duration: '8',
                    beam: false,
                    tuplet: false,
                    notes: [
                      ['C2'],
                      ['C2']
                    ]
                  },
                  {
                    duration: '8',
                    beam: false,
                    tuplet: false,
                    notes: [
                      ['E2'],
                      ['C2']
                    ]
                  },
                  {
                    duration: '8',
                    beam: false,
                    tuplet: false,
                    notes: [
                      ['G2'],
                      ['C2']
                    ]
                  },
                  {
                    duration: '8',
                    beam: false,
                    tuplet: false,
                    notes: [
                      ['A2'],
                      ['G2']
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }]
  }
}

class App extends Component {

  // structure = {
  //   sections:[
  //     {
  //       id : '',
  //       presetId: '',
  //       type: 'INTRO',
  //       bars: [
  //         {
  //           id : '',
  //           trebleVoices:[
  //             {
  //               notesGroupes: [
  //                 {
  //                   duration: 'q',
  //                   beam: false,
  //                   tuplet: false,
  //                   stem: 'up', 
  //                   notes: [
  //                     // single note
  //                     ['C4'],
  //                     //chord
  //                     ['D4','F4']
  //                   ]
  //                 }
  //               ]
  //             }
  //           ],
  //           bassVoices:[

  //           ]
  //         }
  //       ]
  //     },
  //     // verse 1
  //     {
  //       id : '',
  //       type: 'VERSE',
  //       phrases:[
  //         //phrase 1
  //         {
  //           id : '',
  //           type: 'IIII',
  //           bars: [
  //             {
  //               id : '',

  //             }
  //           ]
  //         },

  //       ]
  //     },
  //     // verse 2
  //     {
  //       type: 'VERSE',
  //       phrases:[

  //       ]
  //     },
  //     {
  //       type: 'ENDING'
  //     }
  //   ]
  // }


  state = {
    loading: true,
    sections: [
      getRandomSection()
    ],
    tempo: 70,
    barsPerRow: 4,
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
    const schedule = [{ note: 'C4', duration: 2, time: 0 }];
    // this.state.sections.forEach((section) => {
    //   schedule.push(...section.notes);
    // });

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
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
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
        <Stave sections={this.state.sections} barsPerRow={this.state.barsPerRow} deleteSection={this.deleteSection} />
      </div>
    );
  }
}

export default App;
