const buscar = document.getElementById("buscar");
const inputBusqueda = document.getElementById("busqueda");
var arrayBusquedas= new Array();
var aux = localStorage.getItem("busqueda");
var theme = localStorage.getItem("theme");
var result;
var resultrand;
var trend;
var searching;

document.getElementById("crearGif").addEventListener("click", () => {
    location.assign(".//pages/crearGifos.html");
});
document.getElementById("misGifs").addEventListener("click", () => {
    location.assign(".//pages/misGuifos.html");
});

if(aux != null){
    arrayBusquedas.push(aux.toString());
    let arrbtn = aux.split(",");
    for(let i=0;i<arrbtn.length;i++){
        agregarBoton(arrbtn[i]);
    }
};

 window.onload = async()=>{
     if(theme!=null){
         if(theme=="light"){
             darkmodeoff();
         }else{darkmodeon();}
     }else{darkmodeoff();}
    getTrend();
    removeIdChilds("today-4w");
    removeIdChilds("search");
    tenButtonsSuggest();
    for(let i=1;i<8;i++){
        createRandViews(i);
        await getRand(i);
    }
}

inputBusqueda.addEventListener("keyup",(e)=>{
    if (e.keyCode == 13){
        buscar.click();
        }
    buscar.disabled=false;
    if(inputBusqueda.value==""){
    buscar.disabled=true;
    document.getElementById("suggestions").style.display="none";
    }else{
    let flag=0;
    mostrarSugerencia(inputBusqueda.value);
    document.getElementById("containerSuggestions").display="flex";
    for(let i=0;i<3;i++){
        if(document.getElementsByClassName("suggest")[i].value=="undefined"){
            document.getElementsByClassName("suggest")[i].style.display="none";
        }else{
            flag=1;
            document.getElementById("containerSuggestions").display="flex";
            document.getElementsByClassName("suggest")[i].style.display="flex";}
    }
    if(flag==0)
    {document.getElementById("containerSuggestions").style.display="none"}else{
        document.getElementById("suggestions").style.display="flex";
        document.getElementById("containerSuggestions").style.display="flex";
    }
    }
});

buscar.addEventListener("click",async()=>{
    buscar.disabled=true;
    document.getElementById("suggestions").style.display="none";
    var busqueda = document.getElementById("busqueda").value;
    document.getElementById("busqueda").value="";
    let ident ="search";
    storageSearch(busqueda);
    removeIdChilds(ident);
    result= await getgif(busqueda,ident);
    await printresults(result, ident);
    document.getElementById("resultados").style.display="block";
    document.getElementById("search").style.display="flex";
    setTimeout(scrollToMe,900);
    agregarBoton(busqueda); 
});

document.getElementById("firstSuggestion").addEventListener("click",()=>{
    inputBusqueda.value = document.getElementById("firstSuggestion").value;
    buscar.disabled=false;
    buscar.click();
});
document.getElementById("secondSuggestion").addEventListener("click",()=>{
    inputBusqueda.value = document.getElementById("secondSuggestion").value;
    buscar.disabled=false;
    buscar.click();
});
document.getElementById("thirdSuggestion").addEventListener("click",()=>{
    inputBusqueda.value = document.getElementById("thirdSuggestion").value;
    buscar.disabled=false;
    buscar.click();
});
//Functions:
function createRandViews(ids){
    let viewmore = document.createElement("div");
    viewmore.className="viewmore";
     let contimg = document.createElement("div");
     contimg.className = "contimage";
      let ahead = document.createElement("div");
      ahead.className = "header";
        if(theme=="dark"){ahead.classList.add("dark");}
       let imagen = document.createElement("img");
       imagen.class="close";
       imagen.src=".//assets/button3.svg";
       let imagen2 = document.createElement("img");
       imagen2.class="imgs";
       imagen2.src=".//assets/test.gif";
       imagen2.id="view"+ids;
ahead.appendChild(imagen);
contimg.appendChild(ahead);
viewmore.appendChild(contimg);
contimg.appendChild(imagen2)
let botonn = document.createElement("button");
botonn.innerText="Ver más...";
botonn.className="btn-searcher";
botonn.id="btn-searcher"+ids;
    if(theme=="dark"){
        botonn.classList.add("dark");
    }
contimg.appendChild(botonn);
document.getElementById("today-4w").appendChild(viewmore);
funcboton(botonn.id);

}

function getChildNodes(element) {
    let resultss=[];
    for (var i = 0; i < element.childNodes.length; i++) { // cuenta los hijos primarios que tiene
        if (element.childNodes[i].nodeType==3) { // si es un texto no lo guardamos
            continue;
        }
 
        resultss.push(element.childNodes[i]);
        if (element.childNodes[i].hasChildNodes()) { // si tiene hijos
            resultss=resultss.concat(getChildNodes(element.childNodes[i])); // llamamos la funcion nuevamente
        }
    }
    return resultss;
}
 
function funcboton(ide){
    let elem = document.getElementById(ide);
    elem.addEventListener("click",()=>{
        inputBusqueda.value=elem.parentElement.firstElementChild.textContent.split('# ')[1];
        buscar.disabled=false;
        buscar.click();        
    });
}

async function mostrarSugerencia(aaa){
       url = "http://api.giphy.com/v1/tags/related/%7B" + aaa + "%7D?api_key="+apkey;
       let thisiss = await fetch(url);
       let datas = await thisiss.json();
       let asignar = document.getElementsByClassName("suggest");
       try {
           for(let w=0;w<3;w++){
               asignar[w].value=datas.data[w].name;
            }
       } catch (error) { }
}



async function getRand(id){
    let ident = "random";
    let randomimg = await getgif(ident, ident);
    let pos = document.getElementById("view"+id);
    pos.src=randomimg.data.images.fixed_height.url;
    if((typeof(randomimg.data.username)=="string")&&(randomimg.data.username!="")){
    pos.parentElement.firstElementChild.innerText="# "+randomimg.data.username;}
    else if((typeof(randomimg.data.title)=="string")&&randomimg.data.title!=""&&randomimg.data.title!=null){
        pos.parentElement.firstElementChild.innerText="# "+randomimg.data.title.split(" ")[0];}
    else{pos.parentElement.firstElementChild.innerText="Random";}
        let cross = printresults(id,"suggest");

        cross.addEventListener("click",()=>{
                
                pos.parentElement.parentElement.remove();
                
            });

        pos.parentElement.firstElementChild.appendChild(cross);
        
            
        
}
    
async function getTrend(){
    let ident = "trending"
    removeIdChilds(ident);
    //search or trending?
    trend = await getgif(busqueda,ident);
    await printresults(trend, ident);
    
}

function storageSearch(busqueda){
    if(arrayBusquedas.length==0){
        localStorage.setItem("busqueda",busqueda);
        arrayBusquedas.push(busqueda);
    }else{
            arrayBusquedas.push(busqueda);
                for(let i=0;i<arrayBusquedas.length-1;i++){
                    if(arrayBusquedas[i]===busqueda){
                        arrayBusquedas.pop();
                    }
                }
        localStorage.setItem("busqueda",arrayBusquedas.toString());
    }

}

function agregarBoton(palabra){
    let botonera = document.getElementById("botonera");
    let botones = getChildNodes(document.getElementById("botonera"));
    let flag = 0;
    for(let i=1;i<botones.length;i++){
        if(botones[i].id==palabra){
            flag=1;
        }
    }
    if(flag==0){
    let boton = document.createElement("button");
    boton.className="botonLocal";
    boton.innerText="# "+ palabra;
    boton.id=palabra;
    botonera.appendChild(boton);
    boton.addEventListener("click",()=>{
        inputBusqueda.value=boton.id;
        buscar.disabled=false;
        buscar.click();
    })
    }
    tenButtonsSuggest();
}

function scrollToMe(){
    document.getElementById("search").scrollIntoView({
        block: "start",
        behavior: "smooth",
    });
}

function removeIdChilds(id) {
    let imgs = document.getElementById(id);
    
    while (imgs.firstChild) {
        imgs.removeChild(imgs.firstChild);
      }
    
}

function tenButtonsSuggest(){
    while (document.getElementById("botonera").childNodes.length>12){document.getElementById("botonera").firstElementChild.remove();}
}