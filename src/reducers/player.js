const initialState = {
    isPlaying: false,
    isLoading: true
}

export default function player (state = initialState, action) {
    switch (action.type) {
        case 'PLAY':
            return {...state, ...{isPlaying: true}}
        case 'STOP':
            return {...state, ...{isPlaying: false}}    
        default:
            return state
  }
}