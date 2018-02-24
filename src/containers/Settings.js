import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { toggleSwing, setKey, setTempo } from '../actions/settings'

import Switch from "react-switch";
import Slider from 'rc-slider';
import Select from 'react-select';

const keys = [
    { value: 'C', label: 'C' },
    { value: 'Db', label: 'D♭' },
    { value: 'D', label: 'D' },
    { value: 'Eb', label: 'E♭' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'Gb', label: 'G♭' },
    { value: 'G', label: 'G' },
    { value: 'Ab', label: 'A♭' },
    { value: 'A', label: 'A' },
    { value: 'Bb', label: 'B♭' },
    { value: 'B', label: 'B' }
]

class Settings extends Component {

    keyOnChange = (option) => {
        this.props.keyOnChange(option.value);
    }

    tempoOnChange = (value) => {
        this.props.tempoOnChange(value);
    }

    render() {
        return (
            <div id='settings' className={this.props.visible ? 'slideIn' : 'slideOut'}>
                <div className='settings-header'>
                    Settings
                </div>
                <div className='setting-item'>
                    <div className='setting-label'>
                        Swing 8th notes
                    </div>
                    <div className='setting-value'>
                        <Switch
                            onChange={this.props.toggleSwing}
                            checked={this.props.swing}
                            id="swing"
                            className='swing-feel'
                            onColor="#28a37a"
                            onHandleColor="#eaecef"
                            offColor="#7c7a7a"
                            handleDiameter={20}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={20}
                            width={48}
                        />
                    </div>
                </div>
                <div className='setting-item'>
                    <div className='setting-label'>
                        Tempo (bpm)
                    </div>
                    <div className='setting-value'>
                        <Slider
                            value={this.props.tempo}
                            min={50}
                            max={130}
                            onChange={this.tempoOnChange}
                            trackStyle={{ backgroundColor: '#b2b0b0' }}
                            handleStyle={{
                                borderColor: '#eaecef',
                                backgroundColor: '#eaecef',
                            }}
                            railStyle={{ backgroundColor: '#b2b0b0' }}
                        />
                    </div>
                </div>

                <div className='setting-item'>
                    <div className='setting-label'>
                        Key (transposition)
                    </div>
                    <Select
                        value={keys.find(key => { return key.value === this.props.signature })}
                        onChange={this.keyOnChange}
                        className='select-key'
                        name="key"
                        searchable={false}
                        clearable={false}
                        multi={false}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        options={keys}
                        style={{ width: 60, backgroundColor: '#e8e8e8' }}
                    />

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {key, tempo, swing} = state.settings; 
    return {
        signature: key,
        tempo: tempo,
        swing: swing
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        tempoOnChange: (value) => {
            dispatch(setTempo(value))
        },
        keyOnChange: (value) => {
            dispatch(setKey(value))
        },
        toggleSwing: () => {
            dispatch(toggleSwing())
        }
    }
}

Settings.propTypes = {
    signature: PropTypes.string,
    swing: PropTypes.bool,
    tempo: PropTypes.number,
    tempoOnChange: PropTypes.func,
    keyOnChange: PropTypes.func,
    toggleSwing: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);