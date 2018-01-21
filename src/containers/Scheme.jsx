import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { setIntro } from '../actions/intro'
import { setEnding } from '../actions/ending'
import { setPattern, addSection, removeAll } from '../actions/sections'

import Accordion from './Accordion'
import Intro from './Intro'
import Ending from './Ending'

import Section from './Section'


class Scheme extends Component {

  render() {

    return (
      <div className='scheme-wrapper'>
        <button className='scheme-button' onClick={this.props.removeAll}> Очистить </button>
        <button className='scheme-button' onClick={this.props.addSection}> Добавить </button>

        <div className='scheme'>
          <Accordion type='INTRO'>
            <Intro intro={this.props.intro} setIntro={this.props.setIntro} />
          </Accordion>

          {this.props.sections.map((s, index) => {
            return (
              <Accordion key={index} type = 'PROGRESSION' handPatternOnChange={this.props.setPattern}>
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
    removeAll: () => { dispatch(removeAll()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scheme);