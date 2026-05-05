// Configuración (cambia por tu URL de Google Apps Script)
const URL_GAS = "https://script.google.com/macros/s/AKfycbyOZObCnKnnbwwuwTO8CULGvh1-c9hiUqAhBs15N3ceMYaFQaiHtTQWGJgugbodinP6/exec";

// ========== SISTEMA DE TOASTS ==========
function mostrarToast(mensaje, tipo = 'info', duracion = 3000) {
    const toastAnterior = document.querySelector('.toast-notification');
    if (toastAnterior) toastAnterior.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${tipo}`;
    toast.innerHTML = `
        <span>${tipo === 'error' ? '❌' : tipo === 'success' ? '✅' : 'ℹ️'}</span>
        <span>${mensaje}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideUp 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, duracion);
}

// Marcar input con error y mostrar toast
function marcarErrorInput(input, mensaje) {
    input.classList.add('error');
    mostrarToast(mensaje, 'error', 2500);
    setTimeout(() => input.classList.remove('error'), 500);
}

// Elementos DOM
const loaderDiv = document.getElementById('loader');
const loaderTexto = document.getElementById('loader-texto');
const modalExito = document.getElementById('modalExito');

function mostrarLoader(visible, texto = "Procesando...") {
    loaderDiv.style.display = visible ? "flex" : "none";
    if (texto) loaderTexto.innerText = texto;
}

function verPaso(n) {
    document.querySelectorAll(".paso").forEach(p => p.classList.remove("activo"));
    document.getElementById(`paso${n}`).classList.add("activo");
}

// Convertir a mayúsculas excepto email
document.querySelectorAll('input:not([type="email"]):not([type="file"]):not([type="hidden"])').forEach(inp => {
    inp.addEventListener('input', function(e) {
        if (this.id !== 'correo') this.value = this.value.toUpperCase();
    });
});

// ================= PASO 1 =================
const ced = document.getElementById('ced');
const btnCedula = document.getElementById('btnCedula');

ced.addEventListener('input', () => {
    ced.value = ced.value.replace(/\D/g, '').slice(0, 10);
    btnCedula.disabled = ced.value.length !== 10;
});

btnCedula.addEventListener('click', async () => {
    mostrarLoader(true, "Validando cédula...");
    try {
        const resp = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${ced.value}`);
        const data = await resp.json();
        if (data.cedulaExiste) {
            mostrarToast("⚠️ Esta cédula ya está registrada.", "error");
            mostrarLoader(false);
            return;
        }
        verPaso(2);
    } catch (error) {
        mostrarToast("Error de conexión. Intenta de nuevo.", "error");
        console.error(error);
    }
    mostrarLoader(false);
});

// ================= PASO 2 =================
const n1 = document.getElementById('n1');
const n2 = document.getElementById('n2');
const ape = document.getElementById('ape');
const fecha = document.getElementById('fecha');
const btnPaso2 = document.getElementById('btnPaso2');

function validarPaso2() {
    const fechaValida = fecha.value && !isNaN(new Date(fecha.value));
    if (n1.value.trim() && n2.value.trim() && ape.value.trim() && fechaValida) {
        btnPaso2.disabled = false;
    } else {
        btnPaso2.disabled = true;
        if (!n1.value.trim()) marcarErrorInput(n1, "Primer nombre obligatorio");
        else if (!n2.value.trim()) marcarErrorInput(n2, "Segundo nombre obligatorio");
        else if (!ape.value.trim()) marcarErrorInput(ape, "Apellidos obligatorios");
        else if (!fechaValida) marcarErrorInput(fecha, "Fecha de nacimiento inválida");
    }
}

[n1, n2, ape, fecha].forEach(el => el.addEventListener('input', validarPaso2));
btnPaso2.addEventListener('click', () => verPaso(3));

// ================= PASO 3 =================
const tel = document.getElementById('tel');
const correo = document.getElementById('correo');
const btnPaso3 = document.getElementById('btnPaso3');

function validarPaso3() {
    const telOk = tel.value.replace(/\D/g, '').length >= 10;
    const emailOk = correo.value.includes('@') && correo.value.includes('.');
    btnPaso3.disabled = !(telOk && emailOk);
    if (!telOk && tel.value.length > 0) marcarErrorInput(tel, "Teléfono debe tener 10 dígitos");
    if (!emailOk && correo.value.length > 0) marcarErrorInput(correo, "Correo electrónico inválido");
}

[tel, correo].forEach(el => el.addEventListener('input', validarPaso3));
tel.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0,10); });
btnPaso3.addEventListener('click', () => verPaso(4));

// ================= PASO 4 =================
const rostro = document.getElementById('rostro');
const cedulaFile = document.getElementById('cedulaFile');
const fotoRostroB64 = document.getElementById('fotoRostroB64');
const fotoCedulaB64 = document.getElementById('fotoCedulaB64');
const btnPaso4 = document.getElementById('btnPaso4');
const vistoRostro = document.getElementById('vistoRostro');
const vistoCedula = document.getElementById('vistoCedula');

function archivoABase64(file, inputHidden, vistoSpan) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => {
            inputHidden.value = reader.result;
            if (vistoSpan) vistoSpan.innerHTML = '✓';
            resolve(true);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function verificarFotos() {
    const rostroOk = fotoRostroB64.value !== '';
    const cedulaOk = fotoCedulaB64.value !== '';
    btnPaso4.disabled = !(rostroOk && cedulaOk);
    if (!rostroOk && rostro.files.length > 0) marcarErrorInput(rostro, "Error al cargar foto perfil");
    if (!cedulaOk && cedulaFile.files.length > 0) marcarErrorInput(cedulaFile, "Error al cargar foto cédula");
}

rostro.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
        mostrarToast("Solo imágenes JPG o PNG", "error");
        rostro.value = '';
        vistoRostro.innerHTML = '';
        return;
    }
    if (file && file.size > 2 * 1024 * 1024) {
        mostrarToast("La imagen no debe superar 2MB", "error");
        rostro.value = '';
        vistoRostro.innerHTML = '';
        return;
    }
    await archivoABase64(file, fotoRostroB64, vistoRostro);
    verificarFotos();
});

cedulaFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
        mostrarToast("Solo imágenes JPG o PNG", "error");
        cedulaFile.value = '';
        vistoCedula.innerHTML = '';
        return;
    }
    if (file && file.size > 2 * 1024 * 1024) {
        mostrarToast("La imagen no debe superar 2MB", "error");
        cedulaFile.value = '';
        vistoCedula.innerHTML = '';
        return;
    }
    await archivoABase64(file, fotoCedulaB64, vistoCedula);
    verificarFotos();
});

btnPaso4.addEventListener('click', async () => {
    mostrarLoader(true, "Cargando dorsales...");
    const selectNombre = document.getElementById('nombreCamiseta');
    const selectDorsal = document.getElementById('dorsal');
    selectNombre.innerHTML = '';
    selectDorsal.innerHTML = '';

    const primerNombre = n1.value.trim();
    const segundoNombre = n2.value.trim();
    selectNombre.add(new Option(primerNombre, primerNombre));
    if (segundoNombre) selectNombre.add(new Option(segundoNombre, segundoNombre));

    try {
        const resp = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await resp.json();
        for (let i = 1; i <= 99; i++) {
            if (!ocupados.includes(String(i))) {
                selectDorsal.add(new Option(i, i));
            }
        }
    } catch (error) {
        mostrarToast("No se pudieron cargar los dorsales.", "error");
        console.error(error);
        mostrarLoader(false);
        return;
    }
    mostrarLoader(false);
    verPaso(5);
});

// ================= PASO 5 =================
const nombreCamiseta = document.getElementById('nombreCamiseta');
const dorsal = document.getElementById('dorsal');
const btnPaso5 = document.getElementById('btnPaso5');

function validarPaso5() {
    btnPaso5.disabled = !(nombreCamiseta.value && dorsal.value);
}
nombreCamiseta.addEventListener('change', validarPaso5);
dorsal.addEventListener('change', validarPaso5);
btnPaso5.addEventListener('click', () => verPaso(6));

// ================= PASO 6 =================
const medias = document.getElementById('medias');
const inscripcion = document.getElementById('inscripcion');
const uniforme = document.getElementById('uniforme');
const btnFinal = document.getElementById('btnFinal');

function validarPaso6() {
    btnFinal.disabled = !(medias.value && inscripcion.value.trim() && uniforme.value.trim());
    if (medias.value === "") marcarErrorInput(medias, "Seleccione si necesita medias extras");
    if (!inscripcion.value.trim()) marcarErrorInput(inscripcion, "Número de transacción de inscripción requerido");
    if (!uniforme.value.trim()) marcarErrorInput(uniforme, "Número de transacción de uniforme requerido");
}
[medias, inscripcion, uniforme].forEach(el => el.addEventListener('input', validarPaso6));

// Envío final
btnFinal.addEventListener('click', async () => {
    mostrarLoader(true, "Registrando jugador...");

    const formData = new FormData();
    formData.append('ced', ced.value);
    formData.append('n1', n1.value.trim());
    formData.append('n2', n2.value.trim());
    formData.append('ape', ape.value.trim());
    formData.append('fecha', fecha.value);
    formData.append('tel', tel.value.replace(/\D/g, ''));
    formData.append('correo', correo.value.trim().toLowerCase());
    formData.append('medias', medias.value);
    formData.append('dorsal', dorsal.value);
    formData.append('nombreCamiseta', nombreCamiseta.value);
    formData.append('inscripcion', inscripcion.value.trim());
    formData.append('uniforme', uniforme.value.trim());
    formData.append('fotoRostroB64', fotoRostroB64.value);
    formData.append('fotoCedulaB64', fotoCedulaB64.value);

    try {
        const response = await fetch(URL_GAS, { method: 'POST', body: formData });
        const result = await response.json();

        if (result.ok) {
            localStorage.setItem('jugador_aprobado', JSON.stringify({
                cedula: ced.value,
                expira: Date.now() + 24 * 3600000,
                admin: false
            }));
            mostrarLoader(false);
            modalExito.style.display = 'flex';
            let segundos = 3;
            const spanContador = document.getElementById('contador');
            const intervalo = setInterval(() => {
                segundos--;
                spanContador.innerText = segundos;
                if (segundos <= 0) {
                    clearInterval(intervalo);
                    window.location.href = 'perfil.html';
                }
            }, 1000);
        } else {
            mostrarLoader(false);
            mostrarToast("❌ Error: " + (result.msg || result.error || "Intenta de nuevo"), "error");
        }
    } catch (error) {
        mostrarLoader(false);
        console.error(error);
        mostrarToast("Error de red. Revisa tu conexión.", "error");
    }
});

// ================= INYECCIÓN DE NAVEGACIÓN =================
function inyectarNav() {
    const pagina = location.pathname.split("/").pop();
    if (pagina === "index.html") return;
    if (document.querySelector('.nav-napoles')) return;

    let sessionActiva = false;
    let esAdmin = false;
    try {
        const sessionRaw = localStorage.getItem('jugador_aprobado');
        if (sessionRaw) {
            const session = JSON.parse(sessionRaw);
            sessionActiva = Date.now() < session.expira;
            esAdmin = session.admin === true;
            if (!sessionActiva) localStorage.removeItem('jugador_aprobado');
        }
    } catch(e) {}

    const nav = document.createElement('nav');
    nav.className = 'nav-napoles';

    const items = [
        { href: 'index.html', icono: '🏠', label: 'Inicio' },
        { href: 'perfil.html', icono: '⚽', label: 'Perfil' },
        { href: 'noticias.html', icono: '📢', label: 'Noticias' }
    ];
    if (sessionActiva && esAdmin) {
        items.push({ href: 'admin.html', icono: '👑', label: 'Admin' });
    }
    if (sessionActiva) {
        items.push({ href: '#', icono: '🚪', label: 'Salir', accion: 'logout' });
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.icono;
        div.setAttribute('aria-label', item.label);
        div.setAttribute('title', item.label);
        if (item.accion === 'logout') {
            div.onclick = () => {
                localStorage.removeItem('jugador_aprobado');
                location.href = 'index.html';
            };
        } else {
            div.onclick = () => location.href = item.href;
        }
        nav.appendChild(div);
    });

    document.body.appendChild(nav);
}

document.addEventListener('DOMContentLoaded', inyectarNav);
