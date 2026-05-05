const URL_GAS = 'https://script.google.com/macros/s/AKfycbxB7NezJt9SzVasnD20sEsj3t0kjlIZS_7_t5qGCfFTIPIq9a4WEQwVvE4Ey27jgnsl/exec';

// UI
function verPaso(n){
document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
document.getElementById('paso'+n).classList.add('activo');
window.scrollTo(0,0);
}

function loader(on,text){
const l=document.getElementById('loader');
document.getElementById('loader-texto').innerText=text;
l.style.display=on?'flex':'none';
}

// validar cédula
function validarCedulaReal(ced){
if(!/^\d{10}$/.test(ced)) return false;
let total=0;
for(let i=0;i<9;i++){
let num=parseInt(ced[i]);
if(i%2===0){num*=2;if(num>9) num-=9;}
total+=num;
}
let dec=(10-(total%10))%10;
return dec===parseInt(ced[9]);
}

async function validarCedulaServidor(cedula){
if(!validarCedulaReal(cedula)){
return {ok:false,msg:"Cédula inválida"};
}
try{
const res=await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}`);
const data=await res.json();
if(data.cedulaExiste){
return {ok:false,msg:"Ya registrado"};
}
return {ok:true};
}catch{
return {ok:false,msg:"Error conexión"};
}
}

// cámara
let stream;

async function iniciarCamara(){
const video=document.getElementById('video');
try{
stream=await navigator.mediaDevices.getUserMedia({video:true});
video.srcObject=stream;
}catch{
alert("Error cámara");
}
}

function capturarFoto(){
const video=document.getElementById('video');
const canvas=document.createElement('canvas');

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

const ctx=canvas.getContext('2d');
ctx.drawImage(video,0,0);

const data=canvas.toDataURL('image/jpeg');

document.getElementById('previewCamara').src=data;
document.getElementById('fotoRostroB64').value=data;

if(stream){
stream.getTracks().forEach(t=>t.stop());
}
}

// enviar
async function enviarRegistro(){
const form=document.getElementById('formRegistro');
const data=new URLSearchParams(new FormData(form));

await fetch(URL_GAS,{
method:'POST',
mode:'no-cors',
body:data
});
}
