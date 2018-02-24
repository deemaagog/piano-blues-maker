import { intros } from '../presets'

const initialState = intros[0];

export default function intro(state = initialState, action) {
  switch (action.type) {
    case 'SET_INTRO':
      return (action.id === null ? null : intros.find((intro) => { return intro.id === action.id }));
    case 'REMOVE_ALL':  
      return null  
    default:
      return state
  }
}