import presets from '../presets'

const initialState = [createSection(true)];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createSection(random = false) {

  const lhPatternId = random ? getRandomInt(1,presets.leftHandPatterns.length): 0;
  const rhPatternId = random ? getRandomInt(1,presets.rightHandPatterns.length): 0;

  const { phrases: lhPhrases, ...leftHand } = presets.leftHandPatterns[lhPatternId];
  const { phrases: rhPhrases, ...rightHand } = presets.rightHandPatterns[rhPatternId];

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

// function generateIds(phrases, sectionId, vName) {

//   const voicesArray = vName ? [{ name: vName, shortName: vName.charAt(0) }] : [{ name: 'trebleVoices', shortName: 't' }, { name: 'bassVoices', shortName: 'v' }];

//   return phrases.map((phrase, phraseIndex) => {
//     const newBars = phrase.bars.map((bar, barIndex) => {
//       const voicesObject = {};
//       voicesArray.forEach(v => {
//         const newVoices = bar[v.name].map((voice, voiceIndex) => {
//           const newNotes = voice.notes.map((note, noteIndex) => {
//             return { ...note, ...{ id: `${sectionId}-${phraseIndex}-${barIndex}-${v.shortName}-${voiceIndex}-${noteIndex}` } }
//           })
//           return { ...voice, ...{ notes: newNotes } }
//         });
//         voicesObject[v.name] = newVoices;
//       })
//       return { ...bar, ...voicesObject }
//     });
//     return { ...phrase, ...{ bars: newBars } }
//   })
// }


export default function sections(state = initialState, action) {
  switch (action.type) {
    case 'SET_PATTERN':
      const { hand, patternId, sectionId } = action;
      const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');
      const { phrases, ...patternObject } = presets[`${hand}HandPatterns`].find((pattern) => { return pattern.id === patternId });

      // generate Ids for all notes
      //const phrases = generateIds(patternPhrases, sectionId, voicesObjectName);

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
        return { ...phrase, ...{ bars: barsCopy } }
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