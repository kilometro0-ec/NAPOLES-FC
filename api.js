const URL_GAS = 'https://script.google.com/macros/s/AKfycbxB7NezJt9SzVasnD20sEsj3t0kjlIZS_7_t5qGCfFTIPIq9a4WEQwVvE4Ey27jgnsl/exec';



// UI
function verPaso(n){
    document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
    document.getElementById('paso'+n).classList.add('activo');
    window.scrollTo(0,0);
}

function loader(on,text="Cargando..."){
    const l=document.getElementById('loader');
    document.getElementById('loader-texto').innerText=text;
    l.style.display= on ? 'flex':'none';
}

// VALIDACIÓN CÉDULA ECUADOR
function validarCedulaReal(ced){
    if(ced.length!==10) return false;
    let total=0;
    for(let i=0;i<9;i++){
        let num=parseInt(ced[i]);
        if(i%2===0){ num*=2; if(num>9) num-=9; }
        total+=num;
    }
    let dec= (10-(total%10))%10;
    return dec===parseInt(ced[9]);
}

// VALIDAR
async function validarCedulaEstricta(){
    const ced=document.getElementById('ced').value;

    if(!validarCedulaReal(ced)){
        alert("Cédula inválida Ecuador");
        return;
    }

    loader(true,"Validando...");

    try{
        const res=await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced}`);
        const data=await res.json();

        if(data.cedulaExiste){
            alert("Ya registrado");
        }else{
            verPaso(2);
        }

    }catch{
        alert("Error conexión");
    }

    loader(false);
}

// FILE PREVIEW
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
                sel.add(new Option("Dorsal "+i,i));
            }
        }
    }catch{
        for(let i=1;i<=99;i++){
            sel.add(new Option("Dorsal "+i,i));
        }
    }
}

// ENVÍO
async function enviarRegistro(){

    const rostro=document.getElementById('fotoRostroB64').value;
    const cedulaF=document.getElementById('fotoCedulaB64').value;

    if(!rostro || !cedulaF){
        alert("Faltan fotos");
        return;
    }

    loader(true,"Guardando...");

    const form=document.getElementById('formRegistro');
    const data=new URLSearchParams(new FormData(form));

    try{
        await fetch(URL_GAS,{
            method:'POST',
            mode:'no-cors',
            body:data
        });

        alert("Registro exitoso 🔥");
        location.reload();

    }catch{
        alert("Error al enviar");
    }

    loader(false);
}
