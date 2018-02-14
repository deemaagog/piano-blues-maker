import React from 'react'
import { endings } from '../../presets'

import endingReducer from '../ending'

describe('>>>R E D U C E R --- Test ending Reducers',()=>{
    it('+++ reducer for SET_ENDING', () => {
        const initialState = endings[0];
        const newState = endingReducer(initialState,{type:"SET_ENDING",id:null})
        expect(newState).toEqual(null)
    });

    it('+++ reducer for SET_ENDING', () => {
        const initialState = null;
        const newState = endingReducer(initialState,{type:"SET_ENDING",id:101})
        expect(newState).toEqual(endings.find(x => { return x.id === 101}))
    });
});