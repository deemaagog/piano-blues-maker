import React, { Component } from 'react';
import Select from 'react-select';
import {rightHandPatterns} from '../presets.json'

const patterns = rightHandPatterns.map(preset => {
    return { value: preset.id, label: preset.description }
})

class RightHandsection extends Component {

    handleChange = (pattern) => {
        this.props.patternOnChange(pattern.value,'right');
    }

    render() {
        const { id, description } = this.props.pattern;

        return (
            <Select
                placeholder = 'Right hand pattern'
                name="rh"
                value={{value: id, label: description}}
                onChange={this.handleChange}
                options={patterns}
                clearable = {false}
            />
        );
    }
}

export default RightHandsection;