/**
 * api.js - Conexión Nápoles F.C. & Google Sheets
 * bY Corporación 360 | Quito - Ecuador
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLctY39LIa_aVSFKCIQl306huhIk6CiZzrUC2PczfeVlTJ9-V9Vt9giq1A2mYveAHW/exec";

document.getElementById('formularioRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const cedula = document.getElementById('cedula').value;
    const telefono = document.getElementById('telefono').value;

    if (cedula.length !== 10 || telefono.length !== 10) {
        alert("ERROR: La cédula y el teléfono deben tener exactamente 10 dígitos.");
        return;
    }

    btn.innerText = "ENVIANDO A NÁPOLES F.C...";
    btn.disabled = true;

    try {
        const fotoRostroBase64 = document.getElementById('fotoPreview').src || "";
        const fotoCedulaFile = document.getElementById('fotoCedula').files[0];
        
        let fotoCedulaBase64 = "";
        if (fotoCedulaFile) {
            fotoCedulaBase64 = await toBase64(fotoCedulaFile);
        }

        const datos = {
            nombre1: document.getElementById('nombre1').value.toUpperCase(),
            nombre2: document.getElementById('nombre2').value.toUpperCase(),
            apellidos: document.getElementById('apellidos').value.toUpperCase(),
            cedula: cedula,
            fechaNac: document.getElementById('fechaNac').value,
            telefono: telefono,
            correo: document.getElementById('correo').value.toLowerCase(),
            urlFotoRostro: fotoRostroBase64,
            urlFotoCedula: fotoCedulaBase64
        };

        // Usamos XMLHttpRequest para máxima compatibilidad con Google Apps Script
        const xhr = new XMLHttpRequest();
        xhr.open("POST", SCRIPT_URL, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                alert("¡REGISTRO COMPLETADO!\nSus datos serán validados y un administrador de NÁPOLES F.C. se comunicará con usted.");
                e.target.reset();
                location.reload(); 
            }
        };

        xhr.send(JSON.stringify(datos));

    } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar el registro.");
        btn.disabled = false;
        btn.innerText = "FINALIZAR INSCRIPCIÓN";
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
