// api.js
const URL_GAS = 'https://script.google.com/macros/s/AKfycbyC0ZftX6QL6_5DVCGfdWj9OPw8kDOE9W6w_4xbGhzcSAHrPxaTOgWh6JDUj6hRPD-7/exec';

// 1. ESTA ES LA FUNCIÓN QUE LLAMA EL BOTÓN DEL PASO 1
async function validarPaso1() {
    const cedula = document.getElementById('ced').value;
    const transaccion = document.getElementById('trans').value;

    if (cedula.length !== 10) {
        alert("La cédula debe tener exactamente 10 dígitos.");
        return;
    }
    if (!transaccion) {
        alert("Por favor, ingresa el número de transacción.");
        return;
    }

    // Mostrar pantalla de carga
    document.getElementById('loader').style.display = 'flex';

    try {
        // Consultamos al Google Apps Script
        const response = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${cedula}&transaccion=${transaccion}`);
        const data = await response.json();

        if (data.cedulaExiste) {
            alert("Esta cédula ya se encuentra registrada.");
            document.getElementById('loader').style.display = 'none';
        } else if (data.transaccionExiste) {
            alert("Este número de transacción ya ha sido utilizado.");
            document.getElementById('loader').style.display = 'none';
        } else {
            // ÉXITO: Cargamos dorsales y pasamos al Paso 2
            document.getElementById('loader').style.display = 'none';
            await cargarDorsales();
            verPaso(2); 
        }
    } catch (error) {
        console.error("Error al validar:", error);
        document.getElementById('loader').style.display = 'none';
        // Si falla la conexión por CORS pero quieres dejarlo pasar, usa verPaso(2)
        alert("Error de conexión con el club. Revisa tu internet.");
    }
}

// 2. FUNCIÓN PARA PROCESAR LOS NOMBRES (Paso 2 -> Paso 3)
function procesarNombres() {
    const n1 = document.getElementById('n1').value.trim().toUpperCase();
    const n2 = document.getElementById('n2').value.trim().toUpperCase();
    const select = document.getElementById('selectNombreCamiseta');

    if (!n1) {
        alert("Por favor ingresa al menos tu primer nombre.");
        return;
    }

    select.innerHTML = ""; // Limpiar opciones previas
    
    // Opción con el primer nombre
    let opt1 = new Option(n1, n1);
    select.add(opt1);

    // Opción con el segundo nombre si existe
    if (n2) {
        let opt2 = new Option(n2, n2);
        select.add(opt2);
    }

    verPaso(3);
}

// 3. CARGAR DORSALES DISPONIBLES (Columna 18)
async function cargarDorsales() {
    try {
        const res = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await res.json();
        const selectDorsal = document.getElementById('selectDorsal');
        
        selectDorsal.innerHTML = '<option value="">-- Elige un dorsal --</option>';
        
        for (let i = 1; i <= 99; i++) {
            // Si el número no está en la lista de ocupados, lo agregamos
            if (!ocupados.map(String).includes(String(i))) {
                selectDorsal.add(new Option(`Dorsal ${i}`, i));
            }
        }
    } catch (e) {
        console.error("Error cargando dorsales:", e);
    }
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
        alert("¡Faltan las fotos! Por favor tómalas antes de finalizar.");
        return;
    }

    document.getElementById('final-animacion').style.display = 'flex';
    
    const form = document.getElementById('formRegistro');
    // Usamos URLSearchParams para que Google Apps Script lea bien con e.parameter
    const formData = new URLSearchParams(new FormData(form));

    try {
        await fetch(URL_GAS, {
            method: 'POST',
            mode: 'no-cors',
            body: formData.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        // Simular éxito (ya que no-cors no da respuesta)
        setTimeout(() => {
            document.getElementById('final-status').innerText = "¡REGISTRO EXITOSO!";
            document.getElementById('final-mensaje').innerText = "Bienvenido a la familia Nápoles F.C.";
            setTimeout(() => { location.reload(); }, 3000);
        }, 3000);

    } catch (error) {
        alert("Error crítico al enviar. Intenta de nuevo.");
        document.getElementById('final-animacion').style.display = 'none';
    }
}
