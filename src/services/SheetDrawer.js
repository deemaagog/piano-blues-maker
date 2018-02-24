import Vex from 'vexflow'
import Transposer from './Transposer'

const VF = Vex.Flow;

const SCHEME_WIDTH = 350;
const SPACE_BETWEEN_STAVES = 120;
const SPACE_BETWEEN_GRAND_STAVES = 260;
const BAR_MIN_WIDTH = 100;
const PADDING_TOP = 50;
const PADDING_LEFT = 50;
const COEFFICIENT = 1;

const SHEET_MIN_WIDTH = 600;
const FIRST_NOTE_SPACE = 10;
const LAST_NOTE_SPACE = 10;


function disributeValue(arr, value, precision) {
  const sum = arr.reduce((sum, value) => sum + value, 0);

  const percentages = arr.map(value => value / sum);

  const valueDistribution = percentages.map(percentage => {
    const factor = Math.pow(10, precision);
    return Math.round(value * percentage * factor) / factor;
  });

  return valueDistribution;
}

class SheetDrawer {
  constructor(container, sections, { width, signature }) {
    this.sheetContainer = container;
    this.sections = sections;
    this.svgWidth = Math.max(width - SCHEME_WIDTH, SHEET_MIN_WIDTH);
    this.sheetWidth = this.svgWidth - PADDING_LEFT * 2;

    this.beams = [];
    this.tuplets = [];

    this.openedTies = {};
    this.ties = [];

    this.rowFirstBars = [];
    this.rowLastBars = [];

    this.width = width;
    this.signature = signature;
    // this.rowsCounter = 0;

    this.transposer = new Transposer(signature);
  }


  drawGrandStaveRow(currentRowBars, widthArray, rowsCounter, widthRest = 0) {

    this.rowFirstBars.push(currentRowBars[0].barId);
    this.rowLastBars.push(currentRowBars[currentRowBars.length - 1].barId);

    let barOffset = PADDING_LEFT;

    //if (widthRest !== 0) {
    const widthRestArray = disributeValue(widthArray, widthRest, 0);
    //}

    currentRowBars.forEach((b, index) => {

      const barWidth = b.barWidth + (widthRest !== 0 ? widthRestArray[index] : 0)

      const trebleStave = b.tStave;
      const bassStave = b.bStave;

      trebleStave.setX(barOffset);
      bassStave.setX(barOffset);
      trebleStave.setY(PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES);
      bassStave.setY(PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES + SPACE_BETWEEN_STAVES);

      trebleStave.setWidth(barWidth);
      bassStave.setWidth(barWidth);

      //grand stave group
      // const group = this.context.openGroup(b.sectionId);
      // this.context.rect(barOffset, PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES + 40, barWidth, SPACE_BETWEEN_STAVES + 50 * 2 - 60, { stroke: 'none', fill: "rgba(124,240,10,0.1)" });
      // this.context.closeGroup();

      barOffset += barWidth;

      if (b.text) {
        // trebleStave.setText(b.text[0], VF.Modifier.Position.ABOVE, { shift_y: 0, justification: VF.TextNote.Justification.LEFT });
        trebleStave.setSection(b.text[0], 0);
      }

      const lineLeft = new VF.StaveConnector(trebleStave, bassStave).setType(1);
      const lineRight = new VF.StaveConnector(trebleStave, bassStave).setType(b.isLastBar ? 6 : 0);

      trebleStave.setContext(this.context).draw();
      bassStave.setContext(this.context).draw();

      lineLeft.setContext(this.context).draw();
      lineRight.setContext(this.context).draw();

      b.formatter.format(b.trebleStaveVoices.concat(b.bassStaveVoices), b.minTotalWidth + (widthRest !== 0 ? widthRestArray[index] : 0));

      // Render voices
      b.trebleStaveVoices.forEach(function (v) { v.draw(this.context, trebleStave); }.bind(this));
      b.bassStaveVoices.forEach(function (v) { v.draw(this.context, bassStave); }.bind(this));

    });
  }


