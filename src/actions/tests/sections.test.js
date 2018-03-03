import { setPattern, addSection, removeSection, cloneSection, moveSection, removeAll } from '../sections'

describe('>>>A C T I O N --- Test sections actions', () => {
    it('+++ actionCreator setPattern', () => {
        const set = setPattern('qwe',202,'left')
        expect(set).toEqual({ type: "SET_PATTERN", sectionId: 'qwe', patternId: 202, hand:'left'})
    });

    it('+++ actionCreator addSection', () => {
        const set = addSection()
        expect(set).toEqual({ type: "ADD_SECTION"})
    });

    it('+++ actionCreator removeSection', () => {
        const set = removeSection('qwe')
        expect(set).toEqual({ type: "REMOVE_SECTION", id: 'qwe' })
    });

    it('+++ actionCreator cloneSection', () => {
        const set = cloneSection('qwe')
        expect(set).toEqual({ type: "CLONE_SECTION", id: 'qwe' })
    });


    it('+++ actionCreator moveSection', () => {
        const set = moveSection('qwe','up')
        expect(set).toEqual({ type: "MOVE_SECTION", id: 'qwe', direction: 'up'})
    });


    it('+++ actionCreator removeAll', () => {
        const set = removeAll()
        expect(set).toEqual({ type: "REMOVE_ALL"})
    });
});