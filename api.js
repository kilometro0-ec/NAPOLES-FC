const URL_GOOGLE = 'https://script.google.com/macros/s/AKfycbyC0ZftX6QL6_5DVCGfdWj9OPw8kDOE9W6w_4xbGhzcSAHrPxaTOgWh6JDUj6hRPD-7/exec';

// 1. CARGAR DORSALES (Esto se queda igual)
async function obtenerDorsalesLibres() {
    const select = document.getElementById('selectDorsal');
    if (!select) return;
    try {
        const respuesta = await fetch(`${URL_GOOGLE}?action=getDorsales`);
        const ocupados = await respuesta.json(); 
        select.innerHTML = '<option value="">SELECCIONA UN NÚMERO</option>';
        for (let i = 1; i <= 99; i++) {
            if (!ocupados.map(String).includes(String(i))) {
                select.add(new Option(`DORSAL ${i}`, i));
            }
        }
    } catch (e) { console.error("Error dorsales:", e); }
}

// 2. FUNCIÓN DE ENVÍO (CORREGIDA PARA TU SCRIPT ACTUAL)
async function enviarADatabase() {
    const form = document.getElementById('formRegistro');
    
    // IMPORTANTE: Tu script espera e.parameter, por eso usamos URLSearchParams
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        // Mantenemos fotos y correo igual, el resto a MAYÚSCULAS
        if (key.includes('foto') || key === 'correo') {
            params.append(key, value);
        } else {
            params.append(key, typeof value === 'string' ? value.toUpperCase() : value);
        }
    }

    try {
        // Mostramos el balón de carga
        document.getElementById('final-animacion').style.display = 'flex';

        await fetch(URL_GOOGLE, {
            method: 'POST',
            mode: 'no-cors', // Necesario para evitar bloqueos
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString() // Convertimos los datos al formato que e.parameter entiende
        });

        // Espera de 3 segundos porque las fotos son pesadas y Google tarda en procesar
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        // Si todo va bien, avisamos
        alert("¡REGISTRO ENVIADO CON ÉXITO!");
        window.location.reload(); 
        return true;

    } catch (e) {
        console.error("Error en envío:", e);
        alert("ERROR DE CONEXIÓN");
        document.getElementById('final-animacion').style.display = 'none';
        return false;
    }
}

document.addEventListener('DOMContentLoaded', obtenerDorsalesLibres);
