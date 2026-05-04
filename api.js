/**
 * bY Corporación 360 - API Centralizada Nápoles F.C.
 * Versión: 2026.05
 * Este archivo centraliza la conexión con Google Sheets para toda la App.
 */

// CENTRALIZACIÓN DE URL: Cambia este link solo aquí y afectará a todo el proyecto.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNUveQGffBRRzXUhb17sBgiTAraNlk55k6t3OVY2Bxx9eVKs_sortrooaLGymRn136/exec";

// ==========================================
// 1. LÓGICA DE REGISTRO (FORMULARIO INDEX)
// ==========================================
const formRegistro = document.getElementById('formularioRegistro');

if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Elementos visuales de carga (opcionales según tu HTML)
        const btn = e.target.querySelector('button[type="submit"]');
        const loader = document.getElementById('loader');
        
        if (btn) {
            btn.innerText = "ENVIANDO...";
            btn.disabled = true;
        }
        if (loader) loader.style.display = 'flex';

        try {
            // Conversión de Foto de Cédula (Archivo)
            const fotoCedulaFile = document.getElementById('fotoCedula').files[0];
            const fotoCedulaBase64 = fotoCedulaFile ? await toBase64(fotoCedulaFile) : "";

            // Captura de Foto de Rostro (Base64 desde el preview de la cámara)
            const fotoRostroBase64 = document.getElementById('fotoPreview').src;

            const payload = {
                nombre1: document.getElementById('nombre1').value.trim().toUpperCase(),
                nombre2: document.getElementById('nombre2').value.trim().toUpperCase(),
                apellidos: document.getElementById('apellidos').value.trim().toUpperCase(),
                cedula: document.getElementById('cedula').value.trim(),
                fechaNac: document.getElementById('fechaNac').value,
                telefono: document.getElementById('telefono').value.trim(),
                correo: document.getElementById('correo').value.trim().toLowerCase(),
                urlFotoRostro: fotoRostroBase64,
                urlFotoCedula: fotoCedulaBase64
            };

            // Envío por POST a Google Apps Script
            const xhr = new XMLHttpRequest();
            xhr.open("POST", SCRIPT_URL, true);
            xhr.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (loader) loader.style.display = 'none';
                    if (xhr.status === 200) {
                        alert("¡REGISTRO EXITOSO! Nápoles FC le da la bienvenida.");
                        window.location.href = "login.html"; // Redirige al login tras éxito
                    } else {
                        alert("Error en el servidor. Intente de nuevo.");
                        if (btn) {
                            btn.disabled = false;
                            btn.innerText = "FINALIZAR INSCRIPCIÓN";
                        }
                    }
                }
            };
            xhr.send(JSON.stringify(payload));

        } catch (error) {
            if (loader) loader.style.display = 'none';
            alert("Error: " + error);
            if (btn) {
                btn.disabled = false;
                btn.innerText = "FINALIZAR INSCRIPCIÓN";
            }
        }
    });
}

// ==========================================
// 2. UTILIDADES GLOBALES (DISPONIBLES EN TODA LA APP)
// ==========================================

/**
 * Convierte un archivo File a una cadena Base64
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

/**
 * Función genérica para consultar datos (GET)
 * Se puede usar para Login, Noticias, etc.
 */
async function consultarDatos(parametros) {
    const url = `${SCRIPT_URL}?${parametros}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error en consulta API:", error);
        return { success: false, error: error };
    }
}
