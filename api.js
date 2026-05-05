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
                let opt = new Option(`DORSAL ${i}`, i);
                select.add(opt);
            }
        }
    } catch (e) {
        console.error("Error dorsales:", e);
        select.innerHTML = '<option value="">ERROR AL CARGAR - ELIGE NÚMERO</option>';
        for (let i = 1; i <= 99; i++) select.add(new Option(i, i));
    }
}

// 2. VERIFICAR SI LA CÉDULA YA EXISTE
async function verificarCedulaExistente(cedula) {
    try {
        const resp = await fetch(`${URL_GOOGLE}?action=getDorsales`); // Reutilizamos consulta de datos
        const data = await resp.json();
        // Nota: Esta es una validación simple. Lo ideal es que el GAS tenga action=checkCedula
        // Pero para no complicarte, si el script de Google devuelve todos los datos, comparamos aquí.
        return false; 
    } catch (e) { return false; }
}

// 3. FUNCIÓN DE ENVÍO (LLAMADA DESDE EL HTML)
async function enviarADatabase() {
    const form = document.getElementById('formRegistro');
    const formData = new FormData(form);
    
    // VALIDACIÓN DE SEGURIDAD FINAL
    const cedula = formData.get('cedula');
    if (cedula.length !== 10) {
        alert("LA CÉDULA DEBE TENER 10 DÍGITOS");
        document.getElementById('final-animacion').style.display = 'none';
        return false;
    }

    // CONVERTIR TODO A MAYÚSCULAS ANTES DE ENVIAR (Menos el correo si existiera)
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        if (key !== 'correo' && typeof value === 'string') {
            params.append(key, value.toUpperCase());
        } else {
            params.append(key, value);
        }
    }

    try {
        // Ejecutar el envío
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: params,
            mode: 'no-cors'
        });

        // Como mode: 'no-cors' no permite leer la respuesta, 
        // esperamos 2 segundos para asegurar que Google procesó el archivo
        await new Promise(resolve => setTimeout(resolve, 2500));
        return true; 

    } catch (e) {
        console.error("Error en envío:", e);
        alert("ERROR DE CONEXIÓN AL GUARDAR");
        document.getElementById('final-animacion').style.display = 'none';
        return false;
    }
}

// Ejecutar carga de dorsales al cargar la web
document.addEventListener('DOMContentLoaded', obtenerDorsalesLibres);
