<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscripción | Nápoles FC</title>
    
    <!-- Configuración PWA -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#b59461">
    <link rel="stylesheet" href="estilos.css">
    
    <style>
        :root { --dorado: #b59461; --azul-noche: #0a192f; }
        body { background-color: var(--azul-noche); color: white; font-family: sans-serif; margin: 0; padding: 20px; }
        .contenedor-principal { max-width: 500px; margin: auto; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; border: 1px solid var(--dorado); }
        input { width: 100%; padding: 12px; margin: 8px 0; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box; text-transform: uppercase; }
        #correo { text-transform: none; }
        label { display: block; margin-top: 15px; color: var(--dorado); font-weight: bold; }
        .btn-accion { width: 100%; padding: 15px; background: var(--dorado); border: none; border-radius: 8px; color: var(--azul-noche); font-weight: bold; cursor: pointer; margin-top: 10px; }
        .preview-camara { width: 100%; max-width: 300px; border-radius: 10px; display: none; margin: 10px auto; border: 2px solid var(--dorado); background: #000; }
        .botones-nav { display: flex; gap: 10px; margin-top: 15px; }
        .btn-secundario { background-color: transparent; border: 1px solid var(--dorado); color: var(--dorado); }
        .seccion-formulario { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .loading-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; flex-direction: column; justify-content: center; align-items: center; color: var(--dorado); }
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--dorado); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

    <div id="loader" class="loading-overlay">
        <div class="spinner"></div>
        <p id="loaderTexto" style="margin-top: 15px;">PROCESANDO REGISTRO Y FOTOS...</p>
    </div>

    <div class="contenedor-principal">
        <h2 style="text-align: center;">Inscripción Oficial</h2>
        <p style="text-align: center; font-size: 0.8em; color: var(--dorado); margin-bottom: 20px;">NÁPOLES F.C. 2026</p>

        <form id="formularioRegistro">
            <!-- PASO 1: DATOS PERSONALES -->
            <div id="paso1" class="seccion-formulario">
                <label>Nombres Completos</label>
                <input type="text" id="nombre1" placeholder="Primer Nombre" required>
                <input type="text" id="nombre2" placeholder="Segundo Nombre" required>
                <input type="text" id="apellidos" placeholder="Apellidos Completos" required>
                <label>Identificación</label>
                <input type="text" id="cedula" placeholder="Cédula (10 dígitos)" maxlength="10" pattern="\d{10}" required>
                <button type="button" class="btn-accion" onclick="validarYPasar(1, 2)">Siguiente</button>
            </div>

            <!-- PASO 2: CONTACTO -->
            <div id="paso2" class="seccion-formulario" style="display: none;">
                <label>Fecha de Nacimiento</label>
                <input type="date" id="fechaNac" required>
                <label>Contacto Directo</label>
                <input type="tel" id="telefono" placeholder="WhatsApp" maxlength="10" pattern="0\d{9}" required>
                <input type="email" id="correo" placeholder="Correo Electrónico" required>
                <div class="botones-nav">
                    <button type="button" class="btn-accion btn-secundario" onclick="irAtras(2, 1)">Atrás</button>
                    <button type="button" class="btn-accion" onclick="validarYPasar(2, 3)">Siguiente: Fotos</button>
                </div>
            </div>

            <!-- PASO 3: MULTIMEDIA -->
            <div id="paso3" class="seccion-formulario" style="display: none;">
                <label>Verificación de Rostro</label>
                <video id="video" autoplay playsinline class="preview-camara"></video>
                <canvas id="canvas" style="display:none;"></canvas>
                <button type="button" id="btnCapturar" class="btn-accion" style="background: var(--dorado); color: var(--azul-noche); margin-bottom: 10px;">
                    📷 Capturar Rostro
                </button>
                <!-- Aquí es donde api.js busca la imagen -->
                <img id="fotoPreview" class="preview-camara">
                
                <label style="margin-top: 15px; display: block;">Foto de Cédula (Frontal)</label>
                <input type="file" id="fotoCedula" accept="image/*" required style="text-transform: none;">
                
                <div class="botones-nav">
                    <button type="button" class="btn-accion btn-secundario" onclick="irAtras(3, 2)">Atrás</button>
                    <button type="submit" id="btnFinalizar" class="btn-accion">FINALIZAR INSCRIPCIÓN</button>
                </div>
            </div>
        </form>
    </div>

    <!-- IMPORTANTE: El orden de los scripts importa -->
    <script>
        let stream;

        function validarYPasar(actual, siguiente) {
            const inputs = document.querySelectorAll(`#paso${actual} [required]`);
            let todoLleno = true;
            inputs.forEach(i => { if(!i.checkValidity()) { i.reportValidity(); todoLleno = false; } });
            if(todoLleno) {
                document.getElementById(`paso${actual}`).style.display = 'none';
                document.getElementById(`paso${siguiente}`).style.display = 'block';
                if(siguiente === 3) iniciarCamara();
            }
        }

        function irAtras(actual, anterior) {
            document.getElementById(`paso${actual}`).style.display = 'none';
            document.getElementById(`paso${anterior}`).style.display = 'block';
            if(actual === 3 && stream) stream.getTracks().forEach(t => t.stop());
        }

        async function iniciarCamara() {
            const video = document.getElementById('video');
            video.style.display = 'block';
            document.getElementById('fotoPreview').style.display = 'none';
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                video.srcObject = stream;
            } catch (e) { alert("Acceso a cámara denegado."); }
        }

        document.getElementById('btnCapturar').onclick = function() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            const preview = document.getElementById('fotoPreview');
            preview.src = dataUrl; // Esto es lo que lee api.js
            preview.style.display = 'block';
            video.style.display = 'none';
            if(stream) stream.getTracks().forEach(t => t.stop());
        };
    </script>

    <!-- CARGA DE TU ARCHIVO CENTRALIZADO -->
    <script src="api.js"></script>
</body>
</html>
