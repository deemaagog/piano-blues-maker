import Vex from 'vexflow'
import Transposer from './Transposer'

const VF = Vex.Flow;

const SCHEME_WIDTH = 350;
const SPACE_BETWEEN_STAVES = 120;
const SPACE_BETWEEN_GRAND_STAVES = 260;
const BAR_MIN_WIDTH = 100;
const ROW_FIRST_BAR_ADDITIONAL_WIDTH = 100;
const LAST_BAR_ADDITIONAL_WIDTH = 15;
const PADDING_TOP = 50;
const PADDING_LEFT = 50;
const EXTRA_SPACE = 20;
const COEFFICIENT = 1;

const SHEET_MIN_WIDTH = 600;


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

    this.voicesBeams = [];
    this.voicesTuplets = [];
    this.voicesTies = [];

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

      const trebleStave = new VF.Stave(barOffset, PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES, barWidth);
      const bassStave = new VF.Stave(barOffset, PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES + SPACE_BETWEEN_STAVES, barWidth);

      //grand stave group
      // const group = this.context.openGroup(b.sectionId);
      // this.context.rect(barOffset, PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES + 40, barWidth, SPACE_BETWEEN_STAVES + 50 * 2 - 60, { stroke: 'none', fill: "rgba(124,240,10,0.1)" });
      // this.context.closeGroup();

      barOffset += barWidth;

      if (index === 0) {
        trebleStave.addClef("treble").addTimeSignature("4/4").addKeySignature(this.signature);
        bassStave.addClef("bass").addTimeSignature("4/4").addKeySignature(this.signature);
      }

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





      var startX = Math.max(trebleStave.getNoteStartX(), bassStave.getNoteStartX());
      trebleStave.setNoteStartX(startX);
      bassStave.setNoteStartX(startX);

      b.formatter.format(b.trebleStaveVoices.concat(b.bassStaveVoices), barWidth
        + (index === 0 ? ROW_FIRST_BAR_ADDITIONAL_WIDTH / 3 : 0)  // ??? временно, переделать
        - (startX - 0)
        - EXTRA_SPACE
        // - (b.isLastBar ? LAST_BAR_ADDITIONAL_WIDTH:0)
      );

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
        this.voicesBeams.push(new VF.Beam(vexNotes.slice(from, to)));
      })
    } else {
      const autoBeams = VF.Beam.generateBeams(vexNotes);
      this.voicesBeams.push(...autoBeams);
    }

    if (voice.tuplets) {
      voice.tuplets.forEach(tuplet => {
        const { from, to, ...options } = tuplet;
        this.voicesTuplets.push(new VF.Tuplet(vexNotes.slice(from, to), options));
      })
    }



    vexVoice.addTickables(vexNotes);
    return vexVoice
  }


  draw() {

    const renderer = new VF.Renderer(this.sheetContainer, VF.Renderer.Backends.SVG);

    // Configure the rendering context. 
    //renderer.resize(sheetWidth, 1000);
    this.context = renderer.getContext();
    this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    let rowsCounter = 0;
    let currentWidth = 0;
    const currentRowBars = [];
    const widthArray = [];

    // let  calcTime = 0;
    const sectionsLength = this.sections.length;
    this.sections.forEach((section, sInd) => {
      const isLastSection = sInd === sectionsLength - 1;
      const phrasesLength = section.phrases.length;
      //if (section !== null) {
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

          formatter.joinVoices(trebleStaveVoices);
          formatter.joinVoices(bassStaveVoices);

          const allVoicesTogether = trebleStaveVoices.concat(bassStaveVoices);

          // let t0 = performance.now(); //!!!!!!
          const minTotalWidth = Math.ceil(formatter.preCalculateMinTotalWidth(allVoicesTogether) * COEFFICIENT);
          // let t1 = performance.now();//!!!!!!!
          //console.log("Calculating min width: " + (t1 - t0) + " milliseconds.")
          // calcTime =+ (t1 - t0);

          const barWidth = Math.max(minTotalWidth, BAR_MIN_WIDTH)
            + EXTRA_SPACE
            + (currentRowBars.length !== 0 ? 0 : ROW_FIRST_BAR_ADDITIONAL_WIDTH)
            + (isLastBar ? LAST_BAR_ADDITIONAL_WIDTH : 0);
          // + (40);




          if (currentWidth + barWidth < this.sheetWidth) {
            // console.log(barWidth);
            currentWidth += barWidth;
            currentRowBars.push({
              bar,
              barWidth,
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
            rowsCounter++;
            currentWidth = barWidth + ROW_FIRST_BAR_ADDITIONAL_WIDTH;
            currentRowBars.length = 0;
            widthArray.length = 0;
            widthArray.push(barWidth + ROW_FIRST_BAR_ADDITIONAL_WIDTH);
            currentRowBars.push({
              bar,
              barWidth: barWidth + ROW_FIRST_BAR_ADDITIONAL_WIDTH,
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
      //};
    });
    if (currentRowBars.length) {
      this.drawGrandStaveRow(currentRowBars, widthArray, rowsCounter);
    }

    renderer.resize(this.svgWidth, PADDING_TOP + (SPACE_BETWEEN_GRAND_STAVES) * (rowsCounter + 1));

    this.voicesBeams.forEach((b) => {
      b.setContext(this.context).draw()
    });

    this.voicesTuplets.forEach((tuplet) => {
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

    // console.log("Calculating min width: " + (calcTime) + " milliseconds.")

  }

}

export default SheetDrawer