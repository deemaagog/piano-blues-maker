import React, { Component } from 'react';
import PropTypes from 'prop-types';
import presets from '../presets.json'

import Select from 'react-select';

const intros = presets.intros.map(preset => {
  return { value: preset.id, label: preset.description }
})



class Intro extends Component {

  introOnChange = (option) => {
    this.props.setIntro(option === null ? null : option.value);
  }

  render() {
    return (
      <Select
        placeholder='Select...'
        name="intro"
        searchable={false}
        multi={false}
        value={this.props.intro === null ? null : { value: this.props.intro.id, label: this.props.intro.description }}
        onChange={this.introOnChange}
        onBlurResetsInput={false}
        onSelectResetsInput={false}
        options={intros}
      />

    );
  }
}

Intro.propTypes = {
  introOnChange: PropTypes.func,
  intro: PropTypes.object
};

export default Intro;