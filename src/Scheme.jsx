import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Section from './Section'

import Button from 'antd/lib/button';
// import Collapse from 'antd/lib/collapse';

import presets from './presets.json'

import Select from 'react-select';
// import 'react-select/dist/react-select.css';
// import Slider from 'antd/lib/slider';
// import Select  from 'antd/lib/select';

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


// const Panel = Collapse.Panel;
// const Option = Select.Option;

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

  // leftHandPatternOnChange = (sectionId,patternId) => {
  //   this.props.leftHandPatternOnChange(sectionId,patternId);
  // }

  render() {



    return (
      <div className='scheme-wrapper'>
        <Button type='default' onClick={this.deleteAll}> Очистить </Button>
        <Button type='default' onClick={this.add}> Добавить </Button>

        {/* <Collapse key={234}>
                    <Panel header='james carol booker' key={345}>
                        <p>type: classic</p>
                    </Panel>
                </Collapse> */}

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