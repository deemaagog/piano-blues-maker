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

        <div className='section-header' >
          <div className='section-type' onClick={this.open}>
            <i className={this.state.isOpened ? 'section-opened' : 'section-closed'} />
            {`${this.props.type} ${this.props.index}`}
          </div>
          {this.props.type === 'PROGRESSION' &&
          <div className='section-buttons'>
             <span title = 'clone progression' className='btn-section fa fa-plus' onClick={this.props.cloneSection}/>
             <span title = 'move progression up' className='btn-section fa fa-arrow-up' onClick={this.props.moveSectionUp}/>
             <span title = 'move progression down' className='btn-section fa fa-arrow-down' onClick={this.props.moveSectionDown}/>
             <span title = 'remove progression' className='btn-section fa fa-close' onClick={this.props.removeSection}/>
          </div>
          }
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

Accordion.defaultProps = {
  index: ''
}

export default Accordion;