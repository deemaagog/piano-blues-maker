import Vex from 'vexflow'

export default function buildScore(div, props) {

    function formatNotesGroup(group) {
        
    }

    function getNotesGroups(notesGroups) {

        const vexNotesGroupes = notesGroups.reduce((chain, currentGroup) => {
            if (chain) {
               return chain.concat(formatNotesGroup(currentGroup));
            } else {
               return formatNotesGroup(currentGroup); 
            }
        }, null);

        return vexNotesGroupes;
    }



    function getVoices(voices) {
        // [
        //     score.voice(
        //       score.notes('C#5/q, (B4 C4)/8,B4/8')
        //         .concat(score.beam(score.notes('A4/8, E4, C4, D4')))
        //     )
        //   ]

        //   [
        //     score.voice(
        //       score.notes('C#5/q, B4, B4')
        //         .concat(
        //         score.tuplet(score.beam(score.notes('A4/8, E4, C4'))))
        //     )
        //   ]

        const vexVoices = voices.map(voice => {
            return score.voice(getNotesGroups(voice.notesGroups));
        });

        return vexVoices;
    }

    const { index, data } = props;

    const vf = new Vex.Flow.Factory({ renderer: { elementId: div, height: div.offsetHeight, width: div.offsetWidth } });
    const score = vf.EasyScore({ throwOnError: true });
    const system = vf.System({ x: 0, y: 0, spaceBetweenStaves: 12, width: div.offsetWidth });


    const trebleVoices = [
        score.voice(
            score.notes('C#5/q, (C4 B4)/8,B4/8')
                .concat(score.beam(score.notes('A4/8, E4, C4, D4')))
        )
    ]

    const bassVoices = getVoices(data.bassVoices);

    debugger;
    console.log(trebleVoices)
    console.log(bassVoices)

    const trebleStave = system.addStave({
        voices: trebleVoices
    });

    const bassStave = system.addStave({
        voices: bassVoices
    });

    if (index === 0) {
        bassStave.addClef('bass').addTimeSignature('4/4');
        trebleStave.addClef('treble').addTimeSignature('4/4');
        system.addConnector('singleLeft');
    }

    system.addConnector('singleRight');

    vf.draw();
}

// componentDidMount() {

//     console.log(`did mount ${this.props.id}`);

//     const VF = Vex.Flow;

//     // Create an SVG renderer and attach it to the DIV element named "boo". 
//     //    var div = document.getElementById("boo")
//     var div = this.barContainer;
//     var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

//     // Configure the rendering context. 
//     renderer.resize(div.offsetWidth, div.offsetHeight);
//     var context = renderer.getContext();
//     context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
//     //    context.scale(0.7,0.7); 

//     // Create a stave of width 400 at position 10, 40 on the canvas. 
//     var topStave = new VF.Stave(0, 0, div.offsetWidth);
//     var bottomStave = new Vex.Flow.Stave(0, 100, div.offsetWidth);

//     // Add a clef and time signature. 
//     if (this.props.index === 0) {
//         topStave.addClef("treble").addTimeSignature("4/4");
//         bottomStave.addClef("bass").addTimeSignature("4/4");
//     }

//     // Connect it to the rendering context and draw! 
//     //topStave.setContext(context).draw();

//     var lineLeft = new Vex.Flow.StaveConnector(topStave, bottomStave).setType(1);
//     var lineRight = new Vex.Flow.StaveConnector(topStave, bottomStave).setType(0);

//     topStave.setContext(context).draw();
//     bottomStave.setContext(context).draw();

//     //brace.setContext(ctx).draw();
//     lineLeft.setContext(context).draw();
//     lineRight.setContext(context).draw();


//     const note = this.props.notes[0].note;

//     var notes = [
//         // A quarter-note C.

//         new Vex.Flow.StaveNote({ keys: [`${note[0]}/${note[1]}`], duration: "w" }),

//         // // A quarter-note D.
//         // new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),

//         // // A quarter-note rest. Note that the key (b/4) specifies the vertical
//         // // position of the rest.
//         // new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "qr" }),

//         // // A C-Major chord.
//         // new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" })
//     ];
//     // Create a voice in 4/4
//     var voice = new Vex.Flow.Voice({
//         num_beats: 4,
//         beat_value: 4,
//         resolution: Vex.Flow.RESOLUTION
//     });

//     // Add notes to voice
//     voice.addTickables(notes);

//     // Format and justify the notes to 500 pixels
//     new Vex.Flow.Formatter()
//         .joinVoices([voice]).format([voice], div.offsetWidth);

//     // Render voice

//     voice.draw(context, bottomStave);
//     voice.draw(context, topStave);

// }