var theme = localStorage.getItem("theme");


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
if(localStorage.getItem("GifList")!=null){
let misgifs = JSON.parse(localStorage.getItem("GifList"));
printresults(misgifs,"misGuifs")
}
}
