const URL_GOOGLE = 'https://script.google.com/macros/s/AKfycbylwN3KaHZB4YWtYDvEPxdpAdciIWWGPCzQMHi8eDLmpI8znCPjYlfnmEFtK9T93FYJ/exec';

// 1. VALIDACIÓN PASO 1 (Cédula y Transacción)
async function validarDatosIniciales() {
    const ced = document.getElementById('ced').value;
    const trans = document.getElementById('trans').value;

    if (ced.length !== 10 || !trans) {
        alert("Pilas: La cédula debe tener 10 dígitos y debes poner el número de transacción.");
        return;
    }

    document.getElementById('loader').style.display = 'flex';

    try {
        const resp = await fetch(`${URL_GOOGLE}?action=validarRegistro&cedula=${ced}&transaccion=${trans}`);
        const data = await resp.json();

        if (data.cedulaExiste) {
            alert("¡ERROR! Esta cédula ya está registrada.");
            document.getElementById('loader').style.display = 'none';
        } else if (data.transaccionExiste) {
            alert("¡ERROR! Este número de transacción ya fue usado.");
            document.getElementById('loader').style.display = 'none';
        } else {
            document.getElementById('loader').style.display = 'none';
            actualizarOpcionesNombre(); // Llenar nombres para la camiseta
            obtenerDorsalesLibres();
            verPaso(2); // RECIÉN AQUÍ PERMITE SEGUIR
        }
    } catch (e) {
        console.error(e);
        document.getElementById('loader').style.display = 'none';
        alert("Error de conexión al validar. Revisa tu internet.");
    }
}

// 2. FUNCIÓN DE ENVÍO FINAL (Reparada para que lleguen las fotos)
async function enviarTodo() {
    document.getElementById('final-animacion').style.display = 'flex';
    
    const form = document.getElementById('formRegistro');
    const formData = new FormData(form);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
        if (key.includes('foto') || key === 'correo') {
            params.append(key, value);
        } else {
            params.append(key, typeof value === 'string' ? value.toUpperCase() : value);
        }
    });

    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            mode: 'no-cors',
            body: params.toString()
        });

        setTimeout(() => {
            document.getElementById('final-status').innerText = "¡REGISTRO EXITOSO!";
            document.getElementById('final-mensaje').innerText = "Bienvenido a la familia del Nápoles F.C.";
            setTimeout(() => { window.location.href = "login.html"; }, 3000);
        }, 3000);
    } catch (e) {
        alert("Error al guardar.");
        document.getElementById('final-animacion').style.display = 'none';
    }
}
