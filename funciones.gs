// ==================== FUNCIONES.GS - BACKEND COMPARTIDO ====================
// Todas las funciones que conectan con Google Sheets

// Configuración
const HOJA_JUGADORES = "Jugadores";
const HOJA_ADMIN = "Administradores";

/**
 * Verifica credenciales de login
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña
 * @returns {Object} - Resultado con tipo de usuario y datos
 */
function verificarLogin(email, password) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    
    const datos = sheet.getDataRange().getValues();
    
    // Buscar jugador por correo y cédula (la cédula es la contraseña)
    for (let i = 1; i < datos.length; i++) {
      const correoBD = datos[i][7];  // Columna H: Correo
      const cedulaBD = String(datos[i][4]); // Columna E: Cédula (contraseña)
      
      if (correoBD === email && cedulaBD === password) {
        return {
          success: true,
          tipo: 'jugador',
          datos: {
            nombre: datos[i][1] + ' ' + datos[i][3],
            cedula: cedulaBD,
            dorsal: datos[i][17],
            estado: datos[i][10],
            email: correoBD
          }
        };
      }
    }
    
    // Verificar si es administrador
    const adminSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_ADMIN);
    if (adminSheet) {
      const admins = adminSheet.getDataRange().getValues();
      for (let i = 1; i < admins.length; i++) {
        if (admins[i][0] === email && admins[i][1] === password) {
          return {
            success: true,
            tipo: 'admin',
            datos: {
              nombre: admins[i][2] || 'Administrador',
              email: email
            }
          };
        }
      }
    }
    
    return { success: false, mensaje: "Credenciales incorrectas" };
  } catch (error) {
    return { success: false, mensaje: error.toString() };
  }
}

/**
 * Obtiene datos del perfil de un jugador
 * @param {string} cedula - Cédula del jugador
 * @returns {Object} - Datos completos del jugador
 */
function obtenerPerfilJugador(cedula) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    
    const datos = sheet.getDataRange().getValues();
    
    for (let i = 1; i < datos.length; i++) {
      if (String(datos[i][4]) === String(cedula)) {
        return {
          success: true,
          datos: {
            marcaTiempo: datos[i][0],
            primerNombre: datos[i][1],
            segundoNombre: datos[i][2],
            apellidos: datos[i][3],
            cedula: datos[i][4],
            fechaNacimiento: datos[i][5],
            telefono: datos[i][6],
            correo: datos[i][7],
            fotoRostro: datos[i][8],
            fotoCedula: datos[i][9],
            estado: datos[i][10],
            goles: datos[i][11],
            amarillas: datos[i][12],
            rojas: datos[i][13],
            deudaVocalia: datos[i][14],
            nombreCamiseta: datos[i][16],
            dorsal: datos[i][17],
            mediasExtras: datos[i][20],
            transaccionInscripcion: datos[i][21],
            transaccionUniforme: datos[i][22],
            inscripcionEstado: datos[i][23],
            uniformeEstado: datos[i][24],
            mediasEstado: datos[i][25],
            tallaUniforme: datos[i][26]
          }
        };
      }
    }
    
    return { success: false, mensaje: "Jugador no encontrado" };
  } catch (error) {
    return { success: false, mensaje: error.toString() };
  }
}

/**
 * Actualiza datos del perfil del jugador
 * @param {string} cedula - Cédula del jugador
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Object} - Resultado de la operación
 */
function actualizarPerfilJugador(cedula, datosActualizados) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    
    const datos = sheet.getDataRange().getValues();
    let filaEncontrada = -1;
    
    for (let i = 1; i < datos.length; i++) {
      if (String(datos[i][4]) === String(cedula)) {
        filaEncontrada = i + 1; // +1 porque las filas en sheet empiezan en 1
        break;
      }
    }
    
    if (filaEncontrada === -1) {
      return { success: false, mensaje: "Jugador no encontrado" };
    }
    
    // Actualizar campos permitidos
    if (datosActualizados.telefono) {
      sheet.getRange(filaEncontrada, 7).setValue(datosActualizados.telefono);
    }
    if (datosActualizados.correo) {
      sheet.getRange(filaEncontrada, 8).setValue(datosActualizados.correo);
    }
    if (datosActualizados.fotoRostro) {
      sheet.getRange(filaEncontrada, 9).setValue(datosActualizados.fotoRostro);
    }
    if (datosActualizados.nombreCamiseta) {
      sheet.getRange(filaEncontrada, 17).setValue(datosActualizados.nombreCamiseta);
    }
    if (datosActualizados.tallaUniforme) {
      sheet.getRange(filaEncontrada, 27).setValue(datosActualizados.tallaUniforme);
    }
    
    return { success: true, mensaje: "Perfil actualizado correctamente" };
  } catch (error) {
    return { success: false, mensaje: error.toString() };
  }
}

