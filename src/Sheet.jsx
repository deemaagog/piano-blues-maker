import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';



class Sheet extends PureComponent {

    componentDidMount () {
        console.log('sheet did mount');
    }

    componentDidUpdate () {

    }

    componentWillUnmount () {

    }

    render() {
        console.log(this.props.width - 350);

        this.props.sections.forEach((section) => {
            section.phrases.forEach((phrase) => {
                phrase.bars.forEach((bar) => {
                    
                    
                });
            });
        });

        return (
            <div className='sheet'>
                {}
            </div>
        );
    }
}

Sheet.propTypes = {
    sections: PropTypes.array,

};

export default Sheet;