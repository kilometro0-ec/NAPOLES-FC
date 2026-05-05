const URL_GOOGLE = 'https://script.google.com/macros/s/AKfycbx3L0U_Pfw2OCdh8KPXDZrRTRkQvAeoRab3sO5nsdUhwTSEnbxbD7YrCqfFyZkMLU4K/exec'; // <--- Pégala aquí

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
