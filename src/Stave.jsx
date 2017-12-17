import React, { PureComponent } from 'react';
import StaveRow from './StaveRow'

class Stave extends PureComponent {

    render() {
        console.log('stave render');

        const bars = [];

        [...this.props.sections].forEach((section) => {
            section.phrases.forEach((phrase) => {
                bars.push(...phrase.bars);
            });
        });

        const rows = [];

        let i = 1;
        
        while (bars.length) {
            let chunk = bars.splice(0, this.props.barsPerRow);

            rows.push(<StaveRow key={i} bars={chunk} deleteSection={this.props.deleteSection} barsPerRow={this.props.barsPerRow}>   </StaveRow>);
            i = i + 1;
        }

        return (
            <div>{rows}</div>
        );

    }
}

export default Stave;