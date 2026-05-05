const URL_GAS = 'https://script.google.com/macros/s/AKfycbxB7NezJt9SzVasnD20sEsj3t0kjlIZS_7_t5qGCfFTIPIq9a4WEQwVvE4Ey27jgnsl/exec';

// CAMBIAR PASOS
function verPaso(n) {
    for (let i = 1; i <= 6; i++) {
        const p = document.getElementById('paso' + i);
        if (p) p.style.display = (i === n) ? 'block' : 'none';
    }
}

// VALIDAR CÉDULA
async function validarCedulaEstricta() {
    const ced = document.getElementById('ced').value;

    if (ced.length !== 10) {
        alert("Cédula inválida");
        return;
    }

    document.getElementById('loader').style.display = 'block';

    try {
        const res = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced}`);
        const data = await res.json();

        if (data.cedulaExiste) {
            alert("Ya registrado");
        } else {
            verPaso(2);
        }

    } catch (e) {
        alert("Error conexión");
    }

    document.getElementById('loader').style.display = 'none';
}

// BASE64
function aBase64(input, idDestino) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        document.getElementById(idDestino).value = reader.result;
    };

    if (file) reader.readAsDataURL(file);
}

// CÁMARA
let stream;

async function iniciarCamara() {
    const video = document.getElementById('video');

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

function capturarFoto() {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const data = canvas.toDataURL('image/jpeg');
    document.getElementById('fotoRostroB64').value = data;

    alert("Foto capturada");
}

// ARMADURA
async function abrirArmadura() {
    const n1 = document.getElementById('n1').value.toUpperCase();
    const n2 = document.getElementById('n2').value.toUpperCase();

    const select = document.getElementById('selectNombreCamiseta');
    select.innerHTML = "";

    select.add(new Option(n1, n1));
    if (n2) select.add(new Option(n2, n2));

    await cargarDorsales();

    verPaso(5);
}

async function cargarDorsales() {
    const select = document.getElementById('selectDorsal');

    try {
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json();

        select.innerHTML = "";

        for (let i = 1; i <= 99; i++) {
            if (!ocupados.includes(i)) {
                select.add(new Option("Dorsal " + i, i));
            }
        }

    } catch {
        for (let i = 1; i <= 99; i++) {
            select.add(new Option("Dorsal " + i, i));
        }
    }
}

// ENVÍO
async function enviarRegistro() {

    const rostro = document.getElementById('fotoRostroB64').value;
    const cedulaF = document.getElementById('fotoCedulaB64').value;

    if (!rostro || !cedulaF) {
        alert("Faltan fotos");
        return;
    }

    document.getElementById('loader').style.display = 'block';

    const form = document.getElementById('formRegistro');
    const data = new URLSearchParams(new FormData(form));

    try {
        await fetch(URL_GAS, {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });

        alert("Registro exitoso");
        location.reload();

    } catch {
        alert("Error al enviar");
    }

    document.getElementById('loader').style.display = 'none';
}
