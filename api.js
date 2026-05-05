// SUSTITUYE ESTA URL por la de tu implementación de Google Apps Script
const URL_GAS = 'https://script.google.com/macros/s/AKfycbxNY8xRUKBfx7zOW6Na1hG1p6tXvKOhR08W9oVlsEzDahP7OdSXLvjV1AkzLl6mqLK6/exec';

// 1. FUNCIÓN QUE FALLABA (Validar Paso 1)
async function validarPaso1() {
    const cedula = document.getElementById('ced').value;
    const transaccion = document.getElementById('trans').value;

    if (cedula.length !== 10 || !transaccion) {
        alert("Pilas: La cédula debe tener 10 dígitos y el número de transacción es obligatorio.");
        return;
    }

    document.getElementById('loader').style.display = 'flex';

    try {
        const response = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}&transaccion=${transaccion}`);
        const data = await response.json();

        if (data.cedulaExiste) {
            alert("¡Atención! Esta cédula ya está registrada.");
            document.getElementById('loader').style.display = 'none';
        } else if (data.transaccionExiste) {
            alert("¡Atención! Este número de transacción ya fue usado.");
            document.getElementById('loader').style.display = 'none';
        } else {
            document.getElementById('loader').style.display = 'none';
            await cargarDorsales(); // Esta es la que causaba el error
            verPaso(2);
        }
    } catch (error) {
        console.warn("Validación omitida por red, permitiendo paso manual.");
        document.getElementById('loader').style.display = 'none';
        // Si falla la red, intentamos cargar dorsales y pasar de todos modos
        try { await cargarDorsales(); } catch(e) { console.log("No se pudo conectar para dorsales"); }
        verPaso(2);
    }
}

// 2. LA FUNCIÓN QUE FALTABA: cargarDorsales
async function cargarDorsales() {
    const selectDorsal = document.getElementById('selectDorsal');
    if (!selectDorsal) return; // Si no existe el elemento en el HTML, salir

    try {
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json(); // Lista de números que ya están en el Excel
        
        selectDorsal.innerHTML = '<option value="">-- Elige un número --</option>';
        
        for (let i = 1; i <= 99; i++) {
            // Si el número 'i' no está en la lista de ocupados, lo agregamos al menú
            if (!ocupados.map(String).includes(String(i))) {
                let opt = document.createElement('option');
                opt.value = i;
                opt.text = `Dorsal ${i}`;
                selectDorsal.add(opt);
            }
        }
    } catch (e) {
        console.error("Error al cargar dorsales:", e);
        // Si falla la conexión, llenamos el select con números básicos para que no se trabe
        selectDorsal.innerHTML = '<option value="">-- Elige un número --</option>';
        for (let i = 1; i <= 99; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.text = `Dorsal ${i}`;
            selectDorsal.add(opt);
        }
    }
}

// 3. FUNCIÓN PARA PROCESAR NOMBRES (Paso 2 -> 3)
function procesarNombres() {
    const n1 = document.getElementById('n1').value.trim().toUpperCase();
    const n2 = document.getElementById('n2').value.trim().toUpperCase();
    const ape = document.getElementById('ape').value.trim().toUpperCase();
    const select = document.getElementById('selectNombreCamiseta');

    if (!n1 || !ape) {
        alert("Primer nombre y apellidos son obligatorios.");
        return;
    }

    select.innerHTML = ""; // Limpiar
    
    // Opción 1: Primer Nombre
    select.add(new Option(n1, n1));

    // Opción 2: Segundo Nombre (si existe)
    if (n2) {
        select.add(new Option(n2, n2));
    }

    verPaso(3);
}

// 4. CONVERTIR FOTOS A BASE64
function aBase64(input, idDestino) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            document.getElementById(idDestino).value = reader.result;
        }
        reader.readAsDataURL(file);
    }
}

// 5. ENVÍO FINAL (Paso 4)
async function enviarRegistro() {
    const rostro = document.getElementById('fotoRostroB64').value;
    const cedulaF = document.getElementById('fotoCedulaB64').value;

    if (!rostro || !cedulaF) {
        alert("Es obligatorio subir ambas fotos.");
        return;
    }

    document.getElementById('final-animacion').style.display = 'flex';
    
    const form = document.getElementById('formRegistro');
    const formData = new URLSearchParams(new FormData(form));

    try {
        await fetch(URL_GAS, {
            method: 'POST',
            mode: 'no-cors',
            body: formData.toString()
        });

        document.getElementById('final-status').innerText = "¡EXITOSO!";
        document.getElementById('final-mensaje').innerText = "Bienvenido a Nápoles F.C.";
        
        setTimeout(() => {
            location.reload();
        }, 3500);

    } catch (error) {
        alert("Error al enviar el formulario.");
        document.getElementById('final-animacion').style.display = 'none';
    }
}
