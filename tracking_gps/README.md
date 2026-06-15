# Modulo de Tracking GPS

## Responsabilidad
Simula el monitoreo satelital en tiempo real de la flota en ruta,
registrando marcas de tiempo geolocalizadas para cada evento de
entrega y exponiendo el historial completo al Administrador.

## Requisitos funcionales cubiertos
- **RF-07**: Geolocalizacion automatica al capturar foto de factura.
- **RF-20**: Acceso completo a datos de localizacion de flota.

## API publica
- egistrarPosicion(codigoVehiculo, latitud, longitud) â€” Registro de coordenadas.
- ctivarGeolocalizacionEntrega(codigoVehiculo) â€” Captura GPS para entrega.
- obtenerHistorialFlota(codigoVehiculo) â€” Historial de posiciones.
- suscribirTracking(callback) â€” Suscripcion a actualizaciones en vivo.
