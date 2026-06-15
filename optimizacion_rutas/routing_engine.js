/**
 * routing_engine.js â€” Modulo de Optimizacion de Rutas
 * =====================================================
 * RFC-01: Visualizar y organizar la ruta asignada para el dia de trabajo.
 * RFC-13: Incorporar pedidos de ultimo momento en la ruta correspondiente.
 *
 * Implementa un algoritmo logico de ordenamiento por zonas geograficas
 * y soporta la insercion asincrona de pedidos de ultimo minuto,
 * manteniendo la coherencia de la secuencia de entregas.
 */

"use strict";

// Zonas geograficas predefinidas para la optimizacion
const ZONAS = ["NORTE", "CENTRO", "SUR", "ORIENTE", "PONIENTE"];

// Cola de pedidos de ultimo momento pendientes de insertar
let colaPedidosUrgentes = [];

// Mapa de rutas activas (vehiculo -> lista de paradas)
const rutasActivas = new Map();

/**
 * Ordena una lista de pedidos segun su zona geografica.
 * El ordenamiento por zonas reduce tiempos de traslado y combustible.
 * @param {Array} pedidos â€” Lista de objetos con campo {zona, ...}.
 * @returns {Array} â€” Pedidos ordenados por la secuencia optima de zonas.
 */
export function ordenarPorZona(pedidos) {
  if (!Array.isArray(pedidos) || pedidos.length === 0) return [];

  const zonaPrioridad = Object.fromEntries(ZONAS.map((z, i) => [z, i]));

  return [...pedidos].sort(
    (a, b) => (zonaPrioridad[a.zona] ?? 999) - (zonaPrioridad[b.zona] ?? 999)
  );
}

/**
 * Asigna una ruta a un vehiculo ordenando los pedidos por zona (RF-01).
 * @param {string} codigoVehiculo â€” Identificador del vehiculo.
 * @param {Array} pedidos â€” Pedidos a incluir en la ruta.
 * @returns {Array} â€” Ruta ordenada asignada.
 */
export function asignarRuta(codigoVehiculo, pedidos) {
  const rutaOrdenada = ordenarPorZona(pedidos);
  rutasActivas.set(codigoVehiculo, rutaOrdenada);
  return rutaOrdenada;
}

/**
 * Recupera la ruta activa de un vehiculo (RF-01).
 * @param {string} codigoVehiculo
 * @returns {Array} â€” Lista de paradas en orden.
 */
export function obtenerRuta(codigoVehiculo) {
  return rutasActivas.get(codigoVehiculo) || [];
}

/**
 * Inserta un pedido de ultimo momento en la ruta activa (RF-13).
 * La insercion es asincrona: retorna una promesa que se resuelve
 * cuando la sincronizacion con el dispositivo movil se completa.
 * @param {string} codigoVehiculo â€” Vehiculo cuya ruta se modificara.
 * @param {object} pedido â€” Pedido urgente a insertar.
 * @returns {Promise<object>} â€” Confirmacion de la actualizacion.
 */
export function insertarPedidoUrgente(codigoVehiculo, pedido) {
  return new Promise((resolve, reject) => {
    if (!rutasActivas.has(codigoVehiculo)) {
      return reject(new Error("Vehiculo sin ruta activa asignada."));
    }

    const ruta = rutasActivas.get(codigoVehiculo);

    // Determinar posicion de insercion: luego del ultimo pedido de la
    // misma zona geografica, o al final si no hay coincidencia.
    let indiceInsercion = ruta.length;
    for (let i = ruta.length - 1; i >= 0; i--) {
      if (ruta[i].zona === pedido.zona) {
        indiceInsercion = i + 1;
        break;
      }
    }

    // Agregar el pedido urgente a la cola para tracking
    colaPedidosUrgentes.push({ ...pedido, insertadoEn: new Date() });

    // Insertar en la posicion calculada
    ruta.splice(indiceInsercion, 0, pedido);
    rutasActivas.set(codigoVehiculo, ruta);

    // Simular latencia de sincronizacion en tiempo real
    setTimeout(() => {
      resolve({
        exitoso: true,
        mensaje: "Pedido urgente insertado en la ruta.",
        posicion: indiceInsercion,
        totalParadas: ruta.length,
      });
    }, 300);
  });
}

/**
 * Obtiene la cola de pedidos urgentes no sincronizados.
 * Util para el panel del ejecutivo (RF-13).
 * @returns {Array}
 */
export function obtenerColaUrgentes() {
  return [...colaPedidosUrgentes];
}
