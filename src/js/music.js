const { Howl, Howler } = require('howler');
window.$ = window.jQuery = require('jquery');
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');


var playing = false;
var sound;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function triggerToast(type,msg, arr){
    if(type == "s"){
        $('#toasty .success').toggleClass('hidden')
        $('#toasty .success .message').text(msg)
        $('#toasty').toggleClass('hidden')
        $('#toasty').toggleClass('flex')
        if(arr != null || arr.length != 0){
            for(item in arr){
                $('#toasty .success .list').append(`<li class='text-white appearance-none text-sm list-none'> ${arr[item]}</li>`)
            }
            $('#toasty .success .list').toggleClass('hidden')
        }
        await sleep(5000);
        if(arr != null || arr.length != 0){
            $('#toasty .success .list ul').empty()
            $('#toasty .success .list').toggleClass('hidden')
        }
        $('#toasty').toggleClass('flex')
        $('#toasty').toggleClass('hidden')
        $('#toasty .success').toggleClass('hidden')
    }else if(type=="e"){
        $('#toasty .error').toggleClass('hidden')
        $('#toasty .error .message').text(msg)
        if(arr != null || arr.length != 0){
            for(item in arr){
                $('#toasty .error .list').append(`<li class='text-white appearance-none text-sm list-none'> ${[arr[item]]}</li>`)
            }
            $('#toasty .error .list').toggleClass('hidden')
        }
        $('#toasty').toggleClass('hidden')
        $('#toasty').toggleClass('flex')
        await sleep(5000);
        if(arr != null || arr.length != 0){
            $('#toasty .error .list ul').empty()
            $('#toasty .error .list').toggleClass('hidden')
        }
        $('#toasty').toggleClass('flex')
        $('#toasty').toggleClass('hidden')
        $('#toasty .error').toggleClass('hidden')
    }
}

 
function loadSound(src){
    sound = new Howl({
        src: src,
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

function soundStop(){
    if(playing){
        sound.stop()
        playing = false;
        $('#playClick').text("▶")
        $('#stopClick').toggleClass("active")
    }
}

$('#stopClick').on("click", function(){
    soundStop()
})

$(document).on("click", '.libraryItem', function(e){
    console.log(e.currentTarget.innerText)
    var rootPath = store.get('root_path')
    soundStop()
    fs.readdir(rootPath , async function(err,files){
        for(var file in files){
            if(files[file].includes(e.currentTarget.innerText)){
                console.log("found")
                console.log(files[file])
                loadSound(rootPath + files[file])
                sound.play()
                playing = true
                $('#playClick').text("⏸")
                $('#stopClick').toggleClass("active")
                return;
            }
        }
    })


})

function loadLibrary(){
    var rootPath = store.get('root_path')
    fs.readdir(rootPath , async function(err,files){
        for(file in files){
            var path = files[file]
            if(path.toLowerCase().includes(".mp3") || path.toLowerCase().includes(".wav")){
                $('#library ul').append(`<div class="libraryItem"><h2>${files[file].slice(0,-4)}</h2></div>`)
            }
        }
    })
}


$('#filePicker').on("change", async function(e){
    // console.log(e.target.files[1].path)  
    var newObj = []
    var failedArr = []
    var successArr = []
    var failedImports = 0;
    var successImports = 0;
    console.log(e)
    var rootPath = e.target.files[0].path.split(`\\`)[0] + "\\" + e.target.files[0].path.split(`\\`)[1] + "\\" + e.target.files[0].path.split(`\\`)[2] + "\\" + e.target.files[0].path.split(`\\`)[3] + "\\" + "\\" + e.target.files[0].path.split(`\\`)[4] + "\\"
    store.set('root_path',rootPath)
    console.log(rootPath)
    fs.readdir(rootPath , async function(err,files){
        console.log(files);
        for(const file in files){
            var path = files[file]
            if(path.toLowerCase().includes(".mp3") || path.toLowerCase().includes(".wav")){
                successImports++
                if(successImports < 5){
                    if(files[file]){
                        successArr.push(files[file])
                    }
                }
            }else{
                if(failedImports < 5){
                    if(files[file]){
                        failedArr.push(files[file])
                    }
                }
                failedImports++
            }
        }  

        if(successImports != 0){
            triggerToast("s",`${successImports} files succesfully imported.`, successArr)
            await sleep(5100);
        }
    
        if(failedImports > 0){
            triggerToast("e",`${failedImports} files failed to import.`, failedArr)
        }

        $('fileForm').val('');
        loadLibrary()
    })




    
})

// loadSound('./mp3/test_sound_scotrail.mp3')


if(store.get('root_path')){
    loadLibrary()
    $('#filePickerLabel').text("Click to rechoose!")
    $('#folderName').text("Folder:⠀⠀" + store.get('root_path'))
    $('#folderName').toggleClass('hidden')
}

