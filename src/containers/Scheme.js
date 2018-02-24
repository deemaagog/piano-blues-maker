import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { setIntro } from '../actions/intro'
import { setEnding } from '../actions/ending'
import { setPattern, addSection, removeAll, removeSection, cloneSection, moveSection} from '../actions/sections'

import Accordion from './Accordion'
import Intro from '../components/Intro'
import Ending from '../components/Ending'
import Section from '../components/Section'


class Scheme extends Component {

  render() {

    return (
      <div className='scheme-wrapper'>
        <div className='scheme-btn-group'>
          <button className='scheme-button' onClick={this.props.removeAll}> Clear all </button>
          <button className='scheme-button' onClick={this.props.addSection}> Add progression </button>
        </div>

        <div className='scheme'>
          <Accordion type='INTRO'>
            <Intro intro={this.props.intro} setIntro={this.props.setIntro} />
          </Accordion>

          {this.props.sections.map((s, index) => {
            return (
              <Accordion key={s.id}
                type = 'PROGRESSION'
                index = {index + 1}
                removeSection = {()=>this.props.removeSection(s.id)}
                cloneSection = {()=>this.props.cloneSection(s.id)}
                moveSectionUp = {()=>this.props.moveSection(s.id,'UP')}
                moveSectionDown = {()=>this.props.moveSection(s.id,'DOWN')}
                >
                <Section section = {s} setPattern={this.props.setPattern}/>
              </Accordion>
            )
          }
          )}

          <Accordion type='ENDING'>
            <Ending ending={this.props.ending} setEnding={this.props.setEnding} />
          </Accordion>

        </div>
      </div>
    );
  }
}

Scheme.propTypes = {
  sections: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    intro: state.intro,
    sections: state.sections,
    ending: state.ending,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIntro: (id) => dispatch(setIntro(id)),
    setEnding: (id) => dispatch(setEnding(id)),
    setPattern: (sectionId, patternId, hand) => dispatch(setPattern(sectionId, patternId, hand)),
    addSection: () => { dispatch(addSection()) },
    removeAll: () => { dispatch(removeAll()) },
    moveSection: (id, direction) => { dispatch(moveSection(id, direction)) },
    cloneSection: (id) => { dispatch(cloneSection(id)) },
    removeSection: (id) => { dispatch(removeSection(id)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scheme);