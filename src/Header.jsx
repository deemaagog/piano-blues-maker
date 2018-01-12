import React from 'react';
//import PropTypes from 'prop-types';


import play from './play.svg'
import settings from './settings.svg'

const styles = {
    backgroundColor: 'transparent',
    backgroundImage: `url(${play})`,
    backgroundSize: '100% 100%',
    border: 0,
    cursor: 'pointer'

}

const stylesSettings = {
    backgroundColor: 'transparent',
    backgroundImage: `url(${settings})`,
    backgroundSize: '100% 100%',
    border: 0,
    cursor: 'pointer'

}

const Header = props => {

    const play = () => {
        props.play();
    }

    const toggleSettings = () => {
        props.toggleSettings();
    }

    return (
        <div className='header'>
            <div className='logo-wrapper'>
                <div className='logo'>

                </div>
            </div>
            <div className='header-panel'>
                <button style={styles} className='button-header' onClick={play} />

                <button style={stylesSettings} className='button-header' onClick={toggleSettings} />
            </div>
        </div>
    );
};

// Header.propTypes = {

// };

export default Header;