// Sustituye con la URL que copiaste en el paso anterior
const URL_GAS = 'https://script.google.com/macros/s/AKfycbxNY8xRUKBfx7zOW6Na1hG1p6tXvKOhR08W9oVlsEzDahP7OdSXLvjV1AkzLl6mqLK6/exec';

async function validarPaso1() {
    const cedula = document.getElementById('ced').value;
    const transaccion = document.getElementById('trans').value;

    if (cedula.length !== 10 || !transaccion) {
        alert("Pilas: La cédula debe tener 10 dígitos y el número de transacción es obligatorio.");
        return;
    }

    document.getElementById('loader').style.display = 'flex';

    try {
        // Añadimos un tiempo límite (timeout) de 8 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}&transaccion=${transaccion}`, {
            signal: controller.signal
        });

        const data = await response.json();

        if (data.cedulaExiste) {
            alert("¡Atención! Esta cédula ya está registrada.");
            document.getElementById('loader').style.display = 'none';
        } else if (data.transaccionExiste) {
            alert("¡Atención! Este número de transacción ya fue usado.");
            document.getElementById('loader').style.display = 'none';
        } else {
            // ÉXITO TOTAL
            document.getElementById('loader').style.display = 'none';
            await cargarDorsales();
            verPaso(2);
        }

    } catch (error) {
        console.warn("Error de validación (posible CORS o Timeout):", error);
        
        // --- ESTA ES LA CLAVE ---
        // Si hay error de red o CORS, permitimos pasar al paso 2 
        // para que el jugador no abandone el registro.
        document.getElementById('loader').style.display = 'none';
        
        // Opcional: puedes avisar al usuario
        console.log("Validación omitida por red, permitiendo paso manual.");
        
        await cargarDorsales();
        verPaso(2);
    }
}
