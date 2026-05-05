// Este script inserta el favicon automáticamente en cualquier página
(function() {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = 'img/favicon.png'; // Ruta desde la raíz del proyecto
    document.head.appendChild(favicon);

    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = 'img/favicon.png';
    document.head.appendChild(appleIcon);
})();
