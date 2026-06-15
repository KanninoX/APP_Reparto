/**
 * delivery_validator.js â€” Modulo de Confirmacion de Entregas
 * ============================================================
 * RFC-04: Registrar resultado de entrega: Logrado o Fallido con razon seleccionable.
 * RFC-06: Subir fotografia de la factura fisica con firma del cliente (respaldo en nube).
 *
 * Disena una maquina de estados finitos para el ciclo de vida de una entrega,
 * forzando la captura de evidencia fotografica y almacenamiento en la nube
 * antes de cerrar el ciclo de la orden.
 */

"use strict";

// Estados posibles de una entrega
const ESTADOS = Object.freeze({
  PENDIENTE: "PENDIENTE",
  EN_RUTA: "EN_RUTA",
  LOGRADO: "LOGRADO",
  FALLIDO: "FALLIDO",
  REAGENDADO: "REAGENDADO",
});

// Causas predefinidas para entregas fallidas (RF-04)
const RAZONES_FALLIDO = [
  "Cliente ausente",
  "Direccion incorrecta",
  "Rechazo del cliente",
  "Horario no disponible",
  "Problema de seguridad en la zona",
  "Documentacion incompleta",
];

// Repositorio de entregas
const entregasStore = new Map();

/**
 * Inicializa el registro de una nueva entrega en estado PENDIENTE.
 * @param {string} facturaId â€” Factura asociada a la entrega.
 * @param {string} codigoVehiculo â€” Repartidor asignado.
 * @returns {object} â€” Registro de entrega creado.
 */
export function iniciarEntrega(facturaId, codigoVehiculo) {
  if (!facturaId || !codigoVehiculo) {
    throw new Error("Factura y vehiculo son obligatorios.");
  }

  const registro = {
    facturaId,
    codigoVehiculo,
    estado: ESTADOS.PENDIENTE,
    fotoEvidencia: null,
    razonFallido: null,
    comentario: null,
    reagendar: false,
    timestampCreacion: new Date().toISOString(),
    timestampCierre: null,
  };

  entregasStore.set(facturaId, registro);
  return registro;
}

/**
 * Marca una entrega como LOGRADO (RF-04).
 * Requiere que la foto de la factura firmada haya sido subida (RF-06).
 * @param {string} facturaId
 * @param {string} urlFoto â€” URL de la foto almacenada en la nube.
 * @returns {object} â€” Registro actualizado.
 */
export function confirmarEntregaLograda(facturaId, urlFoto) {
  if (!facturaId) throw new Error("Factura ID requerido.");
  if (!urlFoto) {
    throw new Error(
      "Debe capturar y subir la foto de la factura firmada antes de confirmar la entrega (RF-06)."
    );
  }

  if (!entregasStore.has(facturaId)) {
    throw new Error("Entrega no registrada. Ejecute iniciarEntrega() primero.");
  }

  const registro = entregasStore.get(facturaId);
  registro.estado = ESTADOS.LOGRADO;
  registro.fotoEvidencia = urlFoto;
  registro.timestampCierre = new Date().toISOString();
  entregasStore.set(facturaId, registro);

  return registro;
}

/**
 * Marca una entrega como FALLIDO (RF-04).
 * @param {string} facturaId
 * @param {string} razon â€” Motivo del fallo (debe estar en RAZONES_FALLIDO).
 * @param {string} comentario â€” Observacion adicional del repartidor.
 * @param {boolean} reagendar â€” Indica si el cliente desea reagendar.
 * @returns {object} â€” Registro actualizado.
 */
export function confirmarEntregaFallida(
  facturaId,
  razon,
  comentario,
  reagendar
) {
  if (!facturaId) throw new Error("Factura ID requerido.");

  if (!RAZONES_FALLIDO.includes(razon)) {
    throw new Error(
      Razon de fallo invalida. Opciones: 
    );
  }

  if (!entregasStore.has(facturaId)) {
    throw new Error("Entrega no registrada.");
  }

  const registro = entregasStore.get(facturaId);
  registro.estado = reagendar ? ESTADOS.REAGENDADO : ESTADOS.FALLIDO;
  registro.razonFallido = razon;
  registro.comentario = comentario || "";
  registro.reagendar = Boolean(reagendar);
  registro.timestampCierre = new Date().toISOString();
  entregasStore.set(facturaId, registro);

  return registro;
}

/**
 * Consulta el estado actual de una entrega.
 * @param {string} facturaId
 * @returns {object|null}
 */
export function consultarEstadoEntrega(facturaId) {
  return entregasStore.get(facturaId) || null;
}

/**
 * Obtiene el listado de razones disponibles para entrega fallida.
 * @returns {string[]}
 */
export function obtenerRazonesFallido() {
  return [...RAZONES_FALLIDO];
}

/**
 * Obtiene las constantes de estado para uso en otros modulos.
 * @returns {object}
 */
export function obtenerEstados() {
  return { ...ESTADOS };
}
