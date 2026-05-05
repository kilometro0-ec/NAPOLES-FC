const URL_GAS = "https://script.google.com/macros/s/AKfycbwit_SN-IXxyA4DBnN8iWAZ_g0UExXmMdqCapz2e09eSs8yPrd4T52H2qQGUXGbxkw/exec";

// UI
function verPaso(n){
document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
document.getElementById('paso'+n).classList.add('activo');
}

function loader(on,text){
document.getElementById('loader-texto').innerText=text;
document.getElementById('loader').style.display=on?'flex':'none';
}

// MAYUSCULAS
document.addEventListener("input",e=>{
if(e.target.name && e.target.name!=="correo"){
e.target.value=e.target.value.toUpperCase();
}
});

// VALIDAR
function validarCedulaReal(ced){
if(!/^\d{10}$/.test(ced)) return false;
let t=0;
for(let i=0;i<9;i++){
let n=parseInt(ced[i]);
if(i%2===0){n*=2;if(n>9)n-=9;}
t+=n;
}
return ((10-(t%10))%10)===parseInt(ced[9]);
}

async function validarCedulaServidor(c){
if(!validarCedulaReal(c)) return {ok:false,msg:"Cédula inválida"};

const r=await fetch(`${URL_GAS}?action=validarRegistro&cedula=${c}`);
const d=await r.json();

if(d.cedulaExiste) return {ok:false,msg:"Ya registrado"};

return {ok:true};
}

// CAMARA
let stream;

async function iniciarCamara(){
stream=await navigator.mediaDevices.getUserMedia({video:true});
video.srcObject=stream;
}

function capturarFoto(){
const canvas=document.createElement("canvas");
canvas.width=video.videoWidth;
canvas.height=video.videoHeight;
canvas.getContext("2d").drawImage(video,0,0);
const data=canvas.toDataURL("image/jpeg");

previewCamara.src=data;
fotoRostroB64.value=data;

stream.getTracks().forEach(t=>t.stop());
}

// ARMADURA
async function cargarArmadura(){

nombreCamiseta.innerHTML="";
dorsal.innerHTML="";

nombreCamiseta.add(new Option(n1.value,n1.value));
if(n2.value) nombreCamiseta.add(new Option(n2.value,n2.value));

const r=await fetch(`${URL_GAS}?action=getDorsales`);
const usados=await r.json();

for(let i=1;i<=99;i++){
if(!usados.includes(String(i))){
dorsal.add(new Option("DORSAL "+i,i));
}
}
}

// ENVIAR
async function enviarRegistro(){

const data=new URLSearchParams(new FormData(formRegistro));

await fetch(URL_GAS,{
method:"POST",
mode:"no-cors",
body:data
});

}
