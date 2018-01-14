import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Section from './Section'

import Button from 'antd/lib/button';

import presets from './presets.json'

import Select from 'react-select';
// import 'react-select/dist/react-select.css';

const intros = presets.intros.map(preset => {
  return { value: preset.id, label: preset.description }
})

const endings = presets.endings.map(preset => {
  return { value: preset.id, label: preset.description }
})

function introRenderer(option) {
  return `INTRO: ${option.label}`
}

function endingRenderer(option) {
  return `ENDING: ${option.label}`
}


class Scheme extends Component {

  state = {};

  add = () => {
    this.props.add();
  }

  deleteAll = () => {
    this.props.deleteAll();
  }

  introOnChange = (option) => {
    this.props.introOnChange(option === null ? null : option.value);
  }

  endingOnChange = (option) => {
    this.props.endingOnChange(option === null ? null : option.value);
  }


  render() {

    return (
      <div className='scheme-wrapper'>
        <Button type='default' onClick={this.deleteAll}> Очистить </Button>
        <Button type='default' onClick={this.add}> Добавить </Button>

        <div className='scheme'>
          <Select
            placeholder='Select INTRO...'
            className='select-intro'
            name="intro"
            searchable={false}
            multi={false}
            value={this.props.intro}
            valueRenderer={introRenderer}
            onChange={this.introOnChange}
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            options={intros}
          />


          {this.props.sections.map((s, index) => {
            return (
              <Section key={index} section = {s} HandPatternOnChange = {this.props.HandPatternOnChange}>
                {s.type}
              </Section>
            )
          }
          )}

          <Select
            placeholder='Select ENDING...'
            className='select-intro'
            name="ending"
            searchable={false}
            multi={false}
            value={this.props.ending}
            valueRenderer={endingRenderer}
            onChange={this.endingOnChange}
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            options={endings}
          />
        </div>
      </div>
    );
  }
}

Scheme.propTypes = {
  sections: PropTypes.array,
  add: PropTypes.func,
  deleteAll: PropTypes.func,
};

export default Scheme;