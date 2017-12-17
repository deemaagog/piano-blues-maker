import React, { Component } from 'react';
import Bar from './Bar'

class StaveRow extends Component {
    
    render() {

        return (
            <div className='StaffRow'>
                {this.props.bars.map((s,index)=>
                    {
                        return (<Bar key={s.id} data={s} barsPerRow={this.props.barsPerRow} index={index} id={s.id}/>)
                    }    
                )}
            </div>
        );
    }
}

export default StaveRow;