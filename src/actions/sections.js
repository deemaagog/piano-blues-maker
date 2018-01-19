export const setTempo = (sectionId, patternId, hand) => {
    return {
      type: 'SET_PATTERN',
      sectionId,
      patternId,
      hand
    }
  }