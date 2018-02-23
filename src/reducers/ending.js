import { endings } from '../presets'

const initialState = endings[0];
//const initialState = null;

export default function intro(state = initialState, action) {
    switch (action.type) {
        case 'SET_ENDING':
          return (action.id === null ? null : endings.find((ending) => { return ending.id === action.id }));
        // case 'SET_ENDING_DATA':
        //   return action.data;  
        case 'REMOVE_ALL':  
          return null
        default:
          return state  
    }
}