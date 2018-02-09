export const setPattern = (sectionId, patternId, hand) => {
  return {
    type: 'SET_PATTERN',
    sectionId,
    patternId,
    hand
  }
}

export const addSection = () => {
  return {
    type: 'ADD_SECTION'
  }
}

export const removeSection = (id) => {
  return {
    type: 'REMOVE_SECTION',
    id
  }
}

export const cloneSection = (id) => {
  return {
    type: 'CLONE_SECTION',
    id
  }
}

export const moveSection = (id, direction) => {
  return {
    type: 'MOVE_SECTION',
    direction,
    id
  }
}

export const removeAll = () => {
  return {
    type: 'REMOVE_ALL'
  }
}