<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1.  Clonar proyecto
2.  npm install
3.  Clonar el archivo .env.template y renombrarlo a .env
4.  Cambiar variables de entorno
5.  Levantar base de datos

```
docker-compose up -d
```

### Stack usado

- MongoDb
- Nest

## HttpAdapter

El `HttpAdapter` es un servicio personalizado que encapsula la lógica para realizar solicitudes HTTP a APIs externas. Proporciona métodos como `get`, `post`, `put`, y `delete` para interactuar con endpoints externos.

### Uso

```typescript
// Ejemplo de uso en un servicio:
const data = await httpAdapter.get('https://api.externa.com/endpoint');
```
