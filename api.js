const URL_GOOGLE = 'https://script.google.com/macros/s/AKfycbyC0ZftX6QL6_5DVCGfdWj9OPw8kDOE9W6w_4xbGhzcSAHrPxaTOgWh6JDUj6hRPD-7/exec';

// 1. CARGAR DORSALES AL INICIAR
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
    } catch (e) {
        console.error("Error dorsales:", e);
        select.innerHTML = '<option value="">ERROR AL CARGAR</option>';
    }
}

// 2. VALIDAR CÉDULA Y TRANSACCIÓN (Paso 1)
async function validarDatosIniciales() {
    const ced = document.getElementById('ced').value;
    const trans = document.getElementById('trans').value;

    if (ced.length !== 10 || !trans) {
        alert("REVISA LA CÉDULA (10 DÍGITOS) Y EL NÚMERO DE TRANSACCIÓN.");
        return;
    }

    document.getElementById('loader').style.display = 'flex';

    try {
        // Esta acción debe estar programada en tu Google Apps Script
        const resp = await fetch(`${URL_GOOGLE}?action=validarRegistro&cedula=${ced}&transaccion=${trans}`);
        const data = await resp.json();

        if (data.cedulaExiste) {
            alert("ESTA CÉDULA YA ESTÁ REGISTRADA.");
            document.getElementById('loader').style.display = 'none';
        } else if (data.transaccionExiste) {
            alert("ESTA TRANSACCIÓN YA FUE USADA.");
            document.getElementById('loader').style.display = 'none';
        } else {
            document.getElementById('loader').style.display = 'none';
            actualizarOpcionesNombre();
            verPaso(2);
        }
    } catch (e) {
        console.error(e);
        document.getElementById('loader').style.display = 'none';
        verPaso(2); // Dejamos pasar si falla la red, pero lo ideal es validar
    }
}

// 3. FUNCIÓN DE ENVÍO FINAL (JSON para que soporten las fotos)
async function enviarTodo() {
    // Mostrar animación del balón
    document.getElementById('final-animacion').style.display = 'flex';
    
    const form = document.getElementById('formRegistro');
    const formData = new FormData(form);
    const datosFinales = {};

    // Convertimos FormData a un Objeto JSON
    formData.forEach((value, key) => {
        // No tocamos fotos ni correo, el resto a MAYÚSCULAS
        if (key.includes('foto') || key === 'correo') {
            datosFinales[key] = value;
        } else {
            datosFinales[key] = typeof value === 'string' ? value.toUpperCase() : value;
        }
    });

    try {
        // Enviamos como JSON stringified
        await fetch(URL_GOOGLE, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(datosFinales) 
        });

        // Tiempo de espera para que Google procese las fotos pesadas
        setTimeout(() => {
            document.getElementById('final-status').innerText = "¡REGISTRO EXITOSO!";
            document.getElementById('final-mensaje').innerText = "Bienvenido al Nápoles F.C.";
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 3000);
        }, 3000);

    } catch (e) {
        console.error("Error:", e);
        alert("ERROR AL GUARDAR. REVISA TU INTERNET.");
        document.getElementById('final-animacion').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', obtenerDorsalesLibres);
