document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener estado de sesión y página actual
    const sessionActiva = localStorage.getItem('jugador_aprobado');
    const path = window.location.pathname;
    const paginaActual = path.split("/").pop() || "index.html";

    // 2. Definir la interfaz (Menu + Footer + Estilos)
    const interfazHTML = `
    <nav class="nav-napoles">
        <div class="nav-link ${paginaActual === 'index.html' ? 'active' : ''}" onclick="location.href='index.html'">
            <span class="nav-icon">🏠</span><span class="nav-text">Inicio</span>
        </div>
        <div class="nav-link ${paginaActual === 'perfil.html' ? 'active' : ''}" onclick="location.href='perfil.html'">
            <span class="nav-icon">⚽</span><span class="nav-text">Mi Perfil</span>
        </div>
        <div class="nav-link ${paginaActual === 'noticias.html' ? 'active' : ''}" onclick="location.href='noticias.html'">
            <span class="nav-icon">📢</span><span class="nav-text">Noticias</span>
        </div>
        <!-- Solo mostrar Admin si la sesión existe -->
        ${sessionActiva ? `
        <div class="nav-link ${paginaActual === 'admin.html' ? 'active' : ''}" onclick="location.href='admin.html'">
            <span class="nav-icon">👑</span><span class="nav-text">Admin</span>
        </div>` : ''}
    </nav>

    <footer class="footer-corporativo">
        <div class="footer-content">
            <p class="brand">by Corporación 360</p>
            <p class="version">Versión 2026.1.0 | Quito - Ecuador</p>
        </div>
    </footer>

    <style>
        body { margin-bottom: 80px !important; }
        .nav-napoles { 
            position: fixed; 
            bottom: 0; 
            left: 0;
            width: 100%; 
            background: #1A2B48; 
            display: flex; 
            padding: 10px 0; 
            border-top: 2px solid #B59461; 
            z-index: 9999; 
        }
        .nav-link { flex: 1; text-align: center; color: white; cursor: pointer; opacity: 0.6; transition: 0.3s; }
        .nav-link.active { opacity: 1; color: #B59461; font-weight: bold; }
        .nav-icon { display: block; font-size: 1.2rem; margin-bottom: 2px; }
        .nav-text { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        .footer-corporativo { 
            background: #111e31; 
            color: #B59461; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px;
            margin-top: 50px;
        }
    </style>`;

    // 3. Inyectar en el cuerpo del documento
    document.body.insertAdjacentHTML('beforeend', interfazHTML);
});
