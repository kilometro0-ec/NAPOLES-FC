const URL_GOOGLE = 'https://script.google.com/macros/s/AKfycbzTLrOa6vxQO_5d88-YqCp1Y_lDFGMVViE1WByiR_3b9wnTBCf24-KDJxwKb3zSozX6/exec'; // <--- Pégala aquí

document.getElementById('formRegistro').onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById('loader').style.display = 'block';

    const formData = new FormData(e.target);

    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        alert('¡REGISTRO EXITOSO!');
        location.reload();
    } catch (err) {
        alert('Error al enviar. Intenta de nuevo.');
        document.getElementById('loader').style.display = 'none';
    }
};
