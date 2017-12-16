import React, { Component } from 'react';
//import Section from './Section'
import Bar from './Bar'

class StaveRow extends Component {
    
    render() {

        return (
            <div className='StaffRow'>
                {this.props.sections.map((s,index)=>
                    // {
                    //  return (<Section key={s.id} index={index} deleteSection={this.props.deleteSection} sectionsPerRow={this.props.sectionsPerRow} id={s.id}>  </Section>) 
                    // }
                    {
                        return (<Bar key={s.id} notes={s.notes} sectionsPerRow={this.props.sectionsPerRow} index={index} id={s.id}/>)
                    }    
                )}
            </div>
        );
    }
}

export default StaveRow;