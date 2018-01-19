import { intros } from '../presets'

const initialState = intros[0];

export default function intro(state = initialState, action) {
    switch (action.type) {
        case 'SET':
          return (action.id === null ? null : intros.find((intro) => { return intro.id === action.id }));
        default:
          return state  
    }
}