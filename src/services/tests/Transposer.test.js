import Transposer from '../Transposer'


describe('>>>TRANSPOSER TESTS',()=>{

    it('+++ transpose C BLUES SCALE TO Eb', () => {
        const transposer = new Transposer('Eb');
        // есть знак при ключе
        const trKey = transposer.transpose('C/4','8');
        expect(trKey).toEqual({vexKey:'E/4', vexAccidental: undefined})

        const trKey2 = transposer.transpose('Eb/4','8');
        expect(trKey2).toEqual({vexKey:'Gb/4', vexAccidental:'b'})

        // есть знак при ключе
        const trKey3 = transposer.transpose('F/4','8');
        expect(trKey3).toEqual({vexKey:'A/4', vexAccidental: undefined})

        const trKey4 = transposer.transpose('F#/4','8');
        expect(trKey4).toEqual({vexKey:'An/4', vexAccidental: 'n'})

        const trKey5 = transposer.transpose('G/4','8');
        expect(trKey5).toEqual({vexKey:'B/4', vexAccidental: undefined})

        const trKey6 = transposer.transpose('Bb/4','8');
        expect(trKey6).toEqual({vexKey:'Db/5', vexAccidental: 'b'})

        const trKey7 = transposer.transpose('C/5','8');
        expect(trKey7).toEqual({vexKey:'E/5', vexAccidental: undefined})
    });

    it('+++ transpose C BLUES SCALE TO A', () => {
        const transposer = new Transposer('A');
        // есть знак при ключе
        const trKey = transposer.transpose('C/4','8');
        expect(trKey).toEqual({vexKey:'A/3', vexAccidental: undefined})

        const trKey2 = transposer.transpose('Eb/4','8');
        expect(trKey2).toEqual({vexKey:'Cn/4', vexAccidental:'n'})

        // есть знак при ключе
        const trKey3 = transposer.transpose('F/4','8');
        expect(trKey3).toEqual({vexKey:'D/4', vexAccidental: undefined})

        const trKey4 = transposer.transpose('F#/4','8');
        expect(trKey4).toEqual({vexKey:'D#/4', vexAccidental: '#'})

        const trKey5 = transposer.transpose('G/4','8');
        expect(trKey5).toEqual({vexKey:'E/4', vexAccidental: undefined})

        const trKey6 = transposer.transpose('Bb/4','8');
        expect(trKey6).toEqual({vexKey:'Gn/4', vexAccidental: 'n'})

        const trKey7 = transposer.transpose('C/5','8');
        expect(trKey7).toEqual({vexKey:'A/4', vexAccidental: undefined})
    });

    it('+++ do not transpose rests', () => {
        const transposer = new Transposer('Eb');
        const trKey = transposer.transpose('B/4','8r');
        expect(trKey).toEqual({vexKey:'B/4', vexAccidental: undefined})
    });

    it('+++ transpose naturals', () => {
        const transposer = new Transposer('D');

        //Eb-En-Eb => Fn-F#-Fn
        const trKey = transposer.transpose('Eb/4','8');
        expect(trKey).toEqual({vexKey:'Fn/4', vexAccidental: 'n'})

        const trKey2 = transposer.transpose('En/4','8');
        expect(trKey2).toEqual({vexKey:'F#/4', vexAccidental: '#'})

        const trKey3 = transposer.transpose('Eb/4','8');
        expect(trKey3).toEqual({vexKey:'Fn/4', vexAccidental: 'n'})

        //Ab-An-Ab => Bb-Bn-Bb  
        const trKey4 = transposer.transpose('Ab/4','8');
        expect(trKey4).toEqual({vexKey:'Bb/4', vexAccidental: 'b'})

        const trKey5 = transposer.transpose('An/4','8');
        expect(trKey5).toEqual({vexKey:'Bn/4', vexAccidental: 'n'})

        const trKey6 = transposer.transpose('Ab/4','8');
        expect(trKey6).toEqual({vexKey:'Bb/4', vexAccidental: 'b'})

        
    });

    it('+++ transpose with reset (multiple bars)', () => {
        const transposer = new Transposer('D');

        const trKey = transposer.transpose('Eb/4','8');
        expect(trKey).toEqual({vexKey:'Fn/4', vexAccidental: 'n'})

        const trKey2 = transposer.transpose('En/4','8');
        expect(trKey2).toEqual({vexKey:'F#/4', vexAccidental: '#'})

        const trKey4 = transposer.transpose('Eb/4','8');
        expect(trKey4).toEqual({vexKey:'Fn/4', vexAccidental: 'n'})

        transposer.resetAccidentals();

        const trKey3 = transposer.transpose('En/4','8');
        expect(trKey3).toEqual({vexKey:'F/4', vexAccidental: undefined})

        
    });



});