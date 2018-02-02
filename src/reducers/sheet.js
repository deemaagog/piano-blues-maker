const initialState = {
  isOutdated:false
}

export default function sheet(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SHEET':
      return { ...state, ...{ isOutdated : false }}
    case 'SET_INTRO':
      return { ...state, ...{ isOutdated : true }}
    case 'SET_ENDING':
      return { ...state, ...{ isOutdated : true }}
    case 'SET_PATTERN':
      return { ...state, ...{ isOutdated : true }}
    case 'ADD_SECTION':
      return { ...state, ...{ isOutdated : true }}
    case 'REMOVE_SECTION':
      return { ...state, ...{ isOutdated : true }}  
    case 'SET_KEY':
      return { ...state, ...{ isOutdated : true }}
    case 'REMOVE_ALL':
      return { ...state, ...{ isOutdated : true }}  
    default:
      return state
  }
}    