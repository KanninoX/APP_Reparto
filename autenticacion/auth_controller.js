/**
 * auth_controller.js â€” Modulo de Autenticacion
 * =============================================
 * RFC-18: Validacion de credenciales por codigo de vehiculo + contrasena.
 * RFC-19: Verificacion del identificador unico del dispositivo movil.
 *
 * Este controlador centraliza la logica de ingreso al sistema,
 * asegurando que solo personal autorizado desde dispositivos
 * previamente registrados pueda acceder a los datos sensibles.
 */

"use strict";

// Repositorio simulado de operarios y dispositivos autorizados
// En produccion estos datos provienen de una base de datos segura.
const authStore = {
  operarios: [
    { codigoVehiculo: "VH-001", contrasena: "abc123", dispositivoId: "DEV-A100-XYZ" },
    { codigoVehiculo: "VH-002", contrasena: "def456", dispositivoId: "DEV-B200-WUV" },
    { codigoVehiculo: "VH-003", contrasena: "ghi789", dispositivoId: "DEV-C300-RST" },
  ],
  dispositivosAutorizados: new Set(["DEV-A100-XYZ", "DEV-B200-WUV", "DEV-C300-RST"]),
};

/**
 * Valida que el dispositivo este registrado en la plataforma.
 * @param {string} dispositivoId â€” IMEI o UUID unico del telefono.
 * @returns {boolean} â€” Verdadero si el dispositivo esta autorizado.
 */
function validarDispositivo(dispositivoId) {
  if (!dispositivoId || typeof dispositivoId !== "string") {
    return false;
  }
  return authStore.dispositivosAutorizados.has(dispositivoId);
}

/**
 * Autentica a un operario usando codigo de vehiculo y contrasena,
 * sujeto a que el dispositivo desde el que se conecta este autorizado.
 * @param {string} codigoVehiculo â€” Identificador del vehiculo asignado.
 * @param {string} contrasena â€” Contrasena del operario.
 * @param {string} dispositivoId â€” Identificador del telefono movil.
 * @returns {object} â€” Resultado con {exitoso, mensaje, operario?}.
 */
export function iniciarSesion(codigoVehiculo, contrasena, dispositivoId) {
  // Validacion de parametros obligatorios
  if (!codigoVehiculo || !contrasena || !dispositivoId) {
    return { exitoso: false, mensaje: "Credenciales incompletas." };
  }

  // Verificacion de dispositivo autorizado (RF-19)
  if (!validarDispositivo(dispositivoId)) {
    return {
      exitoso: false,
      mensaje:
        "Dispositivo no registrado. Contacte al Administrador para autorizar este equipo.",
    };
  }

  // Busqueda del operario por codigo de vehiculo (RF-18)
  const operario = authStore.operarios.find(
    (op) => op.codigoVehiculo === codigoVehiculo
  );

  if (!operario) {
    return { exitoso: false, mensaje: "Codigo de vehiculo inexistente." };
  }

  if (operario.contrasena !== contrasena) {
    return { exitoso: false, mensaje: "Contrasena incorrecta." };
  }

  // Autenticacion exitosa
  return {
    exitoso: true,
    mensaje: "Inicio de sesion exitoso.",
    operario: {
      codigoVehiculo: operario.codigoVehiculo,
    },
  };
}

/**
 * Registra un nuevo dispositivo en la lista de autorizados (RF-19).
 * Funcion exclusiva del perfil Administrador.
 * @param {string} dispositivoId â€” Nuevo ID de dispositivo a autorizar.
 */
export function autorizarDispositivo(dispositivoId) {
  if (!dispositivoId || typeof dispositivoId !== "string") {
    return { exitoso: false, mensaje: "ID de dispositivo invalido." };
  }
  authStore.dispositivosAutorizados.add(dispositivoId);
  return { exitoso: true, mensaje: "Dispositivo autorizado correctamente." };
}
