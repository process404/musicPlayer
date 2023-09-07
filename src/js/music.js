const { Howl, Howler } = require('howler');

var sound = new Howl({
    src: ['./mp3/announcements_0012.mp3']
    });
    
    Howler.volume = 1
    
    sound.once('load', function(){
    sound.play();
    });
    
    sound.on('end', function(){
    console.log('Finished!');
});