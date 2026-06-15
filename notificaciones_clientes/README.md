# Modulo de Notificaciones a Clientes

## Responsabilidad
Dispara alertas instantaneas de proximidad via SMS y correo electronico
cuando el vehiculo del repartidor se aproxima al destino del cliente.

## Requisitos funcionales cubiertos
- **RF-03**: Notificacion automatica al cliente por SMS/email.

## API publica
- 
otificarProximidad(cliente, direccion) â€” Envia notificaciones de proximidad.
- consultarBitacora(cliente) â€” Historial de notificaciones enviadas.
