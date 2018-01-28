import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SheetDrawer from '../services/SheetDrawer';
import { connect } from 'react-redux'

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

class Sheet extends PureComponent {

  state = {windowWidth: window.innerWidth};

  drawSheet = () => {
    console.log('drawing');
    new SheetDrawer(
      this.sheetContainer,
      [this.props.intro,...this.props.sections,this.props.ending].filter(x => x !== null),
      {width: this.state.windowWidth, signature:this.props.signature}   
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
  width: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
      signature: state.settings.key,
      intro: state.intro,
      sections: state.sections,
      ending: state.ending
  }
}

export default connect(mapStateToProps)(Sheet);