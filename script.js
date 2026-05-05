let currentStream;

// Función para cambiar entre los pasos (del 1 al 4)
function verPaso(n) {
    // Si la cámara está prendida, la apagamos para ahorrar batería y memoria
    if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
    }

    // Ocultamos todos los pasos y quitamos los puntos activos
    document.querySelectorAll('.paso-contenido').forEach(p => p.classList.remove('paso-activo'));
    document.querySelectorAll('.punto').forEach((p, index) => {
        p.classList.toggle('activo', index < n);
    });

    // Mostramos solo el paso que toca
    document.getElementById('step' + n).classList.add('paso-activo');

    // Si entra al paso 3 (Rostro) o 4 (Cédula), prendemos la cámara automáticamente
    if(n === 3) iniciarCamara('videoRostro', 'user'); // Cámara frontal
    if(n === 4) iniciarCamara('videoCedula', 'environment'); // Cámara trasera
}

// Función para prender la cámara
async function iniciarCamara(id, modo) {
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: modo } 
        });
        const videoElement = document.getElementById(id);
        videoElement.srcObject = currentStream;
    } catch (e) { 
        alert("¡Chuta! No pudimos acceder a la cámara. Revisa los permisos."); 
        console.error(e);
    }
}

// Función para tomar la foto (Captura el cuadro del video)
function capturar(tipo) {
    const v = document.getElementById('video' + tipo);
    const canvas = document.createElement('canvas');
    
    // Ajustamos el tamaño del canvas al video
    canvas.width = v.videoWidth; 
    canvas.height = v.videoHeight;
    
    // Dibujamos la imagen
    canvas.getContext('2d').drawImage(v, 0, 0);
    
    // Convertimos la imagen a texto (Base64) para poder enviarla a Google Sheets
    const data = canvas.toDataURL('image/jpeg', 0.7);
    
    // Guardamos la foto en el campo oculto y mostramos la vista previa
    document.getElementById('foto' + tipo + 'B64').value = data;
    document.getElementById('prev' + tipo).src = data;
    document.getElementById('prev' + tipo).style.display = 'block';
    
    // Ocultamos el video para que parezca una foto tomada
    v.style.display = 'none';
    document.getElementById('controles' + tipo).style.display = 'none';
    document.getElementById('reintentar' + tipo).style.display = 'flex';
}

// Función por si la foto salió movida y quieren repetir
function reintentar(tipo) {
    document.getElementById('prev' + tipo).style.display = 'none';
    document.getElementById('video' + tipo).style.display = 'block';
    document.getElementById('controles' + tipo).style.display = 'block';
    document.getElementById('reintentar' + tipo).style.display = 'none';
    
    // Volvemos a prender la cámara
    iniciarCamara('video' + tipo, tipo === 'Rostro' ? 'user' : 'environment');
}

// Función para que en el Paso 2 salgan sus nombres en las opciones de la camiseta
function actualizarOpcionesNombre() {
    const n1 = document.getElementById('n1').value;
    const n2 = document.getElementById('n2').value;
    const select = document.getElementById('selectNombreCamiseta');
    
    select.innerHTML = '';
    if(n1) select.add(new Option(n1, n1));
    if(n2) select.add(new Option(n2, n2));
}

// Validación rápida del paso 2 (WhatsApp y Dorsal)
function validarPaso2() {
    const wha = document.getElementById('wha').value;
    const dor = document.getElementById('selectDorsal').value;
    
    if(!wha.startsWith('09') || wha.length !== 10) {
        alert("El WhatsApp debe empezar con 09 y tener 10 números.");
        return;
    }
    if(!dor) {
        alert("Por favor, elije un número de dorsal.");
        return;
    }
    verPaso(3);
}
