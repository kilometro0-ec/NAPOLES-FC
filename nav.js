// nav.js - Generador de navegación inferior para Nápoles FC
document.addEventListener('DOMContentLoaded', () => {
    const navHTML = `
    <nav style="
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #1A2B48; 
        border-top: 2px solid #B59461;
        display: flex;
        justify-content: space-around;
        padding: 10px 0;
        z-index: 1000;
    ">
        <div class="nav-item" onclick="location.href='index.html'" style="text-align: center; cursor: pointer;">
            <span style="display: block; font-size: 20px;">📝</span>
            <span style="color: white; font-size: 12px;">Registro</span>
        </div>
        <div class="nav-item" onclick="location.href='perfil.html'" style="text-align: center; cursor: pointer;">
            <span style="display: block; font-size: 20px;">⚽</span>
            <span style="color: white; font-size: 12px;">Mi Perfil</span>
        </div>
        <div class="nav-item" onclick="location.href='admin.html'" style="text-align: center; cursor: pointer;">
            <span style="display: block; font-size: 20px;">👑</span>
            <span style="color: white; font-size: 12px;">Admin</span>
        </div>
    </nav>
    <style>
        body { padding-bottom: 70px; } /* Espacio para que el menú no tape el contenido */
        .nav-item:hover span { color: #B59461 !important; }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', navHTML);
});
