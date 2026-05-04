const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLctY39LIa_aVSFKCIQl306huhIk6CiZzrUC2PczfeVlTJ9-V9Vt9giq1A2mYveAHW/exec";

document.getElementById('formularioRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = "ENVIANDO...";

    // Capturar foto de rostro desde el preview (Base64)
    const fotoRostroBase64 = document.getElementById('fotoPreview').src;
    const fotoCedulaFile = document.getElementById('fotoCedula').files[0];
    
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });

    const fotoCedulaBase64 = await toBase64(fotoCedulaFile);

    const datos = {
        nombre1: document.getElementById('nombre1').value.toUpperCase(),
        nombre2: document.getElementById('nombre2').value.toUpperCase(),
        apellidos: document.getElementById('apellidos').value.toUpperCase(),
        cedula: document.getElementById('cedula').value,
        fechaNac: document.getElementById('fechaNac').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value.toLowerCase(), // Correo en minúscula por seguridad
        urlFotoRostro: fotoRostroBase64,
        urlFotoCedula: fotoCedulaBase64
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(datos)
    }).then(() => {
        alert("¡REGISTRO COMPLETADO!\nSus datos serán validados y un administrador de NÁPOLES F.C. se comunicará con usted.");
        location.reload();
    }).catch(err => {
        alert("Error al enviar. Verifique su conexión.");
        btn.disabled = false;
    });
});
