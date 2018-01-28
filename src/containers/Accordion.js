import React, { Component } from 'react';

class Accordion extends Component {

  state = {
    isOpened: false
  }

  open = () => {
    this.setState({ isOpened: !this.state.isOpened });
  }

  render() {
    return (
      <div className='section' >

        <div className='section-header'>
          <div className='section-type' onClick={this.open}>
            <i className={this.state.isOpened ? 'section-opened' : 'section-closed'} />
            {this.props.type}
          </div>
          <div className='section-buttons'>
            {this.props.type === 'PROGRESSION' && <span className='fa fa-close' onClick={this.props.removeSection}/>}
          </div>
        </div>
        {this.state.isOpened &&
          <div className='section-details'>
            {this.props.children}
          </div>
        }
      </div>
    );
  }
}

export default Accordion;