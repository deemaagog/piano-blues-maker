import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Settings from '../containers/Settings'
import {play, stop} from '../actions/player'
import {connect} from 'react-redux'
import PlayButton from '../components/PlayButton'

class Header extends Component {

  state = { showSettings: false }

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
          <PlayButton {...this.props} />           
          <button className='button-header button-settings' onClick={this.toggleSettings} />
        </div>
        <Settings visible={this.state.showSettings} />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const {isPlaying, isLoading} = state.player;
  return{
    isPlaying,
    isLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    play: () => dispatch(play()),
    stop: () => dispatch(stop())
  }
}

Header.propTypes = {
  play: PropTypes.func,
  stop: PropTypes.func,
  isPlaying: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default connect(mapStateToProps,mapDispatchToProps)(Header);