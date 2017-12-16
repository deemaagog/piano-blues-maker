import React, { Component } from 'react';
import clef from './clef.jpeg'
import middle from './middle.jpeg'
import end from './end.jpeg'

import LeftHandSection from './LeftHandSection'
import RightHandSection from './RightHandSection'

// const bgStyle = {
//     backgroundImage: 'url(' + clef + '), url('+ middle + ')',
//     backgroundRepeat: 'no-repeat, repeat',
//     backgroundSize: '35px 100%'
// }

const bgStyleMain = {
  backgroundImage: `url(${middle})`,
  backgroundRepeat: 'repeat'
}

const bgStylePanel = {
  backgroundImage: `url(${end})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '35px'
}

class Section extends Component {

  getBgStyleClef = () => {
    return ({
      backgroundImage: `url(${this.props.index === 0 ? clef : middle})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '35px'
    })
  }

  delete = () => {
    this.props.deleteSection(this.props.id);
  }

  add = () =>{

  }

  componentDidMount() {
    console.log(`did mount ${this.props.id}`);
  }

  componentDidUpdate() {
    console.log(`did update ${this.props.id}`);
  }

  render() {
    console.log(`render ${this.props.id}`);
    const classNames = `Section col-${this.props.sectionsPerRow}`;
    return (
      <div className={classNames}>
        <div style={this.getBgStyleClef()} className='Section-clef'> </div>
        <div style={bgStyleMain} className='Section-main'>
          <RightHandSection />
          <LeftHandSection />
        </div>
        <div style={bgStylePanel} className='Section-panel'>
          <div className='deleteSection' onClick={this.delete}>
            <span className='Section-panel-button fa fa-close' />
          </div>
          <div className='addSection' onClick={this.add}>
            <span className='Section-panel-button fa fa-arrow-right' />
          </div>
          <div className='addSection' onClick={this.add}>
            <span className='Section-panel-button fa fa-arrow-left' />
          </div>
        </div>
      </div>
    );
  }
}

export default Section;