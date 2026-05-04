document.addEventListener('DOMContentLoaded', () => {
    const sessionActiva = localStorage.getItem('jugador_aprobado');
    const paginaActual = window.location.pathname.split("/").pop() || "index.html";

    if (paginaActual === "index.html" || !sessionActiva) return;

    const interfazHTML = `
    <nav class="nav-napoles">
        <div class="nav-link ${paginaActual === 'perfil.html' ? 'active' : ''}" onclick="location.href='perfil.html'">
            <span class="nav-icon">⚽</span><span class="nav-text">Mi Perfil</span>
        </div>
        <div class="nav-link ${paginaActual === 'noticias.html' ? 'active' : ''}" onclick="location.href='noticias.html'">
            <span class="nav-icon">📢</span><span class="nav-text">Noticias</span>
        </div>
        <div class="nav-link ${paginaActual === 'admin.html' ? 'active' : ''}" onclick="location.href='admin.html'">
            <span class="nav-icon">👑</span><span class="nav-text">Admin</span>
        </div>
    </nav>
    <footer class="footer-corporativo">
        <div class="footer-content">
            <p class="brand">bY Corporación 360</p>
            <p class="version">Versión 2026.1.0 | Quito - Ecuador</p>
        </div>
    </footer>
    <style>
        body { margin-bottom: 100px; }
        .nav-napoles { position: fixed; bottom: 0; width: 100%; background: #1A2B48; display: flex; padding: 10px 0; border-top: 2px solid #B59461; z-index: 999; }
        .nav-link { flex: 1; text-align: center; opacity: 0.5; color: white; cursor: pointer; }
        .nav-link.active { opacity: 1; color: #B59461; }
        .nav-icon { display: block; font-size: 20px; }
        .nav-text { font-size: 10px; text-transform: uppercase; }
        .footer-corporativo { background: #1A2B48; color: #B59461; padding: 20px; text-align: center; font-size: 12px; }
    </style>`;
    document.body.insertAdjacentHTML('beforeend', interfazHTML);
});
