/**
 * tracker.js â€” Modulo de Tracking GPS
 * =====================================
 * RFC-07: Activar geolocalizacion automatica al capturar foto de factura.
 * RFC-20: Acceso completo a datos de localizacion de flota (Administrador).
 *
 * Simula el monitoreo satelital en tiempo real de la flota en ruta,
 * registrando marcas de tiempo geolocalizadas para cada evento de entrega.
 */

"use strict";

// Historial de posiciones registradas por vehiculo
const historialGPS = new Map();

// Suscriptores para actualizaciones en tiempo real
const subscriptores = [];

/**
 * Registra una posicion geografica para un vehiculo en un instante dado.
 * @param {string} codigoVehiculo
 * @param {number} latitud
 * @param {number} longitud
 * @returns {object} â€” Marca de tiempo registrada.
 */
export function registrarPosicion(codigoVehiculo, latitud, longitud) {
  if (!codigoVehiculo || latitud == null || longitud == null) {
    throw new Error("Parametros de geolocalizacion invalidos.");
  }

  const marca = {
    timestamp: new Date().toISOString(),
    latitud,
    longitud,
    vehiculo: codigoVehiculo,
  };

  if (!historialGPS.has(codigoVehiculo)) {
    historialGPS.set(codigoVehiculo, []);
  }
  historialGPS.get(codigoVehiculo).push(marca);

  // Notificar a subscriptores en tiempo real
  subscriptores.forEach((cb) => cb(marca));

  return marca;
}

/**
 * Activa la geolocalizacion automatica asociada a una accion de entrega (RF-07).
 * Utilizada al capturar la fotografia de la factura firmada.
 * @param {string} codigoVehiculo
 * @returns {Promise<object>} â€” Posicion actual obtenida via GPS.
 */
export function activarGeolocalizacionEntrega(codigoVehiculo) {
  return new Promise((resolve) => {
    // Simular lectura del sensor GPS del dispositivo movil
    const latitud = -33.456 + Math.random() * 0.01;
    const longitud = -70.648 + Math.random() * 0.01;
    const marca = registrarPosicion(codigoVehiculo, latitud, longitud);
    resolve(marca);
  });
}

/**
 * Obtiene el historial completo de posiciones de la flota (RF-20).
 * Disponible exclusivamente para el perfil Administrador.
 * @param {string} codigoVehiculo â€” Opcional: filtrar por vehiculo.
 * @returns {object} â€” Historial de geolocalizaciones.
 */
export function obtenerHistorialFlota(codigoVehiculo) {
  if (codigoVehiculo) {
    return { [codigoVehiculo]: historialGPS.get(codigoVehiculo) || [] };
  }
  // Retornar todos los vehiculos
  const completo = {};
  for (const [vehiculo, registros] of historialGPS.entries()) {
    completo[vehiculo] = registros;
  }
  return completo;
}

/**
 * Suscribe una funcion callback para recibir actualizaciones GPS en vivo.
 * @param {Function} callback â€” Recibe el objeto {timestamp, latitud, longitud, vehiculo}.
 * @returns {Function} â€” Funcion para cancelar la suscripcion.
 */
export function suscribirTracking(callback) {
  subscriptores.push(callback);
  return () => {
    const idx = subscriptores.indexOf(callback);
    if (idx !== -1) subscriptores.splice(idx, 1);
  };
}
