import { intros } from '../presets'

const initialState = intros[0];

export default function intro(state = initialState, action) {
  switch (action.type) {
    case 'SET_INTRO':
      return (action.id === null ? null : intros.find((intro) => { return intro.id === action.id }));
    // case 'SET_KEY':
    //   return state             
    // const {phrases , ...introObject} = (id === null ? undefined : intros.find((intro) => { return intro.id === id }));
    // this.setState({ intro: {...introObject, phrases: generateIds(phrases)} });
    default:
      return state
  }
}