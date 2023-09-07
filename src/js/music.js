const { Howl, Howler } = require('howler');
window.$ = window.jQuery = require('jquery');

var playing = false;

var sound = new Howl({
    src: ['./mp3/test_sound_scotrail.mp3'],
    onend: function(){
        playing = false
        $('#playClick').text("Click to play")
    }
});


$('#playClick').on("click", function(){

    if(playing){
        sound.pause()
        playing = false
        $('#playClick').text("Click to play")
    }else{
        sound.play()
        playing = true
        $('#playClick').text("Click to pause")
    }
})
