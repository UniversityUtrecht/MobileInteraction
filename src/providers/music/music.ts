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
  
  noteList: string[] = [];
  noteDurations: number[] = [];
  
  
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
  }
  
  // Test function, ignore it.
  test() {
    //var file = new MIDIWriter.File();
    //var track = new MIDIWriter.Track();
    //

    // 128 = 1/4 note
    //this.track.addNote(0, 'C4', 64);
    //this.track.addNote(0, 'D4', 64);
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
  }

  // Transform note string formatting to correct format.
  getCorrectNoteFormat(note: string) {
	return note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
  }
  
  // Start playing note and measuring its play time.
  startNotePlay(note:string) {
    this.timeStart = new Date().getTime();
    this.note = this.getCorrectNoteFormat(note);
    MIDIPlayer.noteOn(0, MIDIPlayer.keyToNote[this.note], this.velocity, this.delay);
  }
  
  // Calculate note play time and transform it to discrete time.
  getNoteTime(start:number, end:number)
  {
	  let time:number = end - start;
	  //let noteTime:number = Math.min(time, 1024)/2; // 512 = full 1 note, 1s = 512
	  let noteTime:number = time/2;
	  return noteTime;
  }
  
  // Get currently playing note discrete time.
  getCurrentPlayingNoteTime()
  {
	  let end:number = new Date().getTime();
	  return this.getNoteTime(this.timeStart, end);
  }
  
  // Stop playing note, measure time the note should be playing and add it to the internal notes list.
  stopNotePlay() {
    MIDIPlayer.noteOff(0, MIDIPlayer.keyToNote[this.note], this.delay);
    this.timeEnd = new Date().getTime();
    this.addNote(this.note, this.getNoteTime(this.timeStart, this.timeEnd));
  }
  
  // Add note and its duration to the internal note list.
  addNote(note: string, time:number)
  {
	this.noteList.push(note);
	this.noteDurations.push(time);
  }
  
  // Remove last added note.
  undoLastNote()
  {
	this.noteList.pop();
	this.noteDurations.pop();
  }
  
  // Play a single note. This not is not added to the whole music sheet.
  playSingleNote(note: string, duration: number = 1) {
    MIDIPlayer.noteOn(0, MIDIPlayer.keyToNote[this.getCorrectNoteFormat(note)], this.velocity, 0);
    MIDIPlayer.noteOff(0, MIDIPlayer.keyToNote[this.getCorrectNoteFormat(note)], this.velocity, duration);
  }
  
  // Generate MIDI format file from internal data structure.
  generateMIDITrack()
  {
	  let file:MIDIWriter.File = new MIDIWriter.File(); 
	  let track:MIDIWriter.Track = new MIDIWriter.Track(); 
	  file.addTrack(track);
	  for (let i in this.noteList) {
		track.addNote(0, this.noteList[i], this.noteDurations[i]);
	  }
	  return file;
  }
  
  // Plays whole music sheet.
  playWholeSheet() {
    MIDIPlayer.Player.currentData = this.generateMIDITrack().toBytes();
    MIDIPlayer.Player.loadMidiFile();
    MIDIPlayer.Player.stop(); 
    MIDIPlayer.Player.start();
  }
}
