import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'antd/lib/button';
import Collapse from 'antd/lib/collapse';
import Slider from 'antd/lib/slider';
import Select  from 'antd/lib/select';

const Panel = Collapse.Panel;
const Option = Select.Option;

class Scheme extends Component {

    add = () => {
        this.props.add();
    }

    deleteAll = () => {
        this.props.deleteAll();
    }

    keyOnChange = (value) => {
        this.props.keyOnChange(value);
    }

    render() {

        function callback(key) {
            console.log(key);
        }

        return (
            <div className='structure'>
                <Button type='default' onClick={this.deleteAll}> Очистить </Button>
                <Button type='default' onClick={this.add}> Добавить </Button>
                <Slider defaultValue={60} min={50} max={120} />

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
                    <Option value="A">A♭</Option>
                    <Option value="Bb">B♭</Option>
                    <Option value="B">B</Option>
                </Select>

                {this.props.sections.map((s, index) => {
                    return (
                        <Collapse onChange={callback} key={index}>
                            
                            <Panel header={s.type} key={index}>
                                <Button icon="play-circle-o" type="primary" shape="circle" size='small'/>
                                <p>type: classic</p>
                            </Panel>
                        </Collapse>
                    )
                }
                )}

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