var theme = localStorage.getItem("theme");
document.getElementById("cancelar").addEventListener("click",()=>{
    document.getElementById("cartel").remove();
});
document.getElementById("comenzar").addEventListener("click",()=>{
    document.getElementById("cartel-titulo").remove();
    document.getElementById("cuerpo").remove();
    document.getElementById("videoCont").style.display="flex";
    document.getElementById("contcamera").style.display="flex";
    vistaPreviaVideo();
});
document.getElementById("cross").addEventListener("click",()=>{
    cancelarSubida();
})

document.getElementById("crearGif").addEventListener("click", () => {
    location.assign("../pages/crearGifos.html");
});
document.getElementById("misGifs").addEventListener("click", () => {
    location.assign("../pages/misGuifos.html");
});


window.onload = async()=>{
    document.getElementById("back").style.display="block";
    if(theme!=null){
        if(theme=="light"){
            darkmodeoff();
        }else{darkmodeon();}
    }else{darkmodeoff();}

}

var blob;
var grabacion;
var miCamara;
var video = document.querySelector('video');
var videoGuardado = document.getElementById("videoGuardado");
var misGif = [];
var data;

function vistaPreviaVideo() {
    document.getElementById("stop").style.marginRight="0";
    document.getElementById("stop").style.backgroundColor="#F7C9F3";
    document.getElementById("stop").innerHTML='<img id="stop2" src="../assets/camera.svg">';

    document.getElementById("headerr").textContent="Un Chequeo Antes de Empezar";
    document.getElementById("record").textContent="Capturar";
    document.getElementById("record").style.backgroundColor="#F7C9F3";
        document.getElementById("record").setAttribute("onclick", "comenzarGrabacion()");
    document.getElementById("stop2").src="../assets/camera.svg";
    
        document.getElementById("stop").setAttribute("onclick", null);
    document.getElementById("stop").style.width="auto";
    document.getElementById("stop").style.marginRight="0";
    document.getElementById("videoContent").style.display="flex";
    document.getElementById("videoGuardado").style.display="none";
    var param = {audio:false, video:{height: {max: 480}}}
    navigator.mediaDevices.getUserMedia(param)
        .then(stream => {
            miCamara = stream;
            video.srcObject = miCamara;
        })
        .catch(console.error)
}

function comenzarGrabacion() {
    document.getElementById("record").textContent="Listo";
    document.getElementById("record").style.backgroundColor="#FF6161";
    document.getElementById("stop").style.backgroundColor="#FF6161";
    document.getElementById("stop2").src="../assets/recording.svg";
    grabacion = crearGrabador(miCamara);
    grabacion.startRecording();
    document.getElementById("record").setAttribute("onclick","terminarGrabacion();");
    return;
}

function terminarGrabacion() {
    document.getElementById("record").textContent="Subir Guifo";
        document.getElementById("record").setAttribute("onclick", "subirGif()");
    document.getElementById("record").style.backgroundColor="#F7C9F3";
    document.getElementById("stop").style.backgroundColor="#F7C9F3";
    document.getElementById("stop").innerHTML='<img id="stop2" src=""> Repetir Captura';
        document.getElementById("stop").setAttribute("onclick","vistaPreviaVideo();");
    document.getElementById("stop").style.width="auto";
    document.getElementById("stop").style.marginRight="14px";
    document.getElementById("videoContent").style.display="none";
    document.getElementById("videoGuardado").style.display="block";
    grabacion.stopRecording(() => {
        blob = grabacion.getBlob();
        document.getElementById("videoGuardado").src = grabacion.toURL();
        grabacion.destroy();
        grabacion = null;
        miCamara.getTracks().forEach(function(track) {
            track.stop();
        });
    });
    
}

function crearGrabador(transmision) {
    return RecordRTC(transmision, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        //timeSlice: 3000,
    });
}

function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif');
}

