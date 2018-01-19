export default function header (state = {isPlaying: false}, action) {
    switch (action.type) {
        case 'PLAY':
            return {...state, ...{isPlaying: true}}
        case 'STOP':
            return {...state, ...{isPlaying: false}}    
        default:
            return state
  }
}