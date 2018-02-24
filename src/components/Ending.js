import React, { Component } from 'react';
import PropTypes from 'prop-types';
import presets from '../presets.json'

import Select from 'react-select';

const endings = presets.endings.map(preset => {
  return { value: preset.id, label: preset.description }
})

class Ending extends Component {

  endingOnChange = (option) => {
    this.props.setEnding(option === null ? null : option.value);
  }

  render() {
    return (
      <Select
        placeholder='Select...'
        name="ending"
        searchable={false}
        multi={false}
        value={this.props.ending === null ? null : { value: this.props.ending.id, label: this.props.ending.description }}
        onChange={this.endingOnChange}
        onBlurResetsInput={false}
        onSelectResetsInput={false}
        options={endings}
      />

    );
  }
}

Ending.propTypes = {
  introOnChange: PropTypes.func,
  intro: PropTypes.object
};

export default Ending;