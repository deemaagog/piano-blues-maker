import { Distance, Interval } from 'tonal'
import { keysAccidentals, keysOffsets } from './constants'

//АЛГОРИТМ ТРАНСПОНИРОВАНИЯ
// 1) Парсим оригинальную ноту на состоавляющие: name: E , accidenal: b, octave: 4
// 2) определяем, является accidental бекаром (отменой знака)
// 3) добавляем в this.originalAccidentals accidental , если он есть . Вместе с октавой
// 4) транспонируем ноту используя tonal. Сделать собственную функцию транспонирования. Парсим результат
// 5) Проверяем новую ноту
// Если есть accidental и он есть в ключе, то убираем accidental


//TODO: rewrite transpose function
// посмотреть music.js vexflow

class Transposer {
  constructor(signature) {
    this.keyAccidentals = keysAccidentals[signature];
    this.keyOffset = keysOffsets[signature];

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
    //парсим текущую ноту (key)
    // const [keyNameWithAcc, octave] = key.split("/");
    // const keyName = keyNameWithAcc.slice(0, 1)
    // let accidental = keyNameWithAcc.slice(1, (keyNameWithAcc.length + 1) || 9e9);

    const isNatural = (accidental === 'n');


    if (accidental) {
      this.originalAccidentals[step + octave] = accidental;
    }

    // при проигрывании
    let removeAccidental = false;
    if (!accidental && this.originalAccidentals[step + octave]) {
      accidental = this.originalAccidentals[step + octave];
      removeAccidental = true;
    }

    // todo: check if is natural!!!
    const transposedKey = Distance.transpose(step + (isNatural ? '' : accidental||'') + octave, Interval.fromSemitones(this.keyOffset));

    const length = transposedKey.length;

    //Note.fromMidi(61, true) // => "C#4"//
    // todo: use note-parser?
    const trStepAcc = transposedKey.substr(0, length - 1);
    const trStep = trStepAcc.slice(0, 1)
    const trAccidental = trStepAcc.slice(1, (trStepAcc.length + 1) || 9e9)||'';
    const trOctave = transposedKey.substr(length - 1);

    // let vexKey = trKeyNameWithAcc;
    // let vexAccidental = trAccidental;

    const trKey = {trStep,trAccidental,trOctave, trPitch:`${trStep}${trAccidental}${trOctave}`};

    if (this.keyAccidentals[trStep] && this.keyAccidentals[trStep] === trAccidental && this.accidentals[trStep + trOctave] !== 'n') {
      //есть знак при ключе и ранее он не был отменен
      trKey.trAccidental = '';
      // vexKey = trKeyName;
      // vexAccidental = undefined;
    }

    if (trAccidental) {
      this.accidentals[trStep + trOctave] = trAccidental;
    }

    if (!trAccidental && (this.keyAccidentals[trStep] || isNatural)) {
      //если знак при ключе, но надо сыграть без знака или ранее была отмена, то бекар 
      //vexKey = vexKey + 'n';
      this.accidentals[trStep + trOctave] = 'n';
      //vexAccidental = 'n';
      trKey.trAccidental = 'n';
    }

    if (removeAccidental) {
      // vexKey = trStep;
      // vexAccidental = undefined;
      trKey.trAccidental = '';
    }

    //return { vexKey: vexKey + '/' + trOctave, vexAccidental: vexAccidental|| undefined }
    return trKey
  }
}

export default Transposer