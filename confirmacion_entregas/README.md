# Modulo de Confirmacion de Entregas

## Responsabilidad
Implementa la maquina de estados finitos para el ciclo de vida de una
entrega (PENDIENTE, EN_RUTA, LOGRADO, FALLIDO, REAGENDADO), forzando
la captura de evidencia fotografica y su almacenamiento en la nube.

## Requisitos funcionales cubiertos
- **RF-04**: Registro de resultado Logrado/Fallido con razon seleccionable.
- **RF-06**: Subida de fotografia de factura firmada a la nube.

## API publica
- iniciarEntrega(facturaId, codigoVehiculo) â€” Crea registro de entrega.
- confirmarEntregaLograda(facturaId, urlFoto) â€” Cierra como exitosa.
- confirmarEntregaFallida(facturaId, razon, comentario, reagendar) â€” Cierra como fallida.
- consultarEstadoEntrega(facturaId) â€” Consulta estado actual.
- obtenerRazonesFallido() â€” Lista de motivos de fallo disponibles.
- obtenerEstados() â€” Constantes de estado de la maquina.
