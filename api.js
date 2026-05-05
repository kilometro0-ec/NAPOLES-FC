const URL_GAS = 'https://script.google.com/macros/s/AKfycbxB7NezJt9SzVasnD20sEsj3t0kjlIZS_7_t5qGCfFTIPIq9a4WEQwVvE4Ey27jgnsl/exec';


// UI
function verPaso(n){
    document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
    document.getElementById('paso'+n).classList.add('activo');
    window.scrollTo(0,0);
}

function loader(on,text="PROCESANDO..."){
    const l=document.getElementById('loader');
    document.getElementById('loader-texto').innerText=text;
    l.style.display= on ? 'flex':'none';
}

// MAYÚSCULAS AUTOMÁTICAS
document.addEventListener("input", e=>{
    if(e.target.name && e.target.name !== "correo"){
        e.target.value = e.target.value.toUpperCase();
    }
});

// VALIDAR CÉDULA ECUADOR
function validarCedulaReal(ced){
    if(!/^\d{10}$/.test(ced)) return false;
    let total=0;
    for(let i=0;i<9;i++){
        let num=parseInt(ced[i]);
        if(i%2===0){ num*=2; if(num>9) num-=9; }
        total+=num;
    }
    let dec=(10-(total%10))%10;
    return dec===parseInt(ced[9]);
}

// PASO 1
async function validarCedulaEstricta(){
    const ced=document.getElementById('ced').value;

    if(!validarCedulaReal(ced)){
        alert("CÉDULA INVÁLIDA");
        return;
    }

    loader(true,"VALIDANDO...");

    try{
        const res=await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced}`);
        const data=await res.json();

        if(data.cedulaExiste){
            alert("YA REGISTRADO");
        }else{
            verPaso(2);
        }
    }catch{
        alert("ERROR DE CONEXIÓN");
    }

    loader(false);
}

// PASO 2
function validarPaso2(){
    const n1=document.getElementById('n1').value.trim();
    const ape=document.getElementById('ape').value.trim();

    if(!n1 || !ape){
        alert("COMPLETE LOS CAMPOS");
        return;
    }
    verPaso(3);
}

// PASO 3
function validarPaso3(){
    const tel=document.querySelector('[name=telefono]').value;
    const correo=document.querySelector('[name=correo]').value;

    if(!/^09\d{8}$/.test(tel)){
        alert("TELÉFONO INVÁLIDO");
        return;
    }

    if(!/^\S+@\S+\.\S+$/.test(correo)){
        alert("CORREO INVÁLIDO");
        return;
    }

    verPaso(4);
}

// PREVIEW
function previewFile(input,imgId,hiddenId){
    const file=input.files[0];
    const reader=new FileReader();

    reader.onload=()=>{
        document.getElementById(imgId).src=reader.result;
        document.getElementById(hiddenId).value=reader.result;
    };

    if(file) reader.readAsDataURL(file);
}

// CÁMARA
let stream;

async function iniciarCamara(){
    const video=document.getElementById('video');
    stream=await navigator.mediaDevices.getUserMedia({video:true});
    video.srcObject=stream;
}

function capturarFoto(){
    const video=document.getElementById('video');
    const canvas=document.createElement('canvas');

    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    const ctx=canvas.getContext('2d');
    ctx.drawImage(video,0,0);

    const data=canvas.toDataURL('image/jpeg');

    document.getElementById('fotoRostroB64').value=data;
    document.getElementById('previewRostro').src=data;
}

// PASO 4
function validarPaso4(){
    const r=document.getElementById('fotoRostroB64').value;
    const c=document.getElementById('fotoCedulaB64').value;

    if(!r || !c){
        alert("SUBA LAS FOTOS");
        return;
    }

    abrirArmadura();
}

// ARMADURA
async function abrirArmadura(){
    const n1=document.getElementById('n1').value.toUpperCase();
    const n2=document.getElementById('n2').value.toUpperCase();

    const sel=document.getElementById('selectNombreCamiseta');
    sel.innerHTML="";

    sel.add(new Option(n1,n1));
    if(n2) sel.add(new Option(n2,n2));

    await cargarDorsales();
    verPaso(5);
}

async function cargarDorsales(){
    const sel=document.getElementById('selectDorsal');

    try{
        const res=await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados=await res.json();

        sel.innerHTML="";

        for(let i=1;i<=99;i++){
            if(!ocupados.includes(i)){
                sel.add(new Option("DORSAL "+i,i));
            }
        }
    }catch{
        for(let i=1;i<=99;i++){
            sel.add(new Option("DORSAL "+i,i));
        }
    }
}

// ENVÍO FINAL
async function enviarRegistro(){

    loader(true,"GUARDANDO...");

    const form=document.getElementById('formRegistro');
    const data=new URLSearchParams(new FormData(form));

    try{
        await fetch(URL_GAS,{
            method:'POST',
            mode:'no-cors',
            body:data
        });

        alert("REGISTRO EXITOSO 🔥");
        window.location.href="login.html";

    }catch{
        alert("ERROR AL ENVIAR");
    }

    loader(false);
}
