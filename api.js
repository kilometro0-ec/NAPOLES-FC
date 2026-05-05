const URL_GAS = 'https://script.google.com/macros/s/AKfycbxRZxFuo1g6c3oLN7zK5Ay4cJ4TgplSqvV4U4RPk2fLpw6wlBWmG69lOETJuO0G4HJb/exec';
// VALIDACIÓN ESTRICTA: No deja pasar si el servidor dice que existe
async function validarCedulaEstricta() {
    const ced = document.getElementById('ced').value;
    if (ced.length !== 10) { alert("Cédula inválida."); return; }

    document.getElementById('loader').style.display = 'flex';
    try {
        const resp = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced}`);
        const data = await resp.json();
        
        if (data.cedulaExiste) {
            alert("ERROR: Este jugador ya está registrado en el sistema.");
            document.getElementById('loader').style.display = 'none';
        } else {
            document.getElementById('loader').style.display = 'none';
            verPaso(2);
            iniciarCamara(); // Iniciar cámara para el paso 4 preventivamente
        }
    } catch (e) {
        alert("Error de conexión. Intente de nuevo.");
        document.getElementById('loader').style.display = 'none';
    }
}

// MANEJO DE CÁMARA FRONTAL
let stream;
async function iniciarCamara() {
    const video = document.getElementById('video');
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        document.getElementById('contenedor-camara').style.display = 'block';
    } catch (err) {
        alert("No se pudo acceder a la cámara frontal.");
    }
}

function capturarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const data = canvas.toDataURL('image/jpeg');
    document.getElementById('fotoRostroB64').value = data;
    alert("Foto capturada con éxito.");
    document.getElementById('btn-sig-fotos').style.display = 'block';
    // Detener cámara para ahorrar batería
    if (stream) stream.getTracks().forEach(track => track.stop());
}

async function abrirArmadura() {
    const n1 = document.getElementById('n1').value.toUpperCase();
    const n2 = document.getElementById('n2').value.toUpperCase();
    const selectNom = document.getElementById('selectNombreCamiseta');
    selectNom.innerHTML = "";
    selectNom.add(new Option(n1, n1));
    if(n2) selectNom.add(new Option(n2, n2));
    
    verPaso(5);
    await cargarDorsales();
}

// Función auxiliar para pasos
function verPaso(n) {
    for(let i=1; i<=6; i++) {
        const p = document.getElementById('paso'+i);
        if(p) p.style.display = (i === n) ? 'block' : 'none';
    }
    window.scrollTo(0,0);
}

// El resto de funciones (cargarDorsales, enviarRegistro, etc.) se mantienen igual...
