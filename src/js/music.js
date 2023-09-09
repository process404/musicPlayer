const { Howl, Howler } = require('howler');
window.$ = window.jQuery = require('jquery');
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const mm = require('music-metadata');
const util = require('util');


var playing = false;
var sound;

const acceptedFiles = [".mp3",".wav"]


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

 
function loadSound(src, name){
    sound = new Howl({
        src: src,
        onend: function(){
            playing = false
            $('#playClick').text("▶")
            $('#stopClick').toggleClass("active")
        }
    });

    $('#nowPlaying').text(name.slice(0,-4))
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
    if($(this).attr('data-playing') == 'true'){
        $('.libraryItem').text("▶")
        sound.pause()
        $(this).attr('data-playing', false)
        $('#playClick').text("▶")
        return;
    }else{
        $('.libraryItem').text("▶")
        // console.log(e.currentTarget.innerText)
        var rootPath = store.get('root_path')
        soundStop()
        var path = $(this).attr('data-path')
        fs.readdir(rootPath , async function(err,files){
            for(var file in files){
                if(files[file].includes(path)){
                    loadSound(rootPath + files[file], path)
                    sound.play()
                    playing = true
                    $('#playClick').text("⏸")
                    $('#stopClick').toggleClass("active")
                    return;
                }
            }
        })

        $(this).attr('data-playing', true)
        $(this).text("⏸")
    
    }


})

async function loadLibrary(){
    var rootPath = store.get('root_path')
    fs.readdir(rootPath , async function(err,files){
        var counter = 0
        for(file in files){
            var path = files[file]
            if(acceptedFiles.includes(path.toLowerCase().slice(-4))){
                var metadata = await mm.parseFile(rootPath + "\\" + path)
                console.log(path, metadata)
                const divBuilder = $('#library ul').append(`<div class="libItem_${counter} w-[32%] relative"></div>`)
                if(metadata.common.picture != null){
                    $(`.libItem_${counter}`).append(`<div class="absolute bg-black w-full h-full bg-opacity-80 backdrop-blur-sm"></div>`)
                    $(`.libItem_${counter}`).append(`<img class="w-full h-full" src="data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}"/>`)
                    $(`.libItem_${counter}`).append(`<div class="absolute w-full h-full flex flex-col top-0 p-8 items-center justify-between text-white text-left z-10 innerBox"><h2>${path.slice(0,-4)}</h2></div>`)
                    $(`.libItem_${counter} .innerBox`).append(`<div class="flex w-full"><button class="button ml-auto  text-white bg-teal-800 p-2 rounded-md hover:bg-teal-900 hover:scale-[125%] transition-all libraryItem" data-path='${path}' data-playing='false'>▶</button></div>`)
                }else{
                    $(`.libItem_${counter}`).append(`<div class="absolute bg-black w-full h-full bg-opacity-80 backdrop-blur-sm"></div>`)
                    $(`.libItem_${counter}`).append(`<img class="w-full h-full" src="./storage/blank_icon.jpg"/>`)
                    $(`.libItem_${counter}`).append(`<div class="absolute w-full h-full top-0 flex flex-col p-8 items-center justify-between text-white text-left z-10 innerBox"><h2>${path.slice(0,-4)}</h2></div>`)
                    $(`.libItem_${counter} .innerBox`).append(`<div class="flex w-full"><button class="button ml-auto bg-teal-800 p-2 rounded-md hover:bg-teal-900 hover:scale-[125%] transition-all libraryItem text-white" data-path='${path}' data-playing='false'>▶</button></div>`)
                }
            }
            counter++
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
    // console.log(e)
    var rootPath = e.target.files[0].path.split(`\\`)[0] + "\\" + e.target.files[0].path.split(`\\`)[1] + "\\" + e.target.files[0].path.split(`\\`)[2] + "\\" + e.target.files[0].path.split(`\\`)[3] + "\\" + "\\" + e.target.files[0].path.split(`\\`)[4] + "\\"
    store.set('root_path',rootPath)
    console.log(rootPath)
    fs.readdir(rootPath , async function(err,files){
        console.log(files);
        for(const file in files){
            var path = files[file]
            if(acceptedFiles.includes(path.toLowerCase().slice(-4))){
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
            triggerToast("s",`Folder successfully set!`, successArr)
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

