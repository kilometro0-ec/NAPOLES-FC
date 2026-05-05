const URL_GAS = "TU_URL_AQUI";

// ================= UI =================
function verPaso(n){
    document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
    document.getElementById('paso'+n).classList.add('activo');
    window.scrollTo(0,0);
}

function loader(on,text="PROCESANDO..."){
    const l=document.getElementById('loader');
    const t=document.getElementById('loader-texto');
    if(t) t.innerText=text;
    l.style.display= on ? 'flex':'none';
}

// ================= MAYUSCULAS =================
document.addEventListener("input", e=>{
    if(e.target.name && e.target.name !== "correo"){
        e.target.value = e.target.value.toUpperCase();
    }
});

// ================= VALIDAR =================
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

async function validarCedulaServidor(cedula){

    if(!validarCedulaReal(cedula)){
        return {ok:false,msg:"Cédula inválida"};
    }

    try{
        const res = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}`);
        const data = await res.json();

        if(data.cedulaExiste){
            return {ok:false,msg:"El jugador ya está registrado"};
        }

        return {ok:true};

    }catch{
        return {ok:false,msg:"Error de conexión"};
    }
}

// ================= CÁMARA =================
let stream;

async function iniciarCamara(){
    const video=document.getElementById('video');

    stream = await navigator.mediaDevices.getUserMedia({video:true});
    video.srcObject = stream;
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

    document.getElementById('previewCamara').style.display="block";
    video.style.display="none";

    if(stream){
        stream.getTracks().forEach(t=>t.stop());
    }
}

// ================= ARMADURA =================
async function cargarArmadura(){

    const selNombre = document.getElementById("nombreCamiseta");
    const selDorsal = document.getElementById("dorsal");

    selNombre.innerHTML = "";
    selDorsal.innerHTML = "";

    const n1 = document.getElementById("n1").value;
    const n2 = document.getElementById("n2").value;

    selNombre.add(new Option(n1,n1));
    if(n2) selNombre.add(new Option(n2,n2));

    const res = await fetch(`${URL_GAS}?action=getDorsales`);
    const usados = await res.json();

    for(let i=1;i<=99;i++){
        if(!usados.includes(String(i))){
            selDorsal.add(new Option("DORSAL "+i,i));
        }
    }
}

// ================= ENVÍO =================
async function enviarRegistro(){

    loader(true,"Guardando información...");

    const form=document.getElementById('formRegistro');
    const data=new URLSearchParams(new FormData(form));

    await fetch(URL_GAS,{
        method:'POST',
        mode:'no-cors',
        body:data
    });

    loader(false);

    alert("✅ Registro exitoso");
}
