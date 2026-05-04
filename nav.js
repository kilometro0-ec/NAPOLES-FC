/**
 * nav.js - Sistema de Navegación y Footer Oficial
 * bY Corporación 360 | Quito - Ecuador
 */

document.addEventListener('DOMContentLoaded', () => {
    const sessionActiva = localStorage.getItem('jugador_aprobado');
    const path = window.location.pathname;
    const paginaActual = path.split("/").pop() || "index.html";

    // Si es la página de registro (index), NO mostrar navegación
    if (paginaActual === "index.html" || !sessionActiva) {
        console.log("Modo registro: Navegación oculta.");
        return; 
    }

    const interfazHTML = `
    <nav class="nav-napoles">
        <div class="nav-link ${paginaActual === 'perfil.html' ? 'active' : ''}" onclick="window.location.href='perfil.html'">
            <span class="nav-icon">⚽</span>
            <span class="nav-text">Mi Perfil</span>
        </div>
        <div class="nav-link ${paginaActual === 'noticias.html' ? 'active' : ''}" onclick="window.location.href='noticias.html'">
            <span class="nav-icon">📢</span>
            <span class="nav-text">Noticias</span>
        </div>
    </nav>
    <footer class="footer-corporativo">
        <div class="footer-content">
            <p class="brand">bY Corporación 360</p>
            <p class="version">Versión 2026.1.0</p>
            <p class="location">Quito - Ecuador</p>
        </div>
    </footer>
    <style>
        :root { --azul-noche: #1A2B48; --dorado-napoles: #B59461; }
        body { margin-bottom: 80px; }
        .nav-napoles { position: fixed; bottom: 0; width: 100%; background: var(--azul-noche); border-top: 2px solid var(--dorado-napoles); display: flex; padding: 12px 0; z-index: 10000; }
        .nav-link { flex: 1; text-align: center; opacity: 0.5; cursor: pointer; }
        .nav-link.active { opacity: 1; color: var(--dorado-napoles); }
        .nav-icon { display: block; font-size: 22px; }
        .nav-text { color: white; font-size: 10px; text-transform: uppercase; }
        .footer-corporativo { background: var(--azul-noche); color: var(--dorado-napoles); padding: 20px; text-align: center; font-size: 10px; }
    </style>`;

    document.body.insertAdjacentHTML('beforeend', interfazHTML);
});
