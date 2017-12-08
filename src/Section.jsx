import React, { Component } from 'react';
import bgstave from './bgstave.jpg'

const bgStyle = {
    backgroundImage: 'url(' + bgstave + ')',
    backgroundSize: '100% 100%'
}

class Section extends Component {

    delete = () => {
        this.props.deleteSection(this.props.id);
    }

    render() {
        const classNames = `Section col-${this.props.sectionsPerRow}`;
        return (
            <div style={bgStyle} className={classNames}>
                <span className='closeSection  fa fa-close' onClick={this.delete}></span>
                {this.props.id}
            </div>
        );
    }
}

export default Section;