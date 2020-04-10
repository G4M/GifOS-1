const apkey = "Ohox8ex7Lv2QOJ94yD6Y88VFoZdXbMtQ";

document.getElementById("sailorNight").addEventListener("click",()=>{
    darkmodeon();
})
document.getElementById("sailorDay").addEventListener("click",()=>{
    darkmodeoff();
})
document.getElementById("flecha").addEventListener("mouseover",()=>{
    document.getElementsByClassName("choice")[0].style.display="flex";
    let flecha = document.getElementById("flecha");
    flecha.firstElementChild.style.transform="rotate(180deg)";    
})
document.getElementById("choice").addEventListener("mouseleave",()=>{
    document.getElementsByClassName("choice")[0].style.display="";
    let flecha = document.getElementById("flecha");
    flecha.firstElementChild.style.transform="rotate(0deg)";    
})
document.getElementById("back").addEventListener("click", () => {
    location.assign("../index.html");
});
function darkmodeon(){
    try {
    localStorage.setItem("theme","dark");
    document.body.style.backgroundColor="#110038";
    document.getElementById("lupa").src="assets/lupa_light.svg"
    document.getElementById("imglogo").src="assets/gifOF_logo_dark.png"
    document.getElementsByClassName("choice")[0].classList.add("dark");
    document.getElementById("crearGif").classList.add("dark");
    document.getElementById("flecha").classList.add("dark");
    document.getElementById("main-btn").classList.add("dark");
    document.getElementById("misGifs").classList.add("dark");
    document.getElementById("window").classList.add("dark");
    document.getElementById("campobusqueda").classList.add("dark");
    document.getElementById("containerSuggestions").classList.add("dark");
    document.getElementById("firstSuggestion").classList.add("dark");
    document.getElementById("secondSuggestion").classList.add("dark");
    document.getElementById("thirdSuggestion").classList.add("dark");
    document.getElementById("buscar").classList.add("dark");
    let headers = document.getElementsByClassName("header")
    for(i=0;i<headers.length;i++){
        headers[i].classList.add("dark");}
    } catch (error) {}
}

function darkmodeoff(){
    try {
    localStorage.setItem("theme","light");
    document.body.style.backgroundColor="#FFFFFF";
    document.getElementById("lupa").src="assets/lupa.svg"
    document.getElementById("imglogo").src="assets/gifOF_logo.png"
    document.getElementsByClassName("choice")[0].classList.remove("dark")
    document.getElementById("crearGif").classList.remove("dark");
    document.getElementById("flecha").classList.remove("dark");
    document.getElementById("main-btn").classList.remove("dark");
    document.getElementById("misGifs").classList.remove("dark");
    document.getElementById("window").classList.remove("dark");
    document.getElementById("campobusqueda").classList.remove("dark");
    document.getElementById("containerSuggestions").classList.remove("dark");
    document.getElementById("firstSuggestion").classList.remove("dark");
    document.getElementById("secondSuggestion").classList.remove("dark");
    document.getElementById("thirdSuggestion").classList.remove("dark");
    document.getElementById("buscar").classList.remove("dark");
    let headers = document.getElementsByClassName("header")
    for(i=0;i<headers.length;i++){
        headers[i].classList.remove("dark");}
    } catch (error) {}
}

async function getgif(busqueda, endpointurl){
    let url;
    if(endpointurl=="search"){
        url = "https://api.giphy.com/v1/gifs/search?api_key="+apkey+"&q="+busqueda+"&limit=12&offset=0&rating=G&lang=en";
    }else if(endpointurl == "trending"){
        url="https://api.giphy.com/v1/gifs/trending?api_key="+ apkey + "&limit=4";
    }else if(endpointurl=='random'){
        url="http://api.giphy.com/v1/gifs/random?&api_key=" + apkey
        try{
            const respuesta = await fetch(url);
            resultrand = await respuesta.json();
            return resultrand;
            }catch(e){
                console.log("error en getgif: "+e);
                }
    }
        try{
        const respuesta = await fetch(url);
        result = await respuesta.json();
        return result;
        }catch(e){
            console.log("error en getgif: "+e);
            }
    
}

function printresults(datas, location){

    if(location=="suggest"){
        let crearimgx = document.createElement("img");
            crearimgx.className="close";
            crearimgx.id=location+"_close_"+datas;
            crearimgx.src=".//assets/button3.svg";
            return(crearimgx);
        }
let long
if(location=="misGuifs"){
    long = datas.length;
}else{long = Object.keys(datas.data).length;}

for (let index = 0; index < long ; index++){
    let creardiv = document.createElement("div");
        creardiv.className="contimage";
        creardiv.id="contimage "+ index;
    let creardiv2 = document.createElement("div");
            creardiv2.className="header";
            creardiv2.id="header"+[index];

        if(location== "search" && datas.data[index].images.fixed_height.width > screen.width/3.2){
            creardiv.style = "max-width: 48%; width: 48%";
        }
        if(location!="misGuifs"){
            creardiv2.innerText="#"+datas.data[index].title;
        }
        if(theme=="dark"){
            creardiv2.classList.add("dark");
        }
        if(location!="suggest"){
            creardiv2.style.display="none";
            creardiv.addEventListener("mouseover",()=>{
                creardiv2.style.display="flex";
                creardiv2.style.position="absolute";
                creardiv2.style.width=creardiv2.parentElement.lastChild.width+"px";
            })
            creardiv.addEventListener("mouseleave",()=>{
                creardiv2.style.display="none";
            })
        }
    creardiv.appendChild(creardiv2);
    let crearimg = document.createElement("img");
    if(location=="misGuifs"){crearimg.src=datas[index]}
    else{
    crearimg.src=datas.data[index].images.fixed_height.url;}
    creardiv.appendChild(crearimg);
    document.getElementById(location).insertBefore(creardiv, document.getElementById(location).lastElementChild);
    }
}