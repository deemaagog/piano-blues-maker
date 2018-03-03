import { endings } from '../presets'
import { getRandomInt } from '../helpers'

const initialState = endings[getRandomInt(0, endings.length)];

export default function intro(state = initialState, action) {
    switch (action.type) {
        case 'SET_ENDING':
          return (action.id === null ? null : endings.find((ending) => { return ending.id === action.id }));
        case 'REMOVE_ALL':  
          return null
        default:
          return state  
    }
}