/**
 * Obtiene lista de todos los jugadores (solo para admin)
 * @returns {Array} - Lista de jugadores
 */
function obtenerTodosJugadores() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    
    const datos = sheet.getDataRange().getValues();
    const jugadores = [];
    
    for (let i = 1; i < datos.length; i++) {
      jugadores.push({
        id: i,
        primerNombre: datos[i][1],
        segundoNombre: datos[i][2],
        apellidos: datos[i][3],
        cedula: datos[i][4],
        telefono: datos[i][6],
        correo: datos[i][7],
        estado: datos[i][10],
        goles: datos[i][11],
        amarillas: datos[i][12],
        rojas: datos[i][13],
        dorsal: datos[i][17],
        inscripcionEstado: datos[i][23],
        uniformeEstado: datos[i][24]
      });
    }
    
    return { success: true, jugadores: jugadores };
  } catch (error) {
    return { success: false, mensaje: error.toString() };
  }
}

/**
 * Actualiza estado de pagos de un jugador (solo admin)
 * @param {string} cedula - Cédula del jugador
 * @param {string} campo - Campo a actualizar
 * @param {string} valor - Nuevo valor
 * @returns {Object} - Resultado
 */
function actualizarEstadoPago(cedula, campo, valor) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    
    const datos = sheet.getDataRange().getValues();
    let filaEncontrada = -1;
    
    for (let i = 1; i < datos.length; i++) {
      if (String(datos[i][4]) === String(cedula)) {
        filaEncontrada = i + 1;
        break;
      }
    }
    
    if (filaEncontrada === -1) {
      return { success: false, mensaje: "Jugador no encontrado" };
    }
    
    const columnas = {
      'inscripcion': 23,
      'uniforme': 24,
      'medias': 25
    };
    
    if (columnas[campo]) {
      sheet.getRange(filaEncontrada, columnas[campo]).setValue(valor);
      return { success: true, mensaje: "Estado actualizado" };
    }
    
    return { success: false, mensaje: "Campo no válido" };
  } catch (error) {
    return { success: false, mensaje: error.toString() };
  }
}

/**
 * Registra un nuevo jugador
 * @param {Object} datos - Datos del jugador
 * @returns {Object} - Resultado
 */
function registrarJugador(datos) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    
    // Verificar si la cédula ya existe
    const existentes = sheet.getDataRange().getValues();
    for (let i = 1; i < existentes.length; i++) {
      if (String(existentes[i][4]) === String(datos.cedula)) {
        return { ok: false, mensaje: "Esta cédula ya está registrada" };
      }
    }
    
    const fila = [
      new Date(),
      datos.primerNombre || "",
      datos.segundoNombre || "",
      datos.apellidos || "",
      datos.cedula || "",
      datos.fechaNacimiento || "",
      datos.telefono || "",
      datos.correo || "",
      datos.fotoRostro || "",
      datos.fotoCedula || "",
      "ACTIVO",
      0, 0, 0,
      "NO",
      "",
      datos.nombreCamiseta || "",
      datos.dorsal || "",
      "",
      "",
      datos.mediasExtras || "NO",
      datos.transaccionInscripcion || "",
      datos.transaccionUniforme || "",
      "PENDIENTE",
      "PENDIENTE",
      "PENDIENTE",
      datos.tallaUniforme || ""
    ];
    
    sheet.appendRow(fila);
    return { ok: true, mensaje: "Registro exitoso" };
  } catch (error) {
    return { ok: false, mensaje: error.toString() };
  }
}

/**
 * Obtiene dorsales ocupados
 * @returns {Array} - Lista de dorsales ocupados
 */
function obtenerDorsalesOcupados() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) return [];
    
    const datos = sheet.getDataRange().getValues();
    const ocupados = [];
    for (let i = 1; i < datos.length; i++) {
      const dorsal = datos[i][17];
      if (dorsal && dorsal.toString().trim() !== '') {
        ocupados.push(dorsal.toString());
      }
    }
    return ocupados;
  } catch (error) {
    return [];
  }
}

/**
 * Valida si una cédula ya existe
 * @param {string} cedula - Cédula a validar
 * @returns {Object} - Resultado
 */
function validarCedula(cedula) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_JUGADORES);
    if (!sheet) {
      throw new Error('La hoja "Jugadores" no existe');
    }
    const datos = sheet.getDataRange().getValues();
    for (let i = 1; i < datos.length; i++) {
      if (String(datos[i][4]) === String(cedula)) {
        return { existe: true };
      }
    }
    return { existe: false };
  } catch (error) {
    return { error: error.toString() };
  }
}
