/**
 * nav.js - Sistema de Navegación y Footer Nápoles F.C.
 * Desarrollado por: bY Corporación 360
 * Ubicación: Quito - Ecuador
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificación de seguridad para acceso restringido
    const sessionActiva = localStorage.getItem('jugador_aprobado');
    const path = window.location.pathname;
    const paginaActual = path.split("/").pop() || "index.html";

    // Bloqueo de renderizado para registro o usuarios no aprobados
    if (paginaActual === "index.html" || !sessionActiva) {
        return; 
    }

    // 2. Definición de la estructura HTML refactorizada
    const interfazHTML = `
    <!-- Navegación Móvil Inferior -->
    <nav class="nav-napoles">
        <div class="nav-link ${paginaActual === 'perfil.html' ? 'active' : ''}" 
             onclick="window.location.href='perfil.html'">
            <span class="nav-icon">⚽</span>
            <span class="nav-text">Mi Perfil</span>
        </div>
        <div class="nav-link ${paginaActual === 'noticias.html' ? 'active' : ''}" 
             onclick="window.location.href='noticias.html'">
            <span class="nav-icon">📢</span>
            <span class="nav-text">Noticias</span>
        </div>
        <div class="nav-link ${paginaActual === 'admin.html' ? 'active' : ''}" 
             onclick="window.location.href='admin.html'">
            <span class="nav-icon">👑</span>
            <span class="nav-text">Admin</span>
        </div>
    </nav>

    <!-- Footer Corporativo Unificado -->
    <footer class="footer-corporativo">
        <div class="footer-content">
            <p class="brand">bY Corporación 360</p>
            <p class="version">Versión 2026.1.0</p>
            <p class="location">Quito - Ecuador</p>
        </div>
    </footer>

    <style>
        :root {
            --azul-noche: #1A2B48;
            --dorado-napoles: #B59461;
            --blanco: #ffffff;
        }

        body {
            margin-bottom: 90px; /* Espacio para evitar solapamiento con el nav */
        }

        .nav-napoles {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--azul-noche);
            border-top: 2px solid var(--dorado-napoles);
            display: flex;
            justify-content: space-around;
            padding: 12px 0;
            z-index: 10000;
            box-shadow: 0 -5px 15px rgba(0,0,0,0.5);
        }

        .nav-link {
            text-align: center;
            flex: 1;
            cursor: pointer;
            transition: transform 0.2s ease, opacity 0.2s ease;
            opacity: 0.5;
        }

        .nav-link.active {
            opacity: 1;
            transform: translateY(-2px);
        }

        .nav-link.active .nav-text {
            color: var(--dorado-napoles);
            font-weight: bold;
        }

        .nav-icon {
            display: block;
            font-size: 24px;
            margin-bottom: 2px;
        }

        .nav-text {
            color: var(--blanco);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .footer-corporativo {
            background-color: var(--azul-noche);
            color: var(--dorado-napoles);
            padding: 40px 10px 120px 10px;
            text-align: center;
            border-top: 1px solid rgba(181, 148, 97, 0.1);
        }

        .footer-content .brand {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 2px;
            text-transform: none; /* Mantiene el formato "bY Corporación 360" */
        }

        .footer-content .version, 
        .footer-content .location {
            font-size: 10px;
            margin: 5px 0;
            opacity: 0.7;
        }
    </style>
    `;

    // 3. Inyección limpia en el DOM
    document.body.insertAdjacentHTML('beforeend', interfazHTML);
});
