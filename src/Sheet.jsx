import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SheetDrawer from './lib/SheetDrawer';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

class Sheet extends PureComponent {

  drawSheet = () => {
    new SheetDrawer(
      this.sheetContainer,
      [this.props.intro,...this.props.sections,this.props.ending],
      {width: this.props.width, signature:this.props.signature}   
    ).draw();
  }  

  componentDidMount() {
    console.log('sheet did mount');
    this.drawSheet();
  }

  componentDidUpdate() {
    console.log('sheet did update');
    this.drawSheet();
  }

  render() {
    console.log('sheet render');
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

export default Sheet;