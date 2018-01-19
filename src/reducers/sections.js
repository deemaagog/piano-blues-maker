import presets from '../presets'

const initialState = [];

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
            const {hand,patternId,sectionId} = action;
            const voicesObjectName = (hand === 'left' ? 'bassVoices' : 'trebleVoices');
            const { phrases: patternPhrases, ...patternObject } = presets[`${hand}HandPatterns`].find((pattern) => { return pattern.id === patternId });

            // generate Ids for all notes
            const phrases = generateIds(patternPhrases, sectionId, voicesObjectName);

            const newSections = this.state.sections.map(section => {
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
        default:
            return state
    }
}