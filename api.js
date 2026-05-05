const URL_GAS = 'https://script.google.com/macros/s/AKfycbxNY8xRUKBfx7zOW6Na1hG1p6tXvKOhR08W9oVlsEzDahP7OdSXLvjV1AkzLl6mqLK6/exec';

// Paso 1: Validar Cédula
async function validarPaso1() {
    const ced = document.getElementById('ced').value;
    if (ced.length !== 10) { alert("La cédula debe tener 10 dígitos."); return; }

    document.getElementById('loader').style.display = 'flex';
    try {
        const resp = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced}`);
        const data = await resp.json();
        if (data.cedulaExiste) {
            alert("Esta cédula ya está registrada en el club.");
        } else {
            verPaso(2);
        }
    } catch (e) {
        console.warn("Error de red, permitiendo registro manual.");
        verPaso(2);
    } finally {
        document.getElementById('loader').style.display = 'none';
    }
}

// Preparar Paso 5: Armadura
async function abrirArmadura() {
    const n1 = document.getElementById('n1').value.trim().toUpperCase();
    const n2 = document.getElementById('n2').value.trim().toUpperCase();
    const selectNom = document.getElementById('selectNombreCamiseta');

    if (!n1) { alert("Faltan datos del paso 2"); verPaso(2); return; }

    selectNom.innerHTML = "";
    selectNom.add(new Option(n1, n1));
    if (n2) selectNom.add(new Option(n2, n2));

    verPaso(5);
    await cargarDorsales();
}

// Cargar números desde Google Sheets
async function cargarDorsales() {
    const selectD = document.getElementById('selectDorsal');
    try {
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json();
        selectD.innerHTML = '<option value="">-- Elige un dorsal --</option>';
        for (let i = 1; i <= 99; i++) {
            if (!ocupados.map(String).includes(String(i))) {
                selectD.add(new Option(`Dorsal ${i}`, i));
            }
        }
    } catch (e) {
        for (let i = 1; i <= 99; i++) selectD.add(new Option(`Dorsal ${i}`, i));
    }
}

function aBase64(input, idDestino) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => document.getElementById(idDestino).value = reader.result;
        reader.readAsDataURL(file);
    }
}

// Guardar todo en el Excel
async function enviarRegistro() {
    const rostro = document.getElementById('fotoRostroB64').value;
    const cedulaF = document.getElementById('fotoCedulaB64').value;

    if (!rostro || !cedulaF) { alert("Debes subir las fotos obligatoriamente."); return; }

    document.getElementById('final-animacion').style.display = 'flex';
    const form = document.getElementById('formRegistro');
    const formData = new URLSearchParams(new FormData(form));

    try {
        await fetch(URL_GAS, { method: 'POST', mode: 'no-cors', body: formData.toString() });
        document.getElementById('final-status').innerText = "¡REGISTRO EXITOSO!";
        setTimeout(() => location.href = "index.html", 3500);
    } catch (e) {
        alert("Error al guardar. Verifica tu conexión.");
        document.getElementById('final-animacion').style.display = 'none';
    }
}
