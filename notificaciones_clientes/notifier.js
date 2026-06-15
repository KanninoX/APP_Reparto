/**
 * notifier.js â€” Modulo de Notificaciones a Clientes
 * ===================================================
 * RFC-03: Notificar al cliente por SMS/email cuando el vehiculo se dirige a su destino.
 *
 * Implementa la logica de envio instantaneo de alertas de proximidad,
 * integrandose con servicios externos de mensajeria (SMS) y correo electronico.
 */

"use strict";

// Cola de notificaciones enviadas (auditoria)
const bitacoraNotificaciones = [];

/**
 * Simula el envio de un SMS a traves de la pasarela de mensajeria.
 * @param {string} telefono â€” Numero de destino.
 * @param {string} mensaje â€” Contenido del SMS.
 * @returns {Promise<object>} â€” Resultado del envio.
 */
function enviarSMS(telefono, mensaje) {
  return new Promise((resolve) => {
    // Simular latencia de la pasarela SMS (~500ms)
    setTimeout(() => {
      resolve({ exitoso: true, canal: "SMS", destino: telefono });
    }, 500);
  });
}

/**
 * Simula el envio de un correo electronico.
 * @param {string} email â€” Direccion de destino.
 * @param {string} asunto â€” Titulo del correo.
 * @param {string} cuerpo â€” Contenido HTML o texto plano.
 * @returns {Promise<object>} â€” Resultado del envio.
 */
function enviarEmail(email, asunto, cuerpo) {
  return new Promise((resolve) => {
    // Simular latencia del servicio SMTP (~800ms)
    setTimeout(() => {
      resolve({ exitoso: true, canal: "EMAIL", destino: email });
    }, 800);
  });
}

/**
 * Envia una notificacion de proximidad al cliente (RF-03).
 * El sistema dispara automaticamente este metodo cuando el GPS del
 * repartidor indica que esta a menos de 5 minutos del destino.
 * @param {object} cliente â€” Contiene {nombre, telefono, email}.
 * @param {string} direccion â€” Direccion de entrega para el mensaje.
 * @returns {Promise<object>} â€” Resumen de las notificaciones enviadas.
 */
export async function notificarProximidad(cliente, direccion) {
  if (!cliente || !direccion) {
    throw new Error("Datos de cliente y direccion son obligatorios.");
  }

  const asunto = "Su pedido esta en camino";
  const cuerpoSMS = Hola , su pedido con destino a  esta siendo entregado. Nuestro repartidor llegara en breve.;
  const cuerpoEmail = 
    <h1>Notificacion de entrega</h1>
    <p>Estimado(a) ,</p>
    <p>Le informamos que nuestro repartidor se dirige a la direccion <strong></strong> para realizar la entrega de su pedido.</p>
    <p>Por favor, tenga a mano su factura para la firma correspondiente.</p>
    <p>Gracias por preferirnos.</p>
  ;

  // Disparar notificaciones en paralelo para minimizar latencia
  const resultados = await Promise.allSettled([
    enviarSMS(cliente.telefono, cuerpoSMS),
    enviarEmail(cliente.email, asunto, cuerpoEmail),
  ]);

  const resumen = {
    cliente: cliente.nombre,
    direccion,
    sms: resultados[0].status === "fulfilled" ? resultados[0].value : null,
    email: resultados[1].status === "fulfilled" ? resultados[1].value : null,
    timestamp: new Date().toISOString(),
  };

  bitacoraNotificaciones.push(resumen);
  return resumen;
}

/**
 * Consulta la bitacora de notificaciones enviadas.
 * @param {string} cliente â€” Filtro opcional por nombre de cliente.
 * @returns {Array} â€” Historial de notificaciones.
 */
export function consultarBitacora(cliente) {
  if (!cliente) return [...bitacoraNotificaciones];
  return bitacoraNotificaciones.filter((n) =>
    n.cliente.toLowerCase().includes(cliente.toLowerCase())
  );
}
