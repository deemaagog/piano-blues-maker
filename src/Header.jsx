import React from 'react';
import PropTypes from 'prop-types';

import Button from 'antd/lib/button';  
import Checkbox  from 'antd/lib/checkbox';
import Slider from 'antd/lib/slider';

const componentName = props => {
    
    const play = () => {
        props.play();
    }

    const tempoOnChange = (value) => {
        props.tempoOnChange(value);
    }

    const swingOnChange = () => {
        props.swingOnChange();
    }
    
    return (
        <div className='header'>
          <Button onClick={play} icon="play-circle-o" type="primary" shape="circle" size='large'/>
          
          <Checkbox  checked={props.swing} onChange={swingOnChange}>Swing</Checkbox>
          {/* <Slider  min={50} max={120} onChange={tempoOnChange} /> */}
        </div>
    );
};

componentName.propTypes = {
    
};

export default componentName;