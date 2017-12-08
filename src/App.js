import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Stave from './Stave'
import SamplerLoader from './lib/SamplerLoader';
import Instrument from './lib/Instrument';




function getRandomNote() {
  const randomNotes = ['C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4'];
  const rand = Math.floor(Math.random() * (randomNotes.length - 0)) + 0
  return randomNotes[rand];
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min)) + min;
// }

class App extends Component {

  state = {
    loading: true,
    sections: [
      { id: generateId(), name: 'intro', notes: [{ note: 'C4', duration: 2, time: 0 }] }],
    tempo: 70,
    sectionsPerRow: 3,
    key: 'C',
    swing: true,
    instrument: 'piano',
    playing : false
  };

  add = () => {
    this.setState({ sections: [...this.state.sections, { id: generateId(),name: 'jazz', notes: [{ note: getRandomNote(), duration: 2, time: this.state.sections.length }] }] })
  }

  deleteAll = () => {
    this.setState({sections:[]})
  }

  play = () => {
    const schedule = [];
    this.state.sections.forEach((section) => {
      schedule.push(...section.notes);
    });
    //this.instrument.start('A#2')

    this.instrument.schedule(0, schedule);


    // this.instrument.on('start', function(time, note) {
    //   console.log(time, note)
    // })

    // this.instrument.on(function (eventName, when, obj, opts){
    //   console.log(eventName)
    // })

    // this.instrument.on('started', function (when, name) {
    //   console.log('start', name)
    // })
    // this.instrument.on('ended', function (when, name) {
    //   console.log('ended', name)
    // })
  }

  deleteSection = (id) => {
    let newSections = this.state.sections.filter(item => item.id !== id)
    this.setState({sections: newSections});
  }

  sectionsPerRowOnChange = (e) => {
    this.setState({ sectionsPerRow: e.target.value });
  }

  componentWillMount() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ac = new AudioContext();
    const samplerLoader = new SamplerLoader(ac, {
      uri: 'instruments',
      file: 'piano.json'
    });

    samplerLoader.load().then((sampler) => {
      this.instrument = new Instrument(sampler, ac, { gain: 3, release: 1 });
      this.setState({ loading: false });
    });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button className='button' onClick={this.deleteAll}> Очистить </button>
        <button className='button' onClick={this.play}> Play </button>
        <button className='button' onClick={this.add}> Добавить </button>
        <input className='input' onChange={this.sectionsPerRowOnChange} value={this.state.sectionsPerRow} />
        <Stave sections={this.state.sections} sectionsPerRow={this.state.sectionsPerRow} deleteSection={this.deleteSection}/>
      </div>
    );
  }
}

export default App;