function subirGif() {
    //stop videocont y videocontent
    document.getElementById("stop").remove();
    document.getElementById("videoGuardado").remove();
    document.getElementById("videoContent").remove();
    document.getElementById("videoCont").style.justifyContent="center";
    let container = document.createElement("div");
        container.style.display="flex";
        container.style.flexDirection="column-reverse";
        container.style.alignSelf = "flex-start";
        container.style.marginRight = "27px";
        container.style.width="100%";
        container.style.height="440px";
    let globito = document.createElement("img");
    let texto = document.createElement("p");
    texto.className="textImgUp";
    texto.id="textImgUp";
    texto.textContent="Estamos subiendo tu guifo…"
    globito.className="uploadingImg";
    globito.id="centralImage";
    globito.src="../assets/globe_img.png";
    container.appendChild(texto);
    container.appendChild(globito);
    document.getElementById("videoCont").appendChild(container);
    
    document.getElementById("record").style.width="auto";
    document.getElementById("record").textContent="Cancelar"
    document.getElementById("record").setAttribute("onclick", "cancelarSubida()");

    data = new FormData();
    data.append('file', blob, 'misGif.gif');
    var parametros = {
        method: 'POST',
        body: data,
    };

    let URL = 'https://upload.giphy.com/v1/gifs?&api_key=' + apkey + '&username=' + 'gabrielmaselli';
    const found = fetch(URL, parametros)
        .then(response => {
            mostrarcartelDescargar();
            return response.json();
        }).then(datos => {
            saveLocalStorage(datos.data.id);
        })

    .catch(error => {
        console.log(error);
        return error;
    });
    return found;
}
function mostrarcartelDescargar() {
    let gifURL = URL.createObjectURL(blob);
    document.getElementById('centralImage').src = gifURL;
    document.getElementById('centralImage').style.width="auto";
    document.getElementById('centralImage').style.height="auto";
}
function cancelarSubida() {
    window.location.reload();
}

function saveLocalStorage(id) {
    fetch("https://api.giphy.com/v1/gifs/" + id + '?' + '&api_key=' + apkey)
        .then(response => {
            return response.json();
        })
        .then(dataGif => {
            let url = dataGif.data.images.downsized.url
            if (localStorage.getItem('GifList')) {
                misGif = JSON.parse(localStorage.getItem('GifList'));
                misGif.push(url);
                localStorage.setItem('GifList', JSON.stringify(misGif));
            } else {
                misGif.push(url);
                localStorage.setItem('GifList', JSON.stringify(misGif));
            }
        });
    document.getElementById("textImgUp").textContent="Guifo creado con éxito";
    let botones = document.createElement("div");
        botones.id="botonesCopy";
        botones.style.display="flex";
        botones.style.flexDirection ="column";
        botones.style.justifyContent="center";
        botones.style.alignItems="center";
        botones.style.marginRight="16px";
    let botonEnlace = document.createElement("button");
        botonEnlace.id="copiarEnlace";
        botonEnlace.textContent="Copiar Enlace Guifo";
        botonEnlace.className="main-btn";
        botonEnlace.style.backgroundColor="#FFF4FD";
        botonEnlace.style.width="256px";
        botonEnlace.style.height="36px";
        botonEnlace.style.marginTop="16px";
        botonEnlace.setAttribute("onclick", "copiarUrl();");


    let botonDescarga = document.createElement("button");
        botonDescarga.id ="descargarGuifo";
        botonDescarga.textContent="Descargar Guifo";
        botonDescarga.className="main-btn";
        botonDescarga.style.backgroundColor="#FFF4FD";
        botonDescarga.style.width="256px";
        botonDescarga.style.height="36px";
        botonDescarga.style.marginTop="14px"
        botonDescarga.setAttribute("onclick", "descargarGif()");
    
    botones.appendChild(document.getElementById("textImgUp"));
    botones.appendChild(botonEnlace);
    botones.appendChild(botonDescarga);
    document.getElementById("videoCont").appendChild(botones);
    document.getElementById("videoCont").style.height="391px"
    document.getElementById("record").textContent="Listo"
    document.getElementById("record").style.width="144px"

}

function copiarUrl() {
    let copiarEnlaceGuifos = JSON.parse(localStorage.getItem('GifList'));
    let aux = copiarEnlaceGuifos.length-1;
    let textoo = copiarEnlaceGuifos[aux];
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';textArea.style.top = 0;textArea.style.left = 0;
    textArea.style.width = '2em';textArea.style.height = '2em';
    textArea.style.padding = 0;textArea.style.border = 'none';
    textArea.style.outline = 'none';textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';textArea.value = textoo;
    document.body.appendChild(textArea);
    textArea.focus();textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      alert("Copiado con éxito")
    } catch (err) {
      console.log("No se pudo copiar");
    }
    document.body.removeChild(textArea);
  }