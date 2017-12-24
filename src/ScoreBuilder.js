import Vex from 'vexflow'

export default function buildScore(div, props) {

    function buildNote(note) {
        const noteObject = {
            keys: note.keys,
            duration: `${note.duration}${note.type === 'REST' ? 'r' : ''}`
        }

        if (note.clef !== undefined) {
            noteObject.clef = note.clef;
        }
        return noteObject

    }

    function buildVoice(voice) {

        // Create a voice in 4/4
        var vexVoice = new VF.Voice({
            num_beats: 4,
            beat_value: 4,
            resolution: Vex.Flow.RESOLUTION
        });


        const vexNotes = voice.notes.map(note => {
            const staveNote =  new VF.StaveNote(buildNote(note));

            note.keys.forEach(function (key, i) {
                const keyValue = key.split("/")[0];
                const accidental = keyValue.slice(1, (keyValue.length + 1) || 9e9);

                if (accidental.length > 0) {
                    staveNote.addAccidental(i, new Vex.Flow.Accidental(accidental));
                }
            });

            return staveNote;
        });

        // Add notes to voice
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

    const { index, data } = props;
    const VF = Vex.Flow;

    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context. 
    renderer.resize(div.offsetWidth, div.offsetHeight);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    //    context.scale(0.7,0.7); 

    const trebleStave = new VF.Stave(0, 0, div.offsetWidth);
    const bassStave = new VF.Stave(0, 100, div.offsetWidth);

    // Add a clef and time signature. 
    if (index === 0) {
        trebleStave.addClef("treble").addTimeSignature("4/4");
        bassStave.addClef("bass").addTimeSignature("4/4");
    }


    const lineLeft = new VF.StaveConnector(trebleStave, bassStave).setType(1);
    const lineRight = new VF.StaveConnector(trebleStave, bassStave).setType(0);

    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();

    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();


    const voicesBeams = [];
    const voicesTuplets = [];
    const trebleStaveVoices = buildVoices(data.trebleVoices);

    const bassStaveVoices = buildVoices(data.bassVoices);

    console.log(trebleStaveVoices);


    // Format and justify the notes to 500 pixels
    const formatter = new VF.Formatter();
    var startX = Math.max(trebleStave.getNoteStartX(), bassStave.getNoteStartX());
    trebleStave.setNoteStartX(startX);
    bassStave.setNoteStartX(startX);

    // the treble and bass are joined independently but formatted together
    formatter.joinVoices(trebleStaveVoices);
    formatter.joinVoices(bassStaveVoices);
    formatter.format(trebleStaveVoices.concat(bassStaveVoices), div.offsetWidth - (startX - 0));


    // Render voices
    trebleStaveVoices.forEach(function (v) { v.draw(context, trebleStave); });
    bassStaveVoices.forEach(function (v) { v.draw(context, bassStave); });

    voicesBeams.forEach(function (b) {
        b.setContext(context).draw()
    });

    voicesTuplets.forEach(function (tuplet) {
        tuplet.setContext(context).draw();
    });

}