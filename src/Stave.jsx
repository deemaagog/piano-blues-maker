import React, {PureComponent } from 'react';
import StaveRow from './StaveRow'

class Stave extends PureComponent {
    
    render() {
        console.log('stave render');
        
        const clone = [...this.props.sections];
        const rows = [];
        
        let i = 1;
        while (clone.length) {
            let chunk = clone.splice(0,this.props.sectionsPerRow);
            
            rows.push(<StaveRow key = {i} sections = {chunk} deleteSection={this.props.deleteSection} sectionsPerRow={this.props.sectionsPerRow}>   </StaveRow>);
            i = i+1;
        }

        return (
            <div>{rows}</div>
        );
        
    }
}

export default Stave;