import { endings } from '../presets'

const initialState = null;

export default function intro(state = initialState, action) {
    switch (action.type) {
        case 'SET_ENDING':
          return (action.id === null ? null : endings.find((ending) => { return ending.id === action.id }));
        default:
          return state  
    }
}