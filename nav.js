document.addEventListener('DOMContentLoaded', () => {

    // ❌ NO cargar nav en index (registro)
    const pagina = location.pathname.split("/").pop();
    if(pagina === "index.html") return;

    const sessionActiva = localStorage.getItem('jugador_aprobado');

    const nav = `
    <nav class="nav-napoles">
        <div onclick="location.href='index.html'">🏠</div>
        <div onclick="location.href='perfil.html'">⚽</div>
        <div onclick="location.href='noticias.html'">📢</div>
        ${sessionActiva ? `<div onclick="location.href='admin.html'">👑</div>` : ''}
    </nav>
    `;

    document.body.insertAdjacentHTML('beforeend', nav);
});
