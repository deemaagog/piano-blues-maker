import React, { Component } from 'react';
import buildScore from './ScoreBuilder'

class Bar extends Component {

    componentDidUpdate() {
        console.log(`did update ${this.props.id}`);

    }

    componentDidMount() {

        console.log(`did mount ${this.props.id}`);
        buildScore(this.barContainer,this.props);

    }

    render() {

        console.log(`render ${this.props.id}`);
        return (
            <div className={`Bar col-${this.props.barsPerRow}`} ref={(x) => this.barContainer = x} />
        );
    }
}

export default Bar;