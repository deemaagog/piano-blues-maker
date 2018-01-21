import presets from '../presets'

const initialState = [];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function createNewSection() {
  const { phrases: lhPhrases, ...leftHand } = presets.leftHandPatterns[0];
  const { phrases: rhPhrases, ...rightHand } = presets.rightHandPatterns[0];

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

function generateIds(phrases, sectionId, vName) {

  const voicesArray = vName ? [{ name: vName, shortName: vName.charAt(0) }] : [{ name: 'trebleVoices', shortName: 't' }, { name: 'bassVoices', shortName: 'v' }];

  return phrases.map((phrase, phraseIndex) => {
    const newBars = phrase.bars.map((bar, barIndex) => {
      const voicesObject = {};
      voicesArray.forEach(v => {
        const newVoices = bar[v.name].map((voice, voiceIndex) => {
          const newNotes = voice.notes.map((note, noteIndex) => {
            return { ...note, ...{ id: `${sectionId}-${phraseIndex}-${barIndex}-${v.shortName}-${voiceIndex}-${noteIndex}` } }
          })
          return { ...voice, ...{ notes: newNotes } }
        });
        voicesObject[v.name] = newVoices;
      })
      return { ...bar, ...voicesObject }
    });
    return { ...phrase, ...{ bars: newBars } }
  })
}


export default function sections(state = initialState, action) {
  switch (action.type) {
    case 'SET_PATTERN':
      const { hand, patternId, sectionId } = action;
      const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');
      const { phrases: patternPhrases, ...patternObject } = presets[`${hand}HandPatterns`].find((pattern) => { return pattern.id === patternId });

      // generate Ids for all notes
      const phrases = generateIds(patternPhrases, sectionId, voicesObjectName);

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
      return [...state, createNewSection()]
    case 'REMOVE_SECTION':
      return state.filter(item => item.id !== action.id)  
    case 'REMOVE_ALL':
      return []
    default:
      return state
  }
}