const initialState = {
  isOutdated:false
}

export default function sheet(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SHEET':
      return {isOutdated : false }
    case 'SET_INTRO':
      return {isOutdated : true }
    case 'SET_ENDING':
      return {isOutdated : true }
    case 'SET_PATTERN':
      return {isOutdated : true }
    case 'ADD_SECTION':
      return {isOutdated : true }
    case 'REMOVE_SECTION':
      return {isOutdated : true }  
    case 'SET_KEY':
      return {isOutdated : true }
    case 'SET_SCALE':
      return {isOutdated : false }  
    case 'REMOVE_ALL':
      return {isOutdated : false }
    case 'CLONE_SECTION':
      return {isOutdated : true }
    case 'MOVE_SECTION':
      return {isOutdated : true }      
    default:
      return state
  }
}    