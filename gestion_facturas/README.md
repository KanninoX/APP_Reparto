# Modulo de Gestion de Facturas

## Responsabilidad
Proporciona acceso a los datos comerciales de cada pedido: direccion de
entrega, nombre del cliente, contacto telefonico, email y metodo de pago.

## Requisitos funcionales cubiertos
- **RF-02**: Consulta de factura con datos del cliente.
- **RF-14**: Gestion de facturas generadas por cada compra.

## API publica
- consultarFactura(facturaId) â€” Obtiene datos completos de una factura.
- obtenerDireccionEntrega(facturaId) â€” Direccion de destino.
- obtenerContactoCliente(facturaId) â€” Nombre, telefono y email.
- listarFacturas(sector) â€” Lista filtrada por zona geografica.
- egistrarFactura(datosFactura) â€” Alta de nueva factura.
