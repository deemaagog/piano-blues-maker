import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'antd/lib/button';
import Collapse from 'antd/lib/collapse';
// import Slider from 'antd/lib/slider';
// import Select  from 'antd/lib/select';

const Panel = Collapse.Panel;
// const Option = Select.Option;

class Scheme extends Component {

    add = () => {
        this.props.add();
    }

    deleteAll = () => {
        this.props.deleteAll();
    }

    

    render() {

        function callback(key) {
            console.log(key);
        }

        return (
            <div className='structure'>
                <Button type='default' onClick={this.deleteAll}> Очистить </Button>
                <Button type='default' onClick={this.add}> Добавить </Button>
                

                {this.props.sections.map((s, index) => {
                    return (
                        <Collapse onChange={callback} key={index}>
                            
                            <Panel header={s.type} key={index}>
                                {/* <Button icon="play-circle-o" type="primary" shape="circle" size='small'/> */}
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