  buildVoice(voice, symbol, vInd, bInd, pInd, sInd) {

    const vexVoice = new VF.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: VF.RESOLUTION
    });

    const vexNotes = voice.notes.map(function (note, nInd) {

      const { keys, dur: duration, grace, ...options } = note;

      const noteKeysAccidentals = [];

      const noteTies = [];

      let graceNotes = [];

      if (grace) {
        graceNotes = grace.notes.map((gn, gInd) => {
          const noteGraceAccidentals = [];
          const { keys, dur: duration, ...options } = gn;

          const gnTrasposedKeys = keys.map(function ({ ...key }, keyIndex) {
            const { trStep, trAccidental, trOctave } = this.transposer.transpose(key, duration);
            noteGraceAccidentals[keyIndex] = trAccidental;
            return `${trStep}${trAccidental || ''}/${trOctave}`
          }.bind(this))

          const graceNote = new VF.GraceNote({ keys: gnTrasposedKeys, duration, ...options });
          graceNote.setAttribute('id', `${sInd}-${pInd}-${bInd}-${symbol}-${vInd}-${nInd}-${gInd}`);

          noteGraceAccidentals.forEach(function (acc, i) {
            if (acc) {
              graceNote.addAccidental(i, new VF.Accidental(acc));
            }
          });
          return graceNote
        })
      }

      const trasposedKeys = keys.map(function ({ ties, ...key }, keyIndex) {

        const { trStep, trAccidental, trOctave, trPitch: pitch } = this.transposer.transpose(key, duration);

        noteKeysAccidentals[keyIndex] = trAccidental;

        if (ties) {
          noteTies[keyIndex] = { pitch, ties };
        }

        return `${trStep}${trAccidental || ''}/${trOctave}`

      }.bind(this))

      const staveNote = new VF.StaveNote({ keys: trasposedKeys, duration, ...options });

      if (options.dots) {
        staveNote.addDotToAll();
      }

      if (grace) {
        const gnGroup = new Vex.Flow.GraceNoteGroup(graceNotes);
        //gnGroup.setXShift(10)
        staveNote.addModifier(0, gnGroup);
      }

      noteKeysAccidentals.forEach(function (acc, i) {
        if (acc) {
          staveNote.addAccidental(i, new VF.Accidental(acc));
        }
      });

      noteTies.forEach(function (nt, i) {
        if (nt) {
          const { pitch, ties } = nt;
          ties.forEach(function (t) {
            if (t.type === 'start') {
              this.openedTies[pitch] = { first: { staveNote, i, barId: `${sInd}-${pInd}-${bInd}` }, stem: t.stem || 'UP' }
            } else {
              if (this.openedTies[pitch]) {
                this.ties.push({ last: { staveNote, i, barId: `${sInd}-${pInd}-${bInd}` }, ...this.openedTies[pitch] });
                delete this.openedTies[pitch];
              }
            }
          }.bind(this))

        }
      }.bind(this))

      staveNote.setAttribute('id', `${sInd}-${pInd}-${bInd}-${symbol}-${vInd}-${nInd}`);

      return staveNote;
    }.bind(this));

    if (voice.beams) {
      voice.beams.forEach(beam => {
        const { from, to } = beam;
        this.beams.push(new VF.Beam(vexNotes.slice(from, to)));
      })
    } else {
      const autoBeams = VF.Beam.generateBeams(vexNotes);
      this.beams.push(...autoBeams);
    }

    if (voice.tuplets) {
      voice.tuplets.forEach(tuplet => {
        const { from, to, ...options } = tuplet;
        this.tuplets.push(new VF.Tuplet(vexNotes.slice(from, to), options));
      })
    }

    vexVoice.addTickables(vexNotes);
    return vexVoice
  }


  draw() {

    const renderer = new VF.Renderer(this.sheetContainer, VF.Renderer.Backends.SVG);

    this.context = renderer.getContext();
    this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    let rowsCounter = 0;
    let currentWidth = 0;
    const currentRowBars = [];
    const widthArray = [];
    let firstRow = true;

    const sectionsLength = this.sections.length;
    this.sections.forEach((section, sInd) => {
      const isLastSection = sInd === sectionsLength - 1;
      const phrasesLength = section.phrases.length;
      section.phrases.forEach((phrase, pInd) => {
        const isLastPhrase = pInd === phrasesLength - 1;
        const barsLength = phrase.bars.length;
        phrase.bars.forEach((bar, bInd) => {

          this.transposer.resetAccidentals();

          const isFirstSectionBar = (pInd === 0 & bInd === 0);
          const isLastBar = (bInd === barsLength - 1) && isLastPhrase && isLastSection;
          const trebleStaveVoices = bar.trebleVoices.map((voice, vInd) => {
            return this.buildVoice(voice, 't', vInd, bInd, pInd, sInd);
          });

          const bassStaveVoices = bar.bassVoices.map((voice, vInd) => {
            return this.buildVoice(voice, 'b', vInd, bInd, pInd, sInd);
          });


          const formatter = new VF.Formatter();

          formatter.joinVoices(trebleStaveVoices).joinVoices(bassStaveVoices);

          const allVoicesTogether = trebleStaveVoices.concat(bassStaveVoices);

          const minTotalWidth = Math.ceil(Math.max(formatter.preCalculateMinTotalWidth(allVoicesTogether),BAR_MIN_WIDTH) * COEFFICIENT);

          // добавим нотные станы, пока с 0 координатами
          const tStave = new VF.Stave(0, 0);
          const bStave = new VF.Stave(0, 0);

          // Add a clef and time signature.
          if (firstRow) {
            tStave.addClef("treble").addTimeSignature("4/4").addKeySignature(this.signature);
            bStave.addClef("bass").addTimeSignature("4/4").addKeySignature(this.signature);
            firstRow = false;
          }

          const startX = Math.max(tStave.getNoteStartX(), bStave.getNoteStartX());
          tStave.setNoteStartX(startX);
          bStave.setNoteStartX(startX);

          const barWidth = minTotalWidth + (startX - 0) + FIRST_NOTE_SPACE + LAST_NOTE_SPACE;

          if (currentWidth + barWidth < this.sheetWidth) {
            currentWidth += barWidth;
            
            currentRowBars.push({
              bar,
              barWidth,
              minTotalWidth,
              tStave,
              bStave,
              formatter,
              trebleStaveVoices,
              bassStaveVoices,
              isLastBar,
              text: isFirstSectionBar ? section.type : '',
              sectionId: section.id,
              barId: `${sInd}-${pInd}-${bInd}`
            });
            widthArray.push(barWidth);
          } else {
            // new stave row
            // draw current row and begin new row 
            const widthRest = this.sheetWidth - currentWidth;
            this.drawGrandStaveRow(currentRowBars, widthArray, rowsCounter, widthRest);
            //newRow = true;

            tStave.addClef("treble").addTimeSignature("4/4").addKeySignature(this.signature);
            bStave.addClef("bass").addTimeSignature("4/4").addKeySignature(this.signature);
  
            const startX = Math.max(tStave.getNoteStartX(), bStave.getNoteStartX());
            tStave.setNoteStartX(startX);
            bStave.setNoteStartX(startX);
  
            const barWidth = minTotalWidth + (startX - 0) + FIRST_NOTE_SPACE + LAST_NOTE_SPACE;


            rowsCounter++;
            currentWidth = barWidth;
            currentRowBars.length = 0;
            widthArray.length = 0;
            widthArray.push(barWidth);
            currentRowBars.push({
              bar,
              barWidth: barWidth,
              minTotalWidth,
              tStave,
              bStave,
              formatter,
              trebleStaveVoices,
              bassStaveVoices,
              isLastBar,
              text: isFirstSectionBar ? section.type : '',
              sectionId: section.id,
              barId: `${sInd}-${pInd}-${bInd}`
            });
          }
        });
      });
    });
    if (currentRowBars.length) {
      this.drawGrandStaveRow(currentRowBars, widthArray, rowsCounter);
    }

    renderer.resize(this.svgWidth, PADDING_TOP + (SPACE_BETWEEN_GRAND_STAVES) * (rowsCounter + 1));

    this.beams.forEach((b) => {
      b.setContext(this.context).draw()
    });

    this.tuplets.forEach((tuplet) => {
      tuplet.setContext(this.context).draw();
    });

    this.ties.forEach(t => {
      if (this.rowFirstBars.indexOf(t.last.barId) > -1 && this.rowLastBars.indexOf(t.first.barId) > -1 && t.first.barId !== t.last.barId) {
        new VF.StaveTie({ first_note: t.first.staveNote, last_note: null, first_indices: [t.first.i] }).setDirection(VF.Stem[t.stem]).setContext(this.context).draw();
        new VF.StaveTie({ first_note: null, last_note: t.last.staveNote, last_indices: [t.last.i] }).setDirection(VF.Stem[t.stem]).setContext(this.context).draw();
      } else {
        const tie = new VF.StaveTie({ first_note: t.first.staveNote, last_note: t.last.staveNote, first_indices: [t.first.i], last_indices: [t.last.i] }).setDirection(VF.Stem[t.stem]);
        tie.setContext(this.context).draw();
      }
    })
  }
}

export default SheetDrawer