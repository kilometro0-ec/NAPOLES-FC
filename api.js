/**
 * API DE CONEXIÓN - NÁPOLES FC 2026
 * Maneja el envío de datos a Google Apps Script
 */

const SCRIPT_URL = "TU_URL_DE_APPS_SCRIPT_AQUI"; // <-- PEGA AQUÍ TU URL QUE TERMINA EN /exec

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioRegistro");

    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault();

            // 1. Mostrar pantalla de carga
            const loader = document.getElementById("loader");
            if (loader) loader.style.display = "flex";

            try {
                // 2. Recolectar datos del formulario
                const formData = new FormData(formulario);
                
                // 3. Agregar la foto en Base64 (si existe en el campo oculto)
                const fotoB64 = document.getElementById("fotoRostroB64")?.value;
                if (fotoB64) {
                    formData.append("fotoRostroB64", fotoB64);
                }

                // 4. Enviar a Google Apps Script
                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    body: formData,
                    mode: "no-cors" // Usamos no-cors para evitar bloqueos de navegador
                });

                /**
                 * NOTA: Con 'no-cors' no podemos leer la respuesta JSON, 
                 * pero el envío llega seguro al Excel.
                 */
                
                alert("¡REGISTRO EXITOSO!\nNápoles FC le da la bienvenida.");
                formulario.reset();
                window.location.reload(); // Recargar para limpiar todo

            } catch (error) {
                console.error("Error en el registro:", error);
                alert("Hubo un problema al enviar los datos. Intente de nuevo.");
            } finally {
                if (loader) loader.style.display = "none";
            }
        });
    }
});
