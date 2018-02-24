import { Distance, Interval } from 'tonal'
import { keysAccidentals, keysShifts } from './constants'

//TODO: rewrite transpose function
// посмотреть music.js vexflow
//Note.fromMidi(61, true) // => "C#4"//
//note-parser

class Transposer {
  constructor(signature) {
    this.keyAccidentals = keysAccidentals[signature];
    this.keyShift = keysShifts[signature];

    this.accidentals = {};
    this.originalAccidentals = {};
  }

  resetAccidentals() {
    this.accidentals = {};
    this.originalAccidentals = {};
  }

  transpose(key, duration) {

    // не транспонировать паузы
    // todo: транспонировать если несколько голосов
    if (duration.charAt(duration.length - 1) === 'r') {
      return  {trStep:key.step,trAccidental:key.acc||"",trOctave:key.oct}
    }

    let {step, oct:octave, acc:accidental} = key;

    const isNatural = (accidental === 'n');


    if (accidental) {
      this.originalAccidentals[step + octave] = accidental;
    }

    // при проигрывании
    let removeAccidental = false;
    if (!accidental && this.originalAccidentals[step + octave] && this.originalAccidentals[step + octave] !=='n') {
      accidental = this.originalAccidentals[step + octave];
      removeAccidental = true;
    }

    const transposedKey = Distance.transpose(step + (isNatural ? '' : accidental||'') + octave, Interval.fromSemitones(this.keyShift));

    const length = transposedKey.length;

    
    const trStepAcc = transposedKey.substr(0, length - 1);
    const trStep = trStepAcc.slice(0, 1)
    const trAccidental = trStepAcc.slice(1, (trStepAcc.length + 1) || 9e9)||'';
    const trOctave = transposedKey.substr(length - 1);

    const trKey = {trStep,trAccidental,trOctave, trPitch:`${trStep}${trAccidental}${trOctave}`};

    if (this.keyAccidentals[trStep] && this.keyAccidentals[trStep] === trAccidental && this.accidentals[trStep + trOctave] !== 'n') {
      //есть знак при ключе и ранее он не был отменен
      trKey.trAccidental = '';
    }

    if (trAccidental) {
      this.accidentals[trStep + trOctave] = trAccidental;
    }

    if (!trAccidental && (this.keyAccidentals[trStep] || isNatural)) {
      //если знак при ключе, но надо сыграть без знака или ранее была отмена, то бекар 
      this.accidentals[trStep + trOctave] = 'n';
      trKey.trAccidental = 'n';
    }

    if (removeAccidental) {
      trKey.trAccidental = '';
    }

    return trKey
  }
}

export default Transposer