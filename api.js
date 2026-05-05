const URL_GAS = 'https://script.google.com/macros/s/AKfycbxB7NezJt9SzVasnD20sEsj3t0kjlIZS_7_t5qGCfFTIPIq9a4WEQwVvE4Ey27jgnsl/exec';


// --- PASO 1: VALIDACIÓN ---
async function validarCedulaEstricta() {
    const ced = document.getElementById('ced').value;
    if (ced.length !== 10) { alert("La cédula debe tener 10 dígitos."); return; }

    document.getElementById('loader').style.display = 'flex';
    try {
        const resp = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced}`);
        const data = await resp.json();
        
        if (data.cedulaExiste) {
            alert("¡ERROR! Esta cédula ya está registrada.");
            document.getElementById('loader').style.display = 'none';
        } else {
            document.getElementById('loader').style.display = 'none';
            verPaso(2);
        }
    } catch (e) {
        alert("Error de conexión. Reintente.");
        document.getElementById('loader').style.display = 'none';
    }
}

// --- PASO 4: PROCESAR FOTOS ---
function aBase64(input, idDestino) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById(idDestino).value = reader.result;
            console.log("Foto procesada: " + idDestino);
        };
        reader.readAsDataURL(file);
    }
}

// --- PASO 5: ARMADURA ---
async function abrirArmadura() {
    const n1 = document.getElementById('n1').value.trim().toUpperCase();
    const n2 = document.getElementById('n2').value.trim().toUpperCase();
    const selectNom = document.getElementById('selectNombreCamiseta');

    if (!n1) { alert("Por favor complete sus nombres primero."); verPaso(2); return; }

    selectNom.innerHTML = "";
    selectNom.add(new Option(n1, n1));
    if (n2) selectNom.add(new Option(n2, n2));

    verPaso(5);
    await cargarDorsales(); // Llamada a la función que faltaba
}

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
        // En caso de error, cargar todos por defecto para no bloquear al usuario
        for (let i = 1; i <= 99; i++) selectD.add(new Option(`Dorsal ${i}`, i));
    }
}

// --- PASO 6: ENVÍO FINAL ---
async function enviarRegistro() {
    const rostro = document.getElementById('fotoRostroB64').value;
    const cedulaF = document.getElementById('fotoCedulaB64').value;
    const medias = document.getElementById('mediasExtras').value;

    if (!rostro || !cedulaF) { alert("Las fotos son obligatorias."); return; }
    if (!medias) { alert("Seleccione si desea medias extras."); return; }

    document.getElementById('loader').style.display = 'flex';
    document.getElementById('loader-texto').innerText = "GUARDANDO REGISTRO...";

    const form = document.getElementById('formRegistro');
    const formData = new URLSearchParams(new FormData(form));

    try {
        await fetch(URL_GAS, { method: 'POST', mode: 'no-cors', body: formData.toString() });
        alert("¡REGISTRO EXITOSO! Bienvenido a Nápoles F.C.");
        location.reload();
    } catch (e) {
        alert("Error al guardar. Revisa tu internet.");
        document.getElementById('loader').style.display = 'none';
    }
}

// Auxiliar para cambiar de vista
function verPaso(n) {
    for(let i=1; i<=6; i++) {
        const p = document.getElementById('paso'+i);
        if(p) p.style.display = (i === n) ? 'block' : 'none';
    }
    window.scrollTo(0,0);
}
