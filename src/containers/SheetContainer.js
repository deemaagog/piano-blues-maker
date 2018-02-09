import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sheet from './Sheet'
import {update} from '../actions/sheet'

class SheetContainer extends Component {
  render() {
    return (
      <div>
        <div className = {this.props.isOutdated ? 'blur': ''}>
          <Sheet shouldUpdate = {this.props.isOutdated} />
        </div>
        {this.props.isOutdated && <button className='btn-update' onClick={this.props.update}/>}
      </div>
    );
  }
}

SheetContainer.propTypes = {
  isOutdated: PropTypes.bool,
  update: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    isOutdated: state.sheet.isOutdated
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: () => dispatch(update())
  }  
}

export default connect(mapStateToProps,mapDispatchToProps)(SheetContainer);