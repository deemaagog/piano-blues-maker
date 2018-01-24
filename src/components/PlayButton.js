import React from 'react';
import PropTypes from 'prop-types';

const PlayButton = props => {
  if (props.isLoading) {
    return <button disabled={true} className='button-header button-loading' />
  } else if (props.isPlaying) {
    return <button className='button-header button-stop' onClick={props.stop} />
  } else {
    return <button className='button-header button-play' onClick={props.play} />
  }
  // return (
  //     <button disabled = {props.isLoading} className='button-header button-stop' onClick={props.stop}/>
  // );
};

PlayButton.propTypes = {
  stop: PropTypes.func
};

export default PlayButton;