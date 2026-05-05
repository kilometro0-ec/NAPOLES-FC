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

// MAYÚSCULAS
document.addEventListener("input", e=>{
    if(e.target.name && e.target.name !== "correo"){
        e.target.value = e.target.value.toUpperCase();
    }
});

// VALIDACIÓN CÉDULA
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

// TEL + CORREO
function validarPaso3(){
    const tel=document.querySelector('[name=telefono]').value;
    const correo=document.querySelector('[name=correo]').value;

    if(!/^09\d{8}$/.test(tel)) return alert("TELÉFONO INVÁLIDO");
    if(!/^\S+@\S+\.\S+$/.test(correo)) return alert("CORREO INVÁLIDO");

    verPaso(4);
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

    canvas.getContext('2d').drawImage(video,0,0);

    const data=canvas.toDataURL('image/jpeg');

    document.getElementById('fotoRostroB64').value=data;
    document.getElementById('previewRostro').src=data;

    // 🔴 cerrar cámara
    if(stream){
        stream.getTracks().forEach(t=>t.stop());
    }
}

// ENVÍO
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

        alert("REGISTRO EXITOSO");
        location.href="login.html";

    }catch{
        alert("ERROR AL ENVIAR");
    }

    loader(false);
}
