const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtkteQyiz2coMtGt3uMV68GMXbcD_-3suFue8AVMZ_TKNlUKK-oicmbOgUQENrg5q_/exec";

document.getElementById('formularioRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerText = "ENVIANDO...";
    btn.disabled = true;

    try {
        const fotoCedulaFile = document.getElementById('fotoCedula').files[0];
        const fotoCedulaBase64 = fotoCedulaFile ? await toBase64(fotoCedulaFile) : "";

        const payload = {
            nombre1: document.getElementById('nombre1').value.trim().toUpperCase(),
            nombre2: document.getElementById('nombre2').value.trim().toUpperCase(),
            apellidos: document.getElementById('apellidos').value.trim().toUpperCase(),
            cedula: document.getElementById('cedula').value.trim(),
            fechaNac: document.getElementById('fechaNac').value,
            telefono: document.getElementById('telefono').value.trim(),
            correo: document.getElementById('correo').value.trim().toLowerCase(),
            urlFotoRostro: document.getElementById('fotoPreview').src,
            urlFotoCedula: fotoCedulaBase64
        };

        const xhr = new XMLHttpRequest();
        xhr.open("POST", SCRIPT_URL, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                alert("¡REGISTRO EXITOSO! Nápoles FC le da la bienvenida.");
                location.reload();
            }
        };
        xhr.send(JSON.stringify(payload));
    } catch (error) {
        alert("Error: " + error);
        btn.disabled = false;
        btn.innerText = "FINALIZAR INSCRIPCIÓN";
    }
});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
