const { Howl, Howler } = require('howler');
window.$ = window.jQuery = require('jquery');

var playing = false;

var sound;

function loadSound(src){
    sound = new Howl({
        src: './mp3/test_sound_scotrail.mp3',
        onend: function(){
            playing = false
            $('#playClick').text("▶")
            $('#stopClick').toggleClass("active")
        }
    });

    $('#nowPlaying').text(src.split("/")[2])
}

$('#playClick').on("click", function(){

    if(playing){
        sound.pause()
        playing = false
        $('#playClick').text("▶")
        $('#stopClick').toggleClass("active")
    }else{
        sound.play()
        playing = true
        $('#playClick').text("⏸")
        $('#stopClick').toggleClass("active")
    }
})

$('#stopClick').on("click", function(){
    if(playing){
        sound.stop()
        playing = false;
        $('#playClick').text("▶")
        $('#stopClick').toggleClass("active")
    }
})

$('#filePicker').on("change", function(e){
    console.log("hi")
    console.log(e.target.files[0])
})

loadSound('./mp3/test_sound_scotrail.mp3')


