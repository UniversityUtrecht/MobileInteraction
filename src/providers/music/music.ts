//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import MIDIPlayer from 'midi.js';
import MIDIWriter from 'jsmidgen';

@Injectable()
export class MusicProvider {
  
  note:string = "c4"; // the MIDI note
  velocity:number = 255; // how hard the note hits
  delay:number = 0; // play one note every quarter second
  
  timeStart:number=0;
  timeEnd:number=0;
  
  file:MIDIWriter.File = new MIDIWriter.File(); 
  track:MIDIWriter.Track = new MIDIWriter.Track(); 
  
  
  
  constructor() {
	MIDIPlayer.loadPlugin({
      soundfontUrl: "/assets/soundfont/",
      onprogress: function(state, progress) {
        console.log(state, progress);
      },  
      onsuccess: function() { 
        MIDIPlayer.setVolume(0, 255);
      }
    });
    this.file.addTrack(this.track);
  }
  
  test() {
    //var file = new MIDIWriter.File();
    //var track = new MIDIWriter.Track();
    //

    // 128 = 1/4 note
    this.track.addNote(0, 'C4', 64);
    this.track.addNote(0, 'D4', 64);
    //this.track.addNote(0, 'E4', 64);
    //this.track.addNote(0, 'F4', 64);
    //this.track.addNote(0, 'g4', 64);
    //this.track.addNote(0, 'a4', 64);
    //this.track.addNote(0, 'b4', 64);
    //this.track.addNote(0, 'c5', 64);


    //MIDIPlayer.noteOn(0, MIDI.keyToNote["C4"], this.velocity, this.delay);
    //MIDIPlayer.noteOff(0, MIDI.keyToNote["C4"], this.delay+0.75);
    //console.log(this.track);
    this.playWholeSheet();
    console.log(this.track);

  }

  
  startNotePlay(note:string) {
    this.timeStart = new Date().getTime();
    this.note = note.toUpperCase();
    MIDIPlayer.noteOn(0, MIDIPlayer.keyToNote[this.note], this.velocity, this.delay);
  }
  
  stopNotePlay() {
    MIDIPlayer.noteOff(0, MIDIPlayer.keyToNote[this.note], this.delay);
    this.timeEnd = new Date().getTime();
    var time = this.timeEnd - this.timeStart;
    
    console.log(time);
    this.addNote(time);
  }
  
  addNote(time:number)
  {
    var noteTime = Math.min(time, 1024)/2;
    this.track.addNote(0, this.note, noteTime);
    console.log(noteTime, this.note);
  }
  
  playSingleNote(note: string, duration: number = 1) {
    MIDIPlayer.noteOn(0, MIDIPlayer.keyToNote[note.toUpperCase()], this.velocity, 0);
    MIDIPlayer.noteOff(0, MIDIPlayer.keyToNote[note.toUpperCase()], this.velocity, duration);
    
    console.log(this.note, duration);
  }
  
  playWholeSheet() {
    MIDIPlayer.Player.currentData = this.file.toBytes();
    MIDIPlayer.Player.loadMidiFile();
    MIDIPlayer.Player.stop(); 
    MIDIPlayer.Player.start();
    
    // TODO: why is last tone skipped?
  }
}
