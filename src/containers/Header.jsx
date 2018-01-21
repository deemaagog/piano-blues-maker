import React, { Component } from 'react';
import Settings from '../containers/Settings'
import {play, stop} from '../actions/player'
import {connect} from 'react-redux'

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
          {this.props.isPlaying? <button className='button-header button-stop' onClick={this.props.stop}/>: <button className='button-header button-play' onClick={this.props.play} /> }
          {/* <button className='button-header button-stop' onClick={this.props.stop}/> */}
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

// Header.propTypes = {

// };

export default connect(mapStateToProps,mapDispatchToProps)(Header);