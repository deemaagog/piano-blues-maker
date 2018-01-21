import React, { Component } from 'react';
import Select from 'react-select';
import {leftHandPatterns} from '../presets.json'

const patterns = leftHandPatterns.map(preset => {
    return { value: preset.id, label: preset.description }
})

class LeftHandsection extends Component {

    handleChange = (pattern) => {
        this.props.setPattern(pattern.value,'left');
    }

    render() {
        const { id, description } = this.props.pattern;

        return (
            <Select
                placeholder = 'Left hand pattern'
                name="lh"
                value={{value: id, label: description}}
                onChange={this.handleChange}
                options={patterns}
                clearable = {false}
            />
        );
    }
}

export default LeftHandsection;