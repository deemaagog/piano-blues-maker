import React, { Component } from 'react';
import Select from 'react-select';
// import 'react-select/dist/react-select.css';

class LeftHandsection extends Component {

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.label}`);
    }

    render() {
        const { id } = this.props;

        return (
            <Select
                placeholder = 'Left hand pattern'
                name="lh"
                value={id}
                onChange={this.handleChange}
                options={[
                    { value: '123', label: 'Classic' },
                    { value: '234', label: 'Chicago shuffle' },
                ]}
            />
        );
    }
}

export default LeftHandsection;