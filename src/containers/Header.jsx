import React, { Component } from 'react';
import Settings from '../containers/Settings'

class Header extends Component {

  state = { showSettings: false }

  play = () => {
    this.props.play();
  }

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  }

  render() {
    return (
      <div className='header'>
        <div className='logo-wrapper'>
          <div className='logo' />
        </div>
        <div className='header-panel'>
          <button className='button-header button-play' onClick={this.play} />

          <button className='button-header button-settings' onClick={this.toggleSettings} />
        </div>
        <Settings visible={this.state.showSettings} />
      </div>

    );
  }
};

// Header.propTypes = {

// };

export default Header;