const URL_GOOGLE = 'https://script.google.com/macros/s/AKfycbyC0ZftX6QL6_5DVCGfdWj9OPw8kDOE9W6w_4xbGhzcSAHrPxaTOgWh6JDUj6hRPD-7/exec';

// 1. FUNCIÓN PARA CARGAR DORSALES DISPONIBLES AL INICIAR
async function obtenerDorsalesLibres() {
    const select = document.getElementById('selectDorsal');
    if (!select) return;

    try {
        // Llamada al script de Google con el parámetro action=getDorsales
        const respuesta = await fetch(`${URL_GOOGLE}?action=getDorsales`);
        const ocupados = await respuesta.json(); // Lista de números ya registrados
        
        select.innerHTML = '<option value="">Selecciona un número</option>';
        
        // Generar números del 1 al 99
        for (let i = 1; i <= 99; i++) {
            // Convertimos i a String porque los datos de Sheets suelen venir como texto o número
            if (!ocupados.map(String).includes(String(i))) {
                let opt = document.createElement('option');
                opt.value = i;
                opt.text = `Dorsal ${i}`;
                select.add(opt);
            }
        }
    } catch (e) {
        console.error("Error cargando dorsales:", e);
        // Si falla la conexión, cargamos todos por defecto para no bloquear al usuario
        select.innerHTML = '<option value="">Selecciona un número</option>';
        for (let i = 1; i <= 99; i++) {
            select.add(new Option(i, i));
        }
    }
}

// Ejecutar la carga de dorsales al abrir la página
document.addEventListener('DOMContentLoaded', obtenerDorsalesLibres);

// 2. LOGICA DE ENVÍO DEL FORMULARIO
document.getElementById('formRegistro').onsubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las fotos estén tomadas
    const fotoRostro = document.getElementById('fotoRostroB64').value;
    const fotoCedula = document.getElementById('fotoCedulaB64').value;

    if (!fotoRostro || !fotoCedula) {
        alert("Por favor, captura ambas fotos (Rostro y Cédula) antes de finalizar.");
        return;
    }

    document.getElementById('loader').style.display = 'block';

    // Usamos URLSearchParams para enviar los datos de forma simple a GAS
    const formData = new FormData(e.target);
    const dataEnviada = new URLSearchParams(formData);

    try {
        // Enviamos el POST
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: dataEnviada,
            mode: 'no-cors' // IMPORTANTE: Mantenemos esto por compatibilidad
        });

        // Con no-cors no podemos leer la respuesta, pero si no salta al catch, suele estar bien
        alert('¡REGISTRO ENVIADO CON ÉXITO!\nTu información y fotos han sido procesadas.');
        location.reload();

    } catch (err) {
        console.error("Error en el envío:", err);
        alert('Hubo un problema al enviar el formulario. Verifica tu conexión.');
        document.getElementById('loader').style.display = 'none';
    }
};
