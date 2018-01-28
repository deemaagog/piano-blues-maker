import Vex from 'vexflow'
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
    this.svgWidth = width - SCHEME_WIDTH
    this.sheetWidth = this.svgWidth - PADDING_LEFT * 2;
    this.voicesBeams = [];
    this.voicesTuplets = [];
    this.width = width;
    this.signature = signature;
    // this.rowsCounter = 0;
  }


  drawGrandStaveRow(currentRowBars, widthArray, rowsCounter, widthRest = 0) {

    let barOffset = PADDING_LEFT;

    //if (widthRest !== 0) {
    const widthRestArray = disributeValue(widthArray, widthRest, 0);
    //}

    currentRowBars.forEach((b, index) => {

      const barWidth = b.barWidth + (widthRest !== 0 ? widthRestArray[index] : 0)

      const trebleStave = new VF.Stave(barOffset, PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES, barWidth);
      const bassStave = new VF.Stave(barOffset, PADDING_TOP + rowsCounter * SPACE_BETWEEN_GRAND_STAVES + SPACE_BETWEEN_STAVES, barWidth);


      // console.log(`drawing stave, width: ${b.barWidth}`);
      barOffset += barWidth;

      if (index === 0) {
        trebleStave.addClef("treble").addTimeSignature("4/4").addKeySignature(this.signature);
        bassStave.addClef("bass").addTimeSignature("4/4").addKeySignature(this.signature);
        //trebleStave.setMeasure(5);
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


  buildVoice(voice) {

    var vexVoice = new VF.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: VF.RESOLUTION
    });

    const vexNotes = voice.notes.map(note => {
      const staveNote = new VF.StaveNote(note);

      if (note.id) {
        staveNote.setAttribute('id', note.id);
        // staveNote.setAttribute('data-test', 'wer');
        // staveNote.attrs.classes['test'] = true; 
        // staveNote.attrs['data-test'] = 'wer';
        // staveNote.addClass("deemaagog");
      }

      note.keys.forEach(function (key, i) {
        const keyValue = key.split("/")[0];
        const accidental = keyValue.slice(1, (keyValue.length + 1) || 9e9);

        if (accidental.length > 0) {
          staveNote.addAccidental(i, new VF.Accidental(accidental));
        }
      });

      return staveNote;
    });

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
    this.sections.forEach((section, index) => {
      const isLastSection = index === sectionsLength - 1;
      const phrasesLength = section.phrases.length;
      //if (section !== null) {
        section.phrases.forEach((phrase, index) => {
          const isLastPhrase = index === phrasesLength - 1;
          const barsLength = phrase.bars.length;
          phrase.bars.forEach((bar,index) => {
            const isLastBar = (index === barsLength - 1) && isLastPhrase && isLastSection;
            const trebleStaveVoices = bar.trebleVoices.map(voice => {
              return this.buildVoice(voice);
            });

            const bassStaveVoices = bar.bassVoices.map(voice => {
              return this.buildVoice(voice);
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




            if (currentWidth + barWidth < this.sheetWidth) {
              // console.log(barWidth);
              currentWidth += barWidth;
              currentRowBars.push({
                bar,
                barWidth,
                formatter,
                trebleStaveVoices,
                bassStaveVoices,
                isLastBar
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
                isLastBar
              });
            }
          });
        });
      //};
    });
    this.drawGrandStaveRow(currentRowBars, widthArray, rowsCounter);

    renderer.resize(this.svgWidth, PADDING_TOP + (SPACE_BETWEEN_GRAND_STAVES) * (rowsCounter + 1));

    this.voicesBeams.forEach( (b) => {
      b.setContext(this.context).draw()
    });

    this.voicesTuplets.forEach((tuplet) => {
      tuplet.setContext(this.context).draw();
    });


    // console.log("Calculating min width: " + (calcTime) + " milliseconds.")

  }

}

export default SheetDrawer