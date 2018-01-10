import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from "react-switch";
import 'rc-slider/assets/index.css';
//import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';
// import Slider from 'antd/lib/slider';
// import Select from 'antd/lib/select';
//import Checkbox  from 'antd/lib/checkbox';
import Select from 'react-select';

// const Option = Select.Option;

// const customStyle = {
//     background: '#f7f7f7',
//     borderRadius: 0,
//     backgroundColor: '#eeeeee'
//   };

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

    swingOnChange = () => {
        this.props.swingOnChange();
    }

    tempoOnChange = (value) => {
        this.props.tempoOnChange(value);
    }

    render() {
        return (
            <div id='settings' className={this.props.visible ? 'slideIn' : 'slideOut'}>
                <div className='settings-header'>
                    Настройки
                </div>



                <div className='setting-item'>
                    <div className='setting-label'>
                        Swing 8th notes
                    </div>
                    <div className='setting-value'>
                        <Switch
                            onChange={this.swingOnChange}
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
                            max={120}
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
                        value={keys.find(key => { return key.value === this.props.signature} ) } 
                        onChange={this.keyOnChange}
                        className='select-key'
                        name="key"
                        searchable={false}
                        clearable={false}
                        multi={false}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        options={keys}
                        style = {{width: 60, backgroundColor: '#e8e8e8'}}
                    />
                    
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    signature: PropTypes.string,
    swing: PropTypes.bool
};

export default Settings;