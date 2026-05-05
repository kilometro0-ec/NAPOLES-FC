// ================= CONFIGURACIÓN =================
// 🔴 ¡CAMBIAR ESTA URL POR LA DE TU GOOGLE APPS SCRIPT!
const URL_GAS = "https://script.google.com/macros/s/AKfycbxjs260s4ZEh4ERrSRh7s99GjkqCZK-k5aEd7FO3dLlvO1FKHMo6gnKW_Jz2hPTwjP_/exec";

// ================= SISTEMA DE TOASTS =================
function mostrarToast(mensaje, tipo = 'info', duracion = 4000) {
    const toastAnterior = document.querySelector('.toast-notification');
    if (toastAnterior) toastAnterior.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification ${tipo}`;
    toast.innerHTML = `<span>${tipo === 'error' ? '❌' : tipo === 'success' ? '✅' : 'ℹ️'}</span><span>${mensaje}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastSlideUp 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, duracion);
}

function marcarErrorInput(input, mensaje) {
    input.classList.add('error');
    mostrarToast(mensaje, 'error', 2500);
    setTimeout(() => input.classList.remove('error'), 500);
}

// ================= ELEMENTOS DOM =================
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
    inp.addEventListener('input', function() {
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
        } else {
            verPaso(2);
        }
    } catch (error) {
        console.error(error);
        mostrarToast("Error de conexión. Revisa tu URL del backend.", "error");
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
    btnPaso2.disabled = !(n1.value.trim() && n2.value.trim() && ape.value.trim() && fechaValida);
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
    btnPaso4.disabled = !(fotoRostroB64.value && fotoCedulaB64.value);
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
    selectNombre.add(new Option(n1.value.trim(), n1.value.trim()));
    if (n2.value.trim()) selectNombre.add(new Option(n2.value.trim(), n2.value.trim()));
    try {
        const resp = await fetch(`${URL_GAS}?action=getDorsales`);
        const ocupados = await resp.json();
        for (let i = 1; i <= 99; i++) {
            if (!ocupados.includes(String(i))) selectDorsal.add(new Option(i, i));
        }
    } catch (error) {
        mostrarToast("No se pudieron cargar los dorsales.", "error");
        console.error(error);
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
    const mediasValida = medias.value !== "";
    const inscripcionValida = inscripcion.value.trim() !== "";
    const uniformeValida = uniforme.value.trim() !== "";
    btnFinal.disabled = !(mediasValida && inscripcionValida && uniformeValida);
    if (!mediasValida) medias.style.borderColor = "#ff5e5e";
    else medias.style.borderColor = "";
    if (!inscripcionValida) inscripcion.style.borderColor = "#ff5e5e";
    else inscripcion.style.borderColor = "";
    if (!uniformeValida) uniforme.style.borderColor = "#ff5e5e";
    else uniforme.style.borderColor = "";
}
[medias, inscripcion, uniforme].forEach(el => el.addEventListener('input', validarPaso6));

// ================= ENVÍO FINAL =================
btnFinal.addEventListener('click', async () => {
    if (btnFinal.disabled) {
        mostrarToast("Completa todos los campos del paso 6", "error");
        return;
    }

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

    console.log("Enviando datos:", {
        ced: ced.value,
        n1: n1.value,
        n2: n2.value,
        ape: ape.value,
        fecha: fecha.value,
        tel: tel.value,
        correo: correo.value,
        medias: medias.value,
        dorsal: dorsal.value,
        nombreCamiseta: nombreCamiseta.value,
        inscripcion: inscripcion.value,
        uniforme: uniforme.value,
        tieneFotoRostro: !!fotoRostroB64.value,
        tieneFotoCedula: !!fotoCedulaB64.value
    });

    try {
        const response = await fetch(URL_GAS, { method: 'POST', body: formData });
        const result = await response.json();
        console.log("Respuesta del backend:", result);

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
                if (spanContador) spanContador.innerText = segundos;
                if (segundos <= 0) {
                    clearInterval(intervalo);
                    window.location.href = 'login.html';   // ✅ Redirige a login.html
                }
            }, 1000);
        } else {
            mostrarLoader(false);
            mostrarToast("❌ Error del servidor: " + (result.msg || result.error || "Desconocido"), "error");
        }
    } catch (error) {
        mostrarLoader(false);
        console.error("Error de red:", error);
        mostrarToast("Error de red. Revisa tu conexión o la URL del backend.", "error");
    }
});

// ================= NAVEGACIÓN (NO APARECE EN REGISTRO) =================
function inyectarNav() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();
    if (filename === "" || filename === "index.html" || filename === "index") return;
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
    if (sessionActiva && esAdmin) items.push({ href: 'admin.html', icono: '👑', label: 'Admin' });
    if (sessionActiva) items.push({ href: '#', icono: '🚪', label: 'Salir', accion: 'logout' });

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
