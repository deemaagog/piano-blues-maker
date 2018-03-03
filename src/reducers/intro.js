import { intros } from '../presets'

import { getRandomInt } from '../helpers'

const initialState = intros[getRandomInt(0,intros.length)];

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