const URL_GAS = "https://script.google.com/macros/s/AKfycbxqbGFMhmd9PiyJoWp0dGIGKDLIV-eoTwz-IKoWqvQkhSZXGVYDxv4HU4NdHqxhITyq/exec";

// UI
function verPaso(n){
    document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
    document.getElementById('paso'+n).classList.add('activo');
}

function loader(on,texto="Procesando..."){
    const l = document.getElementById("loader");
    const t = document.getElementById("loader-texto");

    if(t) t.innerText = texto;
    if(l) l.style.display = on ? "flex" : "none";
}

// VALIDAR CÉDULA
function validarCedulaReal(ced){
    if(!/^\d{10}$/.test(ced)) return false;

    let total=0;
    for(let i=0;i<9;i++){
        let num=parseInt(ced[i]);
        if(i%2===0){
            num*=2;
            if(num>9) num-=9;
        }
        total+=num;
    }

    let dec=(10-(total%10))%10;
    return dec===parseInt(ced[9]);
}

// SERVIDOR
async function validarCedulaServidor(cedula){

    if(!validarCedulaReal(cedula)){
        return {ok:false,msg:"Cédula inválida"};
    }

    try{
        const res = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}`);
        const data = await res.json();

        if(data.cedulaExiste){
            return {ok:false,msg:"Ya está registrada"};
        }

        return {ok:true};

    }catch{
        return {ok:false,msg:"Error de conexión"};
    }
}

// NOMBRES
function cargarNombres(){
    const sel = document.getElementById("nombreCamiseta");

    sel.innerHTML = '<option value="">Seleccionar</option>';

    const n1 = document.getElementById("n1").value;
    const n2 = document.getElementById("n2").value;

    if(n1) sel.add(new Option(n1,n1));
    if(n2) sel.add(new Option(n2,n2));
}

// DORSALES
async function cargarDorsales(){

    const sel = document.getElementById("dorsal");
    sel.innerHTML = '<option value="">Seleccionar</option>';

    try{
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json();

        for(let i=1;i<=99;i++){
            if(!ocupados.includes(String(i))){
                sel.add(new Option("Dorsal "+i,i));
            }
        }

    }catch{
        for(let i=1;i<=99;i++){
            sel.add(new Option("Dorsal "+i,i));
        }
    }
}

// CÁMARA
let stream;

async function iniciarCamara(){
    const video=document.getElementById("video");
    stream = await navigator.mediaDevices.getUserMedia({video:true});
    video.srcObject = stream;
}

function capturarFoto(){
    const video=document.getElementById("video");
    const canvas=document.createElement("canvas");

    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    canvas.getContext("2d").drawImage(video,0,0);

    const data=canvas.toDataURL("image/jpeg");

    document.getElementById("previewCamara").src=data;
    document.getElementById("fotoRostroB64").value=data;

    if(stream) stream.getTracks().forEach(t=>t.stop());
}

// ENVIAR
async function enviarRegistro(){

    loader(true,"Guardando...");

    const form=document.getElementById("formRegistro");
    const data=new URLSearchParams(new FormData(form));

    try{
        await fetch(URL_GAS,{
            method:"POST",
            mode:"no-cors",
            body:data
        });

        alert("Registro exitoso");
        location.href="login.html";

    }catch{
        alert("Error al guardar");
    }

    loader(false);
}
