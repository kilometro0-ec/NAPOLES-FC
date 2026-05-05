const URL_GAS = "https://script.google.com/macros/s/AKfycby5tgeQNUNvL4O8h5zJiX2tYT4Zo_tZ7a9Mc9zOIlfQGNYC7D1uBAHReDeah_OEQRJ5/exec";

// UI
function verPaso(n){
    document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
    document.getElementById('paso'+n).classList.add('activo');
}

function loader(on,text){
    loader_texto.innerText=text;
    loader.style.display = on ? "flex":"none";
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

    return ((10-(total%10))%10)===parseInt(ced[9]);
}

async function validarCedulaServidor(cedula){

    if(!validarCedulaReal(cedula)){
        return {ok:false,msg:"Cédula inválida"};
    }

    try{
        const res = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}`);
        const data = await res.json();

        if(data.cedulaExiste){
            return {ok:false,msg:"Ya registrado"};
        }

        return {ok:true};

    }catch{
        return {ok:false,msg:"Error de conexión"};
    }
}

// ARMADURA
async function cargarArmadura(){

    nombreCamiseta.innerHTML='<option value="">Seleccionar Nombre</option>';
    dorsal.innerHTML='<option value="">Seleccionar Dorsal</option>';

    if(n1.value) nombreCamiseta.add(new Option(n1.value,n1.value));
    if(n2.value) nombreCamiseta.add(new Option(n2.value,n2.value));

    try{
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json();

        for(let i=1;i<=99;i++){
            if(!ocupados.includes(i)){
                dorsal.add(new Option("DORSAL "+i,i));
            }
        }
    }catch{
        for(let i=1;i<=99;i++){
            dorsal.add(new Option("DORSAL "+i,i));
        }
    }
}

// CAMARA
let stream;

async function iniciarCamara(){
    stream = await navigator.mediaDevices.getUserMedia({video:true});
    video.srcObject = stream;
}

function capturarFoto(){
    const canvas=document.createElement('canvas');
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    const ctx=canvas.getContext('2d');
    ctx.drawImage(video,0,0);

    const data=canvas.toDataURL("image/jpeg");

    previewCamara.src=data;
    fotoRostroB64.value=data;

    if(stream) stream.getTracks().forEach(t=>t.stop());
}

// ENVIAR
async function enviarRegistro(){

    loader(true,"Guardando información...");

    const data=new URLSearchParams();

    data.append("cedula",ced.value);
    data.append("nombre1",n1.value);
    data.append("nombre2",n2.value);
    data.append("apellidos",ape.value);
    data.append("fechaNac",fecha.value);
    data.append("telefono",tel.value);
    data.append("correo",correo.value);
    data.append("nombreCamiseta",nombreCamiseta.value);
    data.append("dorsal",dorsal.value);
    data.append("mediasExtras",medias.value);
    data.append("transaccionInscripcion",inscripcion.value);
    data.append("transaccionUniforme",uniforme.value);
    data.append("fotoRostroB64",fotoRostroB64.value);

    try{
        await fetch(URL_GAS,{method:"POST",body:data});
        alert("✅ Registro exitoso");
    }catch{
        alert("❌ Error al guardar");
    }

    loader(false);
}
