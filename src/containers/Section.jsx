import React, { Component } from 'react';

import LeftHandSection from './LeftHandSection'
import RightHandSection from './RightHandSection'


class Section extends Component {

  state = {
    isOpened: false
  }

  delete = () => {
    this.props.deleteSection(this.props.id);
  }

  add = () => {

  }

  open = () => {
    this.setState({isOpened: !this.state.isOpened});
  }

  HandPatternOnChange = (patternId, hand) => {
    this.props.HandPatternOnChange(this.props.section.id, patternId, hand);
  }

  render() {
    //console.log(`render ${this.props.id}`);
    return (
      <div className='section' >
        <div className='section-type' onClick={this.open}>
         <i className={this.state.isOpened?'section-opened':'section-closed'} /> 
         {this.props.children}
        </div> 
        {this.state.isOpened && 
          <div className='section-details'>
            <RightHandSection pattern={this.props.section.rightHand} patternOnChange={this.HandPatternOnChange}/>
            <LeftHandSection pattern={this.props.section.leftHand} patternOnChange={this.HandPatternOnChange}/>
          </div>
        }
      </div>
    );
  }
}

export default Section;