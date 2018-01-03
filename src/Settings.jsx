import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'antd/lib/slider';
import Select  from 'antd/lib/select';
import Checkbox  from 'antd/lib/checkbox';

const Option = Select.Option;

const customStyle = {
    background: '#f7f7f7',
    borderRadius: 0,
    backgroundColor: '#eeeeee'
  };

class Settings extends Component {
    keyOnChange = (value) => {
        this.props.keyOnChange(value);
    }

    swingOnChange = () => {
        this.props.swingOnChange();
    }

    tempoOnChange = (value) => {
        this.props.tempoOnChange(value);
    }

    render() {
        return (
            <div id = 'settings' className={this.props.visible ? 'slideIn' : 'slideOut'}>
                <div className='settings-header'>
                    Настройки
                </div>

                <div>
                    <Slider defaultValue={60} min={50} max={120} onChange={this.tempoOnChange} />
                </div>

                <div>
                    <Select value = {this.props.signature} style={{ width: 120 }} onChange={this.keyOnChange}>
                        <Option value="C">C</Option>
                        <Option value="Db">D♭</Option>
                        <Option value="D">D</Option>
                        <Option value="Eb">E♭</Option>
                        <Option value="E">E</Option>
                        <Option value="F">F</Option>
                        <Option value="Gb">G♭</Option>
                        <Option value="G">G</Option>
                        <Option value="Ab">A♭</Option>
                        <Option value="A">A</Option>
                        <Option value="Bb">B♭</Option>
                        <Option value="B">B</Option>
                    </Select>
                </div>

                <div>
                    <Checkbox style={customStyle} checked={this.props.swing} onChange={this.swingOnChange}>Swing</Checkbox>
                </div>
            </div>
        );
    }
}

Settings.propTypes = {

};

export default Settings;