/**
 * api.js - Refactored Form Submission & Error Handling
 * bY Corporación 360 | Nápoles F.C. 2026
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLctY39LIa_aVSFKCIQl306huhIk6CiZzrUC2PczfeVlTJ9-V9Vt9giq1A2mYveAHW/exec";

document.getElementById('formularioRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    
    // 1. Obtención de valores y validaciones básicas
    const cedula = document.getElementById('cedula').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const fotoRostro = document.getElementById('fotoPreview').src;
    const fotoCedulaFile = document.getElementById('fotoCedula').files[0];

    // Validación de longitud y formato
    if (cedula.length !== 10 || !/^\d{10}$/.test(cedula)) {
        alert("ERROR: La cédula debe tener exactamente 10 dígitos numéricos.");
        return;
    }

    if (telefono.length !== 10 || !/^09\d{8}$/.test(telefono)) {
        alert("ERROR: El teléfono debe tener 10 dígitos y empezar con 09.");
        return;
    }

    if (!fotoRostro || fotoRostro.includes('display: none')) {
        alert("ERROR: Debe capturar su foto de rostro con la cámara.");
        return;
    }

    // 2. Preparación de Interfaz para el envío
    btn.innerText = "ENVIANDO DATOS...";
    btn.disabled = true;

    try {
        // 3. Procesamiento de archivos a Base64
        let fotoCedulaBase64 = "";
        if (fotoCedulaFile) {
            fotoCedulaBase64 = await toBase64(fotoCedulaFile);
        }

        // 4. Construcción del objeto de datos (Normalización)
        const payload = {
            nombre1: document.getElementById('nombre1').value.trim().toUpperCase(),
            nombre2: document.getElementById('nombre2').value.trim().toUpperCase(),
            apellidos: document.getElementById('apellidos').value.trim().toUpperCase(),
            cedula: cedula,
            fechaNac: document.getElementById('fechaNac').value,
            telefono: telefono,
            correo: document.getElementById('correo').value.trim().toLowerCase(),
            urlFotoRostro: fotoRostro,
            urlFotoCedula: fotoCedulaBase64
        };

        // 5. Envío mediante XMLHttpRequest (Evita problemas de redirección CORS en Google)
        sendToGoogle(payload, btn, form);

    } catch (error) {
        handleSubmissionError(error, btn);
    }
});

/**
 * Gestiona el envío de datos y la respuesta del servidor
 */
function sendToGoogle(datos, button, formElement) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", SCRIPT_URL, true);
    xhr.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) { // status 0 es común en redirecciones exitosas de Apps Script
                alert("¡REGISTRO EXITOSO!\nSus datos serán validados por la administración de NÁPOLES F.C.\nUsted será contactado en Quito - Ecuador.");
                formElement.reset();
                window.location.reload();
            } else {
                handleSubmissionError("Error en el servidor: " + xhr.status, button);
            }
        }
    };

    xhr.onerror = function() {
        handleSubmissionError("Error de conexión. Verifique su internet.", button);
    };

    xhr.send(JSON.stringify(datos));
}

/**
 * Manejo centralizado de errores
 */
function handleSubmissionError(msg, button) {
    console.error("Submission Error:", msg);
    alert("No se pudo completar el registro.\nDetalle: " + msg);
    button.disabled = false;
    button.innerText = "FINALIZAR INSCRIPCIÓN";
}

/**
 * Helper: Convierte archivos a Base64
 */
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
