export const setTempo = (value) => {
  return {
    type: 'SET_TEMPO',
    tempo: value
  }
}

export const setKey = (value) => {
  return {
    type: 'SET_KEY',
    key: value
  }
}

export const toggleSwing = () => {
  return {
    type: 'TOGGLE_SWING'
  }
}    