# Modulo de Optimizacion de Rutas

## Responsabilidad
Ordena las secuencias de entrega por zonas geograficas para minimizar
tiempos de traslado y permite la insercion asincrona de pedidos de
ultimo momento directamente en la ruta activa.

## Requisitos funcionales cubiertos
- **RF-01**: Visualizar y organizar la ruta asignada.
- **RF-13**: Incorporar pedidos de ultimo momento.

## API publica
- ordenarPorZona(pedidos) â€” Ordena pedidos por zona geografica.
- signarRuta(codigoVehiculo, pedidos) â€” Asigna ruta ordenada a un vehiculo.
- obtenerRuta(codigoVehiculo) â€” Recupera ruta activa.
- insertarPedidoUrgente(codigoVehiculo, pedido) â€” Insercion asincrona.
- obtenerColaUrgentes() â€” Pedidos urgentes pendientes.
