import {setEnding} from '../ending'

describe('>>>A C T I O N --- Test ending actions',()=>{
    it('+++ actionCreator setEnding', () => {
        const set = setEnding(2)
        expect(set).toEqual({type:"SET_ENDING",id:2})
    });
});