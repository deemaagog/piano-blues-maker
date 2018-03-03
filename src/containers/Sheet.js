import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SheetDrawer from '../services/SheetDrawer';
import {generateId} from '../helpers'
import { connect } from 'react-redux'

class Sheet extends Component {

  state = {windowWidth: window.innerWidth};

  drawSheet = () => {
    new SheetDrawer(
      this.sheetContainer,
      [this.props.intro,...this.props.sections,this.props.ending].filter(x => x !== null),
      {width: this.state.windowWidth, signature:this.props.signature,scale: this.props.scale}   
    ).draw();
  }  

  componentDidMount() {
    // console.log('sheet did mount');
    
    this.drawSheet();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate() {
    // console.log('sheet did update');
    this.drawSheet();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({windowWidth:window.innerWidth});
  }


  shouldComponentUpdate(nextProps) {
    return !nextProps.shouldUpdate
  }

  render() {
    // console.log('sheet render');
    // всегда передаем разный key, чтобы реакт каждый раз полностью пересоздавал
    // https://stackoverflow.com/questions/21749798/how-can-i-reset-a-react-component-including-all-transitively-reachable-state
    return (
      <div className='sheet' ref={(x) => this.sheetContainer = x} key = {generateId()} />
    );
  }
}

Sheet.propTypes = {
  sections: PropTypes.array,
  signature: PropTypes.string,
  scale: PropTypes.number,
  width: PropTypes.number,
  intro: PropTypes.object,
  ending: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
      signature: state.settings.key,
      scale: state.settings.scale,
      intro: state.intro,
      sections: state.sections,
      ending: state.ending
  }
}

export default connect(mapStateToProps)(Sheet);