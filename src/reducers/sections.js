import presets from '../presets'
import {generateId,getRandomInt} from '../helpers'

const initialState = [createSection(true)];

function createSection(random = false) {

  const rightHandDemoPatterns = presets.rightHandPatterns.filter(p => p.demo);

  const lhPatternInd = random ? getRandomInt(1,presets.leftHandPatterns.length): 0;
  const rhPatternInd = random ? getRandomInt(1,rightHandDemoPatterns.length) : 0;

  const { phrases: lhPhrases, ...leftHand } = presets.leftHandPatterns[lhPatternInd];
  const { phrases: rhPhrases, ...rightHand } = rightHandDemoPatterns[rhPatternInd];

  lhPhrases.forEach((lhPhrase, phraseIndex) => {
    lhPhrase.bars.forEach((bar, barIndex) => {
      bar.trebleVoices = rhPhrases[phraseIndex].bars[barIndex].trebleVoices;
    })
  })

  return {
    id: generateId(),
    type: 'PROGRESSION',
    leftHand,
    rightHand,
    phrases: lhPhrases
  }
}

export default function sections(state = initialState, action) {
  switch (action.type) {
    case 'SET_PATTERN':
      const { hand, patternId, sectionId } = action;
      const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');
      const { phrases, ...patternObject } = presets[`${hand}HandPatterns`].find((pattern) => { return pattern.id === patternId });

      const newSections = state.map(section => {
        if (section.id === sectionId) {
          const newPhrases = section.phrases.map((phrase, phraseIndex) => {
            const newBars = phrase.bars.map((bar, barIndex) => {
              return { ...bar, ...{ [voicesObjectName]: phrases[phraseIndex].bars[barIndex][voicesObjectName] } }
            })
            return { ...phrase, ...{ bars: newBars } }
          })
          return { ...section, ...{ [`${hand}Hand`]: patternObject }, ...{ phrases: newPhrases } }
        }
        return section;
      });

      return newSections;
    case 'ADD_SECTION':
      return [...state, createSection()]
    case 'CLONE_SECTION':

      const index = state.findIndex(s => s.id === action.id);
      const { leftHand, rightHand, phrases:phrasesOriginal } = state[index];
      const phrasesCopy = phrasesOriginal.map(phrase => {
        const barsCopy = phrase.bars.map(bar => {
          // const trebleVoicesCopy = bar.trebleVoices.map(v => {
          //   return v
          // })
          // const bassVoicesCopy = bar.bassVoices.map(v => {
          //   return v
          // })
          //return {...bar, ...{trebleVoices:trebleVoicesCopy},...{bassVoices:bassVoicesCopy}}
          return {...bar, trebleVoices:[...bar.trebleVoices], bassVoices:[...bar.bassVoices]}
        })
        return { ...phrase, bars: barsCopy }
      })

      const newSection = { id: generateId(), leftHand:{...leftHand}, rightHand:{...rightHand}, ...{ phrases: phrasesCopy } }
      const sectionsClone = [...state];

      sectionsClone.splice(index + 1, 0, newSection);
      
      return sectionsClone

    case 'MOVE_SECTION':
      const { id, direction } = action;

      const oldIndex = state.findIndex(s => s.id === id);
      const newIndex = (oldIndex + (direction === 'UP' ? -1 : 1));

      if (newIndex < 0 || newIndex >= state.length) {
        return state
      }

      const section = state[oldIndex];

      const sectionsCopy = [...state];

      sectionsCopy.splice(oldIndex, 1);
      sectionsCopy.splice(newIndex, 0, section);

      return sectionsCopy
    case 'REMOVE_SECTION':
      return state.filter(item => item.id !== action.id)
    case 'REMOVE_ALL':
      return []
    default:
      return state
  }
}