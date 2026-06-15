# Modulo de Autenticacion

## Responsabilidad
Controla el ingreso al sistema mediante validacion de credenciales
(codigo de vehiculo + contrasena) y verificacion del identificador
unico del dispositivo movil.

## Requisitos funcionales cubiertos
- **RF-18**: Gestion de login (usuario: codigo de vehiculo + contrasena).
- **RF-19**: Autorizacion de dispositivos moviles por el Administrador.

## API publica
- iniciarSesion(codigoVehiculo, contrasena, dispositivoId) â€” Autentica al operario.
- utorizarDispositivo(dispositivoId) â€” Registra un nuevo dispositivo autorizado.
