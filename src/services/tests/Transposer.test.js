import Transposer from '../Transposer'


describe('>>>TRANSPOSER TESTS',()=>{

    it('+++ transpose C BLUES SCALE TO Eb', () => {
        const transposer = new Transposer('Eb');
        // есть знак при ключе
        const trKey = transposer.transpose({"step": "C", "oct": 4},'8');
        expect(trKey).toEqual({trStep:"E",trAccidental:"",trOctave:"4", trPitch:"Eb4"})

        const trKey2 = transposer.transpose({"step": "E", "oct": 4, "acc":"b"},'8');
        expect(trKey2).toEqual({trStep:"G",trAccidental:"b",trOctave:"4", trPitch:"Gb4"})

        // есть знак при ключе
        const trKey3 = transposer.transpose({"step": "F", "oct": 4},'8');
        expect(trKey3).toEqual({trStep:"A",trAccidental:"",trOctave:"4", trPitch:"Ab4"})

        const trKey4 = transposer.transpose({"step": "F", "oct": 4, "acc":"#"},'8');
        expect(trKey4).toEqual({trStep:"A",trAccidental:"n",trOctave:"4", trPitch:"A4"})

        const trKey5 = transposer.transpose({"step": "G", "oct": 4},'8');
        expect(trKey5).toEqual({trStep:"B",trAccidental:"",trOctave:"4", trPitch:"Bb4"})

        const trKey6 = transposer.transpose({"step": "B", "oct": 4, "acc":"b"},'8');
        expect(trKey6).toEqual({trStep:"D",trAccidental:"b",trOctave:"5", trPitch:"Db5"})

        const trKey7 = transposer.transpose({"step": "C", "oct": 5},'8');
        expect(trKey7).toEqual({trStep:"E",trAccidental:"",trOctave:"5", trPitch:"Eb5"})
    });

    it('+++ transpose C BLUES SCALE TO A', () => {
        const transposer = new Transposer('A');
        // есть знак при ключе
        const trKey = transposer.transpose({"step": "C", "oct": 4},'8');
        expect(trKey).toEqual({trStep:"A",trAccidental:"",trOctave:"3", trPitch:"A3"})

        const trKey2 = transposer.transpose({"step": "E", "oct": 4, "acc":"b"},'8');
        expect(trKey2).toEqual({trStep:"C",trAccidental:"n",trOctave:"4", trPitch:"C4"})

        // есть знак при ключе
        const trKey3 = transposer.transpose({"step": "F", "oct": 4},'8');
        expect(trKey3).toEqual({trStep:"D",trAccidental:"",trOctave:"4", trPitch:"D4"})

        const trKey4 = transposer.transpose({"step": "F", "oct": 4, "acc":"#"},'8');
        expect(trKey4).toEqual({trStep:"D",trAccidental:"#",trOctave:"4", trPitch:"D#4"})

        const trKey5 = transposer.transpose({"step": "G", "oct": 4},'8');
        expect(trKey5).toEqual({trStep:"E",trAccidental:"",trOctave:"4", trPitch:"E4"})

        const trKey6 = transposer.transpose({"step": "B", "oct": 4, "acc":"b"},'8');
        expect(trKey6).toEqual({trStep:"G",trAccidental:"n",trOctave:"4", trPitch:"G4"})

        const trKey7 = transposer.transpose({"step": "C", "oct": 5},'8');
        expect(trKey7).toEqual({trStep:"A",trAccidental:"",trOctave:"4", trPitch:"A4"})
    });

    it('+++ do not transpose rests', () => {
        const transposer = new Transposer('Eb');
        const trKey = transposer.transpose({"step": "B", "oct": 4},'8r');
        expect(trKey).toEqual({trStep:"B",trAccidental:"",trOctave:4})
    });

    it('+++ transpose naturals', () => {
        const transposer = new Transposer('D');

        //Eb-En-Eb => Fn-F#-Fn
        const trKey = transposer.transpose({"step": "E", "oct":4, "acc":"b"},'8');
        expect(trKey).toEqual({trStep:"F",trAccidental:"n",trOctave:"4", trPitch:"F4"})

        const trKey2 = transposer.transpose({"step": "E", "oct": 4, "acc":"n"},'8');
        expect(trKey2).toEqual({trStep:"F",trAccidental:"#",trOctave:"4",trPitch:"F#4"})

        const trKey3 = transposer.transpose({"step": "E", "oct": 4, "acc":"b"},'8');
        expect(trKey3).toEqual({trStep:"F",trAccidental:"n",trOctave:"4",trPitch:"F4"})

        //Ab-An-Ab => Bb-Bn-Bb  
        const trKey4 = transposer.transpose({"step": "A", "oct": 4, "acc":"b"},'8');
        expect(trKey4).toEqual({trStep:"B",trAccidental:"b",trOctave:"4",trPitch:"Bb4"})

        const trKey5 = transposer.transpose({"step": "A", "oct": 4, "acc":"n"},'8');
        expect(trKey5).toEqual({trStep:"B",trAccidental:"n",trOctave:"4", trPitch:"B4"})

        const trKey6 = transposer.transpose({"step": "A", "oct": 4, "acc":"b"},'8');
        expect(trKey6).toEqual({trStep:"B",trAccidental:"b",trOctave:"4", trPitch:"Bb4"})

        
    });

    it('+++ transpose with reset (multiple bars)', () => {
        const transposer = new Transposer('D');

        const trKey = transposer.transpose({"step": "E", "oct": 4, "acc":"b"},'8');
        expect(trKey).toEqual({trStep:"F",trAccidental:"n",trOctave:"4",trPitch:"F4"})

        const trKey2 = transposer.transpose({"step": "E", "oct": 4, "acc":"n"},'8');
        expect(trKey2).toEqual({trStep:"F",trAccidental:"#",trOctave:"4",trPitch:"F#4"})

        const trKey4 = transposer.transpose({"step": "E", "oct": 4, "acc":"b"},'8');
        expect(trKey4).toEqual({trStep:"F",trAccidental:"n",trOctave:"4",trPitch:"F4"})

        transposer.resetAccidentals();

        const trKey3 = transposer.transpose({"step": "E", "oct": 4, "acc":"n"},'8');
        expect(trKey3).toEqual({trStep:"F",trAccidental:"",trOctave:"4",trPitch:"F#4"})

        
    });



});