import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Vex from 'vexflow'

const SCHEME_WIDTH = 350;
const SPACE_BETWEEN_STAVES = 120;
const SPACE_BETWEEN_GRAND_STAVES = 260;
const BAR_MIN_WIDTH = 100;
const FIRST_BAR_ADDITIONAL_WIDTH = 100;
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

class Sheet extends PureComponent {

  drawSheet = () => {

    function buildVoice(voice) {

      var vexVoice = new VF.Voice({
        num_beats: 4,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION
      });

      const vexNotes = voice.notes.map(note => {
        const staveNote = new VF.StaveNote(note);

        if (note.id) {
          staveNote.setAttribute('id', note.id);
        }

        note.keys.forEach(function (key, i) {
          const keyValue = key.split("/")[0];
          const accidental = keyValue.slice(1, (keyValue.length + 1) || 9e9);

          if (accidental.length > 0) {
            staveNote.addAccidental(i, new Vex.Flow.Accidental(accidental));
          }
        });

        return staveNote;
      });

      if (voice.beams) {
        voice.beams.forEach(beam => {
          const { from, to } = beam;
          voicesBeams.push(new VF.Beam(vexNotes.slice(from, to)));
        })
      } else {
        const autoBeams = VF.Beam.generateBeams(vexNotes);
        voicesBeams.push(...autoBeams);
      }

      if (voice.tuplets) {
        voice.tuplets.forEach(tuplet => {
          const { from, to, ...options } = tuplet;
          voicesTuplets.push(new VF.Tuplet(vexNotes.slice(from, to), options));
        })
      }

      vexVoice.addTickables(vexNotes);
      return vexVoice
    }


    function buildVoices(voices) {

      const vexVoices = voices.map(voice => {
        return buildVoice(voice);
      });
      return vexVoices;
    }

    function drawGrandStaveRow(currentRowBars, widthArray, rowsCounter, widthRest = 0) {

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
          trebleStave.addClef("treble").addTimeSignature("4/4").addKeySignature(signature);
          bassStave.addClef("bass").addTimeSignature("4/4").addKeySignature(signature);
          // trebleStave.setMeasure(5);
        }

        const lineLeft = new VF.StaveConnector(trebleStave, bassStave).setType(1);
        const lineRight = new VF.StaveConnector(trebleStave, bassStave).setType(0);

        trebleStave.setContext(context).draw();
        bassStave.setContext(context).draw();

        lineLeft.setContext(context).draw();
        lineRight.setContext(context).draw();


        var startX = Math.max(trebleStave.getNoteStartX(), bassStave.getNoteStartX());
        trebleStave.setNoteStartX(startX);
        bassStave.setNoteStartX(startX);

        b.formatter.format(b.trebleStaveVoices.concat(b.bassStaveVoices), barWidth 
         + (index === 0 ? FIRST_BAR_ADDITIONAL_WIDTH / 3 : 0)  // ??? временно, переделать
         - (startX - 0)  
         - EXTRA_SPACE
        );

        // Render voices
        b.trebleStaveVoices.forEach(function (v) { v.draw(context, trebleStave); });
        b.bassStaveVoices.forEach(function (v) { v.draw(context, bassStave); });


      });

    }

    const { width, signature, sections } = this.props;
    const svgWidth = width - SCHEME_WIDTH;
    const sheetWidth = svgWidth - PADDING_LEFT * 2;
    console.log(sheetWidth);

    const VF = Vex.Flow;
    const renderer = new VF.Renderer(this.sheetContainer, VF.Renderer.Backends.SVG);

    // Configure the rendering context. 
    //renderer.resize(sheetWidth, 1000);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    const voicesBeams = [];
    const voicesTuplets = [];

    let rowsCounter = 0;
    let currentWidth = 0;
    const currentRowBars = [];
    const widthArray = [];
    // let sheetHeight = 0;

    sections.forEach((section) => {
      section.phrases.forEach((phrase) => {
        phrase.bars.forEach((bar) => {

          const trebleStaveVoices = buildVoices(bar.trebleVoices);

          const bassStaveVoices = buildVoices(bar.bassVoices);

          const formatter = new VF.Formatter();

          formatter.joinVoices(trebleStaveVoices);
          formatter.joinVoices(bassStaveVoices);

          const allVoicesTogether = trebleStaveVoices.concat(bassStaveVoices);
          const minTotalWidth = Math.ceil(formatter.preCalculateMinTotalWidth(allVoicesTogether) * COEFFICIENT);
          const barWidth = Math.max(minTotalWidth, BAR_MIN_WIDTH) + EXTRA_SPACE+ (currentRowBars.length !== 0 ? 0 : FIRST_BAR_ADDITIONAL_WIDTH);




          if (currentWidth + barWidth < sheetWidth) {
            console.log(barWidth);
            currentWidth += barWidth;
            currentRowBars.push({
              bar,
              barWidth,
              formatter,
              trebleStaveVoices,
              bassStaveVoices
            });
            widthArray.push(barWidth);
          } else {
            // new stave row
            // draw current row and begin new row 
            const widthRest = sheetWidth - currentWidth;
            drawGrandStaveRow(currentRowBars, widthArray, rowsCounter, widthRest);
            rowsCounter++;
            currentWidth = barWidth + FIRST_BAR_ADDITIONAL_WIDTH;
            currentRowBars.length = 0;
            widthArray.length = 0;
            widthArray.push(barWidth + FIRST_BAR_ADDITIONAL_WIDTH);
            currentRowBars.push({
              bar,
              barWidth: barWidth + FIRST_BAR_ADDITIONAL_WIDTH,
              formatter,
              trebleStaveVoices,
              bassStaveVoices
            });
          }
        });
      });
    });
    drawGrandStaveRow(currentRowBars, widthArray, rowsCounter);



    renderer.resize(svgWidth, PADDING_TOP + (50 * 2 + SPACE_BETWEEN_GRAND_STAVES + SPACE_BETWEEN_GRAND_STAVES) * (rowsCounter + 1));

    voicesBeams.forEach(function (b) {
      b.setContext(context).draw()
    });

    voicesTuplets.forEach(function (tuplet) {
      tuplet.setContext(context).draw();
    });
  }

  componentDidMount() {
    this.drawSheet();
  }

  componentDidUpdate() {
    // console.log('sheet did update');
    this.drawSheet();
  }

  render() {
    return (
      <div className='sheet' ref={(x) => this.sheetContainer = x} />
    );
  }
}

Sheet.propTypes = {
  sections: PropTypes.array,
  signature: PropTypes.string,
  width: PropTypes.number
};

export default Sheet;