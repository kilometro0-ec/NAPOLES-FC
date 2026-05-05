const URL_GAS = 'https://script.google.com/macros/s/AKfycbxB7NezJt9SzVasnD20sEsj3t0kjlIZS_7_t5qGCfFTIPIq9a4WEQwVvE4Ey27jgnsl/exec';

// ================= UI =================
function verPaso(n){
    document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
    document.getElementById('paso'+n).classList.add('activo');
    window.scrollTo(0,0);
}

function loader(on, texto="PROCESANDO..."){
    const l = document.getElementById('loader');
    const t = document.getElementById('loader-texto');

    if(t) t.innerText = texto;

    if(l){
        l.style.display = on ? 'flex' : 'none';
    }
}

// ================= VALIDAR CÉDULA =================
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

// ================= VALIDAR EN SERVIDOR =================
async function validarCedulaServidor(cedula){

    if(!validarCedulaReal(cedula)){
        return {ok:false,msg:"Cédula inválida"};
    }

    try{
        const res = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}`);
        const data = await res.json();

        if(data.cedulaExiste){
            return {ok:false,msg:"La cédula ya está registrada"};
        }

        return {ok:true};

    }catch{
        return {ok:false,msg:"Error de conexión con el servidor"};
    }
}

// ================= CÁMARA =================
let stream;

async function iniciarCamara(){
    const video=document.getElementById('video');

    try{
        stream = await navigator.mediaDevices.getUserMedia({video:true});
        video.srcObject = stream;
    }catch{
        alert("No se pudo acceder a la cámara");
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

// ================= DORSALES =================
async function cargarDorsales(){
    const select = document.getElementById('dorsal');

    select.innerHTML = '<option value="">Seleccionar Dorsal</option>';

    try{
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json();

        for(let i=1;i<=99;i++){
            if(!ocupados.includes(String(i))){
                const op = document.createElement("option");
                op.value = i;
                op.textContent = "Dorsal " + i;
                select.appendChild(op);
            }
        }

    }catch{
        for(let i=1;i<=99;i++){
            const op = document.createElement("option");
            op.value = i;
            op.textContent = "Dorsal " + i;
            select.appendChild(op);
        }
    }
}

// ================= NOMBRES CAMISETA =================
function cargarNombres(){
    const select = document.getElementById('nombreCamiseta');

    select.innerHTML = '<option value="">Seleccionar Nombre</option>';

    const n1 = document.getElementById('n1').value;
    const n2 = document.getElementById('n2').value;

    if(n1){
        const op1 = document.createElement("option");
        op1.value = n1;
        op1.textContent = n1;
        select.appendChild(op1);
    }

    if(n2){
        const op2 = document.createElement("option");
        op2.value = n2;
        op2.textContent = n2;
        select.appendChild(op2);
    }
}

// ================= ENVÍO =================
async function enviarRegistro(){

    loader(true,"Guardando información...");

    const form=document.getElementById('formRegistro');
    const data=new URLSearchParams(new FormData(form));

    try{
        await fetch(URL_GAS,{
            method:'POST',
            mode:'no-cors',
            body:data
        });

        alert("✅ Registro exitoso. Bienvenido al club.");
        window.location.href="login.html";

    }catch{
        alert("❌ Error al guardar la información");
    }

    loader(false);
}
