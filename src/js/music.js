const { Howl, Howler } = require('howler');
window.$ = window.jQuery = require('jquery');
const Store = require('electron-store');
const store = new Store();


var playing = false;
var sound;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function triggerToast(type,msg){
    if(type == "s"){
        $('#toasty .success').toggleClass('messageActive')
        $('#toasty .success .message').text(msg)
        $('#toasty').toggleClass('toastyActive')
        await sleep(5000);
        $('#toasty').toggleClass('toastyActive')
        $('#toasty .success').toggleClass('messageActive')
    }else if(type=="e"){
        $('#toasty .error').toggleClass('messageActive')
        $('#toasty .error .message').text(msg)
        $('#toasty').toggleClass('toastyActive')
        await sleep(5000);
        $('#toasty').toggleClass('toastyActive')
        $('#toasty .error').toggleClass('messageActive')
    }
}

 
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
    console.log(e.target.files[1].path)  
    var newObj = []
    var failedImports = 0;
    for(const file in e.target.files){
        var path = e.target.files[file].path
        console.log(path)
        if(path != undefined){
            if(path.includes(".mp3") || path.includes(".wav")){
                newObj.push({"path":path})
            }else{
                failedImports++
            }
        }
    }   

    if(failedImports > 0){
        triggerToast("e",`${failedImports} files failed to import.`)
    }
    store.set('music_files', newObj)
    console.log(store.get())

    $('fileForm').val('');
})

loadSound('./mp3/test_sound_scotrail.mp3')


