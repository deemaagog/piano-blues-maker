import React, { Component } from 'react';
import Vex from 'vexflow'

class Bar extends Component {

    componentDidUpdate() {
        console.log(`did update ${this.props.id}`);

    }

    componentDidMount() {

        console.log(`did mount ${this.props.id}`);

        const VF = Vex.Flow;

        // Create an SVG renderer and attach it to the DIV element named "boo". 
        //    var div = document.getElementById("boo")
        var div = this.barContainer;
        var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        // Configure the rendering context. 
        renderer.resize(div.offsetWidth, div.offsetHeight);
        var context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
        //    context.scale(0.7,0.7); 

        // Create a stave of width 400 at position 10, 40 on the canvas. 
        var topStave = new VF.Stave(0, 0, div.offsetWidth);
        var bottomStave = new Vex.Flow.Stave(0, 100, div.offsetWidth);

        // Add a clef and time signature. 
        if (this.props.index === 0) {
            topStave.addClef("treble").addTimeSignature("4/4");
            bottomStave.addClef("bass").addTimeSignature("4/4");
        }

        // Connect it to the rendering context and draw! 
        //topStave.setContext(context).draw();

        var lineLeft = new Vex.Flow.StaveConnector(topStave, bottomStave).setType(1);
        var lineRight = new Vex.Flow.StaveConnector(topStave, bottomStave).setType(0);

        topStave.setContext(context).draw();
        bottomStave.setContext(context).draw();

        //brace.setContext(ctx).draw();
        lineLeft.setContext(context).draw();
        lineRight.setContext(context).draw();

        
        const note = this.props.notes[0].note;

        var notes = [
            // A quarter-note C.
            
            new Vex.Flow.StaveNote({ keys: [`${note[0]}/${note[1]}`], duration: "w" }),

            // // A quarter-note D.
            // new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),

            // // A quarter-note rest. Note that the key (b/4) specifies the vertical
            // // position of the rest.
            // new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "qr" }),

            // // A C-Major chord.
            // new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" })
        ];
        // Create a voice in 4/4
        var voice = new Vex.Flow.Voice({
            num_beats: 4,
            beat_value: 4,
            resolution: Vex.Flow.RESOLUTION
        });

        // Add notes to voice
        voice.addTickables(notes);

        // Format and justify the notes to 500 pixels
        new Vex.Flow.Formatter()
            .joinVoices([voice]).format([voice], div.offsetWidth);

        // Render voice

        voice.draw(context, bottomStave);
        voice.draw(context, topStave);

    }

    render() {

        console.log(`render ${this.props.id}`);
        const classNames = `Bar col-${this.props.sectionsPerRow}`;
        return (
            <div className={classNames} ref={(x) => this.barContainer = x} />
        );
    }
}

export default Bar;