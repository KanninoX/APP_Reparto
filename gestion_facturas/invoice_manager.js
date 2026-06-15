/**
 * invoice_manager.js â€” Modulo de Gestion de Facturas
 * ===================================================
 * RFC-02: Consultar factura de cada pedido: direccion, nombre y contacto del cliente.
 * RFC-14: Gestionar facturas generadas por cada compra de cliente.
 *
 * Proporciona una capa de abstraccion sobre el catalogo de pedidos,
 * permitiendo al operario y al ejecutivo acceder a la informacion
 * comercial necesaria durante la ruta de reparto.
 */

"use strict";

// Datos de ejemplo simulando la integracion con el sistema de ventas del Retailer
const facturasStore = [
  {
    id: "INV-001",
    cliente: "Comercial del Sur S.A.",
    direccion: "Av. Siempre Viva 742, Santiago",
    contacto: "+56 9 1234 5678",
    email: "contacto@comercialsur.cl",
    metodoPago: "Transferencia",
    monto: 459000,
  },
  {
    id: "INV-002",
    cliente: "Distribuidora Norte Ltda.",
    direccion: "Calle Principal 150, Antofagasta",
    contacto: "+56 9 9876 5432",
    email: "ventas@distnorte.cl",
    metodoPago: "Contra entrega",
    monto: 1225000,
  },
  {
    id: "INV-003",
    cliente: "Minimarket El Amigo",
    direccion: "Pasaje Los Olivos 88, Valparaiso",
    contacto: "+56 9 5566 7788",
    email: "pedidos@elamigo.cl",
    metodoPago: "Tarjeta credito",
    monto: 234000,
  },
];

/**
 * Obtiene todos los datos de una factura por su identificador unico.
 * @param {string} facturaId â€” ID de la factura a consultar.
 * @returns {object|null} â€” Datos completos de la factura o null si no existe.
 */
export function consultarFactura(facturaId) {
  if (!facturaId) return null;
  return facturasStore.find((f) => f.id === facturaId) || null;
}

/**
 * Retorna la direccion de entrega asociada a una factura (RF-02).
 * @param {string} facturaId
 * @returns {string|null}
 */
export function obtenerDireccionEntrega(facturaId) {
  const factura = consultarFactura(facturaId);
  return factura ? factura.direccion : null;
}

/**
 * Retorna el nombre y datos de contacto del cliente (RF-02).
 * @param {string} facturaId
 * @returns {object|null} â€” Contiene {nombre, telefono, email}
 */
export function obtenerContactoCliente(facturaId) {
  const factura = consultarFactura(facturaId);
  if (!factura) return null;
  return {
    nombre: factura.cliente,
    telefono: factura.contacto,
    email: factura.email,
  };
}

/**
 * Lista todas las facturas asignadas a una ruta o sector.
 * @param {string} sector â€” Filtro opcional por zona geografica.
 * @returns {Array} â€” Lista de facturas.
 */
export function listarFacturas(sector) {
  if (!sector) return [...facturasStore];
  // Filtrado por sector contenido en la direccion (simplificado)
  return facturasStore.filter((f) =>
    f.direccion.toLowerCase().includes(sector.toLowerCase())
  );
}

/**
 * Registra una nueva factura en el sistema (RF-14).
 * @param {object} datosFactura â€” Objeto con los campos de la factura.
 * @returns {object} â€” Factura creada con su ID asignado.
 */
export function registrarFactura(datosFactura) {
  const nuevaFactura = {
    id: "INV-" + String(facturasStore.length + 1).padStart(3, "0"),
    ...datosFactura,
  };
  facturasStore.push(nuevaFactura);
  return nuevaFactura;
}
