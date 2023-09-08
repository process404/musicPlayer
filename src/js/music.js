const { Howl, Howler } = require('howler');
window.$ = window.jQuery = require('jquery');
const Store = require('electron-store');
const store = new Store();


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

$('#stopClick').on("click", function(){
    if(playing){
        sound.stop()
        playing = false;
        $('#playClick').text("▶")
        $('#stopClick').toggleClass("active")
    }
})

$(document).on("click", '.libraryItem', function(e){
    console.log(e.currentTarget.innerText)
    const storeFiles = store.get('music_files')
    for(file in storeFiles){
        if(storeFiles[file].name.includes(e.currentTarget.innerText)){
            console.log("found")
            console.log(storeFiles[file].path)
            loadSound(storeFiles[file].path)
            sound.play()
            $('#playClick').text("⏸")
            $('#stopClick').toggleClass("active")
            return;
        }
    }
})

function loadLibrary(){
    const storeFiles = store.get('music_files')
    for(file in storeFiles){
        $('#library ul').append(`<div class="libraryItem"><h2>${storeFiles[file].name.slice(0,-4)}</h2></div>`)
    }
}


$('#filePicker').on("change", async function(e){
    // console.log(e.target.files[1].path)  
    var newObj = []
    var failedArr = []
    var successArr = []
    var failedImports = 0;
    var successImports = 0;
    for(const file in e.target.files){
        var path = e.target.files[file].path
        if(path != undefined){
            if(path.toLowerCase().includes(".mp3") || path.toLowerCase().includes(".wav")){
                newObj.push({"path":path,"name":e.target.files[file].name})
                successImports++
                if(successImports < 5){
                    if(e.target.files[file].name){
                        successArr.push(e.target.files[file].name)
                    }
                }
            }else{
                if(failedImports < 5){
                    if(e.target.files[file].name){
                        failedArr.push(e.target.files[file].name)
                    }
                }
                failedImports++
            }
        }
    }   

    store.set('music_files', newObj)
    console.log(store.get())

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

// loadSound('./mp3/test_sound_scotrail.mp3')


