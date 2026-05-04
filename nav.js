/**
 * nav.js - Sistema de Navegación y Footer Oficial
 * Desarrollado por: bY Corporación 360
 * Versión 2026.1.0 | Quito - Ecuador
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificación de Seguridad: Solo mostrar si el jugador está aprobado
    // Esta marca se crea en el login cuando el estado en Google Sheets es 'APROBADO'
    const sessionActiva = localStorage.getItem('jugador_aprobado');

    // Si no hay sesión activa, el script se detiene y no muestra nada
    if (!sessionActiva) {
        console.log("Acceso restringido: Navegación oculta hasta aprobación.");
        return; 
    }

    // 2. Identificar la página actual para iluminar el botón
    const path = window.location.pathname;
    const paginaActual = path.split("/").pop() || "index.html";

    // 3. Estructura de la Navegación y el Pie de Página (Colores del uniforme 2026)
    const interfazHTML = `
    <!-- Barra de Navegación Inferior (Solo visible para aprobados) -->
    <nav class="nav-napoles">
        <div class="nav-link ${paginaActual === 'perfil.html' ? 'active' : ''}" onclick="window.location.href='perfil.html'">
            <span class="nav-icon">⚽</span>
            <span class="nav-text">Mi Perfil</span>
        </div>
        <div class="nav-link ${paginaActual === 'noticias.html' ? 'active' : ''}" onclick="window.location.href='noticias.html'">
            <span class="nav-icon">📢</span>
            <span class="nav-text">Noticias</span>
        </div>
        <div class="nav-link ${paginaActual === 'admin.html' ? 'active' : ''}" onclick="window.location.href='admin.html'">
            <span class="nav-icon">👑</span>
            <span class="nav-text">Admin</span>
        </div>
    </nav>

    <!-- Footer de Identidad Corporativa -->
    <footer class="footer-corporativo">
        <div class="footer-content">
            <p class="brand">bY Corporación 360</p>
            <p class="version">Versión 2026.1.0</p>
            <p class="location">Quito - Ecuador</p>
        </div>
    </footer>

    <style>
        /* Paleta de colores Nápoles F.C. 2026 */
        :root {
            --azul-noche: #1A2B48;
            --dorado-napoles: #B59461;
            --blanco: #ffffff;
        }

        body {
            margin-bottom: 80px; /* Espacio para no tapar contenido con el nav */
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
            transition: 0.3s ease;
            opacity: 0.5;
        }

        .nav-link.active {
            opacity: 1;
            transform: translateY(-3px);
        }

        .nav-link.active .nav-text {
            color: var(--dorado-napoles);
            font-weight: bold;
        }

        .nav-icon {
            display: block;
            font-size: 22px;
            margin-bottom: 2px;
        }

        .nav-text {
            color: var(--blanco);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .footer-corporativo {
            background-color: var(--azul-noche);
            color: var(--dorado-napoles);
            padding: 30px 10px 100px 10px;
            text-align: center;
            border-top: 1px solid rgba(181, 148, 97, 0.1);
        }

        .footer-content .brand {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 2px;
        }

        .footer-content .version, .footer-content .location {
            font-size: 10px;
            margin: 5px 0;
            opacity: 0.7;
        }
    </style>
    `;

    // 4. Inyectar la interfaz en el documento
    document.body.insertAdjacentHTML('beforeend', interfazHTML);
});
