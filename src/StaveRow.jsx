import React, { Component } from 'react';
import Section from './Section'

class StaveRow extends Component {
    
    render() {

        return (
            <div className='StaffRow'>
                {this.props.sections.map((s)=>
                    {
                     return (<Section key={s.id} deleteSection={this.props.deleteSection} sectionsPerRow={this.props.sectionsPerRow} id={s.id}>  </Section>) 
                    }
                )}
            </div>
        );
    }
}

export default StaveRow;