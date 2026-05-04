// Configuración de la URL de tu Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcrbN7OEBeZmUcB7zbdZWPU4wa4R1-AAT3gAHkqjo7jYbAumXvjI1ZxPOp1FD2viwq/exec";

// Función para convertir archivos (fotos) a formato Base64 para enviarlos al Excel
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Función Principal para Registrar Jugador
async function registrarJugador(evento) {
    evento.preventDefault();
    
    const btn = evento.target.querySelector('button[type="submit"]');
    const textoOriginal = btn.innerText;
    
    btn.innerText = "ENVIANDO DATOS...";
    btn.disabled = true;

    try {
        // Capturar los archivos de imagen
        const fotoRostroFile = document.getElementById('fotoRostro').files[0];
        const fotoCedulaFile = document.getElementById('fotoCedula').files[0];

        let fotoRostroBase64 = "";
        let fotoCedulaBase64 = "";

        if (fotoRostroFile) fotoRostroBase64 = await toBase64(fotoRostroFile);
        if (fotoCedulaFile) fotoCedulaBase64 = await toBase64(fotoCedulaFile);

        // Crear el objeto con todos los datos del formulario
        const datos = {
            nombre1: document.getElementById('nombre1').value,
            nombre2: document.getElementById('nombre2').value,
            apellidos: document.getElementById('apellidos').value,
            cedula: document.getElementById('cedula').value,
            fechaNac: document.getElementById('fechaNac').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value,
            urlFotoRostro: fotoRostroBase64,
            urlFotoCedula: fotoCedulaBase64
        };

        // Enviar a Google Sheets
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        alert("¡Inscripción exitosa! El Nápoles FC te notificará pronto.");
        evento.target.reset();
        if(typeof irAPaso === 'function') irAPaso(1); // Regresa al inicio si existe la función

    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Error al enviar. Inténtalo de nuevo.");
    } finally {
        btn.innerText = textoOriginal;
        btn.disabled = false;
    }
}

// Escuchar el evento de envío del formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formularioRegistro');
    if (form) {
        form.addEventListener('submit', registrarJugador);
    }
});
