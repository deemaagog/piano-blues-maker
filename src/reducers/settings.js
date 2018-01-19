const initialState = {
    tempo: 70,
    swing: true,
    key: 'C'
}

export default function header (state = initialState, action) {
    switch (action.type) {
        case 'SET_KEY':
            return {...state, ...{key: action.key}}
        case 'SET_TEMPO':
            return {...state, ...{tempo: action.tempo}}
        case 'TOGGLE_SWING':
            return {...state, ...{swing: !state.swing}}        
        default:
            return state
  }
}