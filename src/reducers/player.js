const initialState = {
    isPlaying: false,
    isLoading: true
}

export default function player (state = initialState, action) {
    switch (action.type) {
        case 'PLAY':
            return {...state, isPlaying: true}
        case 'STOP':
            return {...state, isPlaying: false}
        case 'PLAY_ENDED':
            return {...state, isPlaying: false}
        case 'SAMPLES_LOADED':
            return {...state, isLoading: false}            
        default:
            return state
  }
}