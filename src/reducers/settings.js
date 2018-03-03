const initialState = {
    tempo: 90,
    swing: true,
    key: 'C',
    scale: 90
}

export default function header (state = initialState, action) {
    switch (action.type) {
        case 'SET_KEY':
            return {...state, key: action.key}
        case 'SET_TEMPO':
            return {...state, tempo: action.tempo}
        case 'TOGGLE_SWING':
            return {...state, swing: !state.swing}
        case 'SET_SCALE':
            return {...state, scale: action.scale}            
        default:
            return state
  }
}