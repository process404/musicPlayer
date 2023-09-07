// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const {Howl, Howler} = require('howler');

Howler.usingWebAudio = true
Howler.volume = 1
