# Canelones Pro - Backend API

Backend en .NET 9 Web API para la aplicación de gestión de recolección de residuos de Canelones.

## 🏗️ Arquitectura

- **Framework**: .NET 9 Web API
- **Base de Datos**: Azure Table Storage
- **Autenticación**: (Por implementar)
- **Documentación**: OpenAPI/Swagger

## 📂 Estructura del Proyecto

```
backend/
├── Controllers/              # Endpoints de la API
│   ├── CollectorsController.cs
│   ├── VehiclesController.cs
│   ├── HouseholdsController.cs
│   ├── SessionsController.cs
│   ├── RatingsController.cs
│   └── DashboardController.cs
├── Models/                   # Entidades de Table Storage
│   ├── CollectorEntity.cs
│   ├── VehicleEntity.cs
│   ├── HouseholdEntity.cs
│   ├── CollectionSessionEntity.cs
│   └── RatingEntity.cs
├── DTOs/                     # Data Transfer Objects
│   ├── CollectorDtos.cs
│   ├── VehicleDtos.cs
│   ├── HouseholdDtos.cs
│   ├── CollectionSessionDtos.cs
│   ├── RatingDtos.cs
│   └── DashboardDtos.cs
├── Services/                 # Lógica de negocio
│   ├── CollectorService.cs
│   ├── VehicleService.cs
│   ├── HouseholdService.cs
│   ├── CollectionSessionService.cs
│   ├── RatingService.cs
│   └── DashboardService.cs
├── Program.cs                # Configuración de la aplicación
└── appsettings.json          # Configuración (con connection string)
```

## 🚀 Ejecutar el Proyecto

### Requisitos Previos

- .NET 9 SDK o superior
- Azure Storage Account (o usar el emulador local)

### Configuración

El connection string de Azure Storage ya está configurado en `appsettings.json`:

```json
{
  "AzureStorage": {
    "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=storagetestarauco;..."
  }
}
```

### Ejecutar en Desarrollo

```bash
cd backend
dotnet run
```

La API estará disponible en:
- **HTTPS**: https://localhost:7XXX (puerto asignado automáticamente)
- **HTTP**: http://localhost:5XXX (puerto asignado automáticamente)
- **Swagger UI**: https://localhost:7XXX/swagger

## 📋 API Endpoints

### Collectors (Recolectores)

- `GET /api/collectors` - Obtener todos los recolectores
- `GET /api/collectors/{id}` - Obtener recolector por ID
- `POST /api/collectors` - Crear nuevo recolector
- `PUT /api/collectors/{id}` - Actualizar recolector
- `DELETE /api/collectors/{id}` - Eliminar recolector

### Vehicles (Vehículos)

- `GET /api/vehicles` - Obtener todos los vehículos
- `GET /api/vehicles/{id}` - Obtener vehículo por ID
- `POST /api/vehicles` - Crear nuevo vehículo
- `PUT /api/vehicles/{id}` - Actualizar vehículo
- `DELETE /api/vehicles/{id}` - Eliminar vehículo

### Households (Hogares)

- `GET /api/households` - Obtener todos los hogares
- `GET /api/households/{id}` - Obtener hogar por ID
- `GET /api/households/by-qr/{qrCode}` - Buscar hogar por código QR
- `POST /api/households` - Crear nuevo hogar
- `PUT /api/households/{id}` - Actualizar hogar
- `DELETE /api/households/{id}` - Eliminar hogar

### Sessions (Sesiones de Recolección)

- `GET /api/sessions` - Obtener todas las sesiones
- `GET /api/sessions/active` - Obtener sesiones activas
- `GET /api/sessions/{id}` - Obtener sesión por ID
- `GET /api/sessions/by-collector/{collectorId}` - Obtener sesiones por recolector
- `POST /api/sessions` - Crear nueva sesión
- `POST /api/sessions/{id}/end` - Finalizar sesión

### Ratings (Calificaciones)

- `GET /api/ratings` - Obtener todas las calificaciones
- `GET /api/ratings/{householdId}/{ratingId}` - Obtener calificación específica
- `GET /api/ratings/by-household/{householdId}` - Calificaciones por hogar
- `GET /api/ratings/by-collector/{collectorId}` - Calificaciones por recolector
- `GET /api/ratings/by-session/{sessionId}` - Calificaciones por sesión
- `POST /api/ratings` - Crear nueva calificación

### Dashboard

- `GET /api/dashboard/stats` - Obtener estadísticas del dashboard

## 🗄️ Modelo de Datos

### Collector (Recolector)
```json
{
  "id": "RM",
  "name": "Ricardo Morales",
  "document": "4.521.890-2",
  "shift": "Mañana",
  "status": "Activo"
}
```

### Vehicle (Vehículo)
```json
{
  "id": "MT-1024",
  "type": "Carga Trasera",
  "capacity": "15.0 t",
  "status": "Operativo",
  "statusColor": "green"
}
```

### Household (Hogar)
```json
{
  "id": "ID-8829-X",
  "address": "Calle Los Álamos 452",
  "zone": "Zona Norte",
  "qrCode": "QR123456",
  "totalCollections": 45,
  "goodRatings": 38,
  "regularRatings": 5,
  "badRatings": 2
}
```

### CollectionSession (Sesión de Recolección)
```json
{
  "id": "guid",
  "collectorId": "RM",
  "collectorName": "Ricardo Morales",
  "vehicleId": "MT-1024",
  "startTime": "2026-03-28T10:00:00Z",
  "endTime": null,
  "status": "Active",
  "totalCollections": 12
}
```

### Rating (Calificación)
```json
{
  "id": "timestamp-based-id",
  "householdId": "ID-8829-X",
  "householdAddress": "Calle Los Álamos 452",
  "collectorId": "RM",
  "collectorName": "Ricardo Morales",
  "sessionId": "session-guid",
  "rating": "good",
  "notes": "Optional notes",
  "collectionDate": "2026-03-28T11:30:00Z"
}
```

## 🔧 CORS

El API está configurado con CORS permitiendo todas las origines para desarrollo. Esto permite que tanto la aplicación web (React) como la mobile (React Native) puedan consumir la API.

**Nota**: En producción, se debe restringir CORS a los dominios específicos de las aplicaciones.

## 🔒 Seguridad

### Estado Actual (Desarrollo)
- Connection string en `appsettings.json`
- Sin autenticación/autorización

### Próximos Pasos
- [ ] Mover connection string a Azure Key Vault
- [ ] Implementar autenticación con JWT
- [ ] Agregar autorización basada en roles
- [ ] Implementar rate limiting
- [ ] Agregar validación de datos de entrada

## 📊 Azure Table Storage

El proyecto utiliza Azure Table Storage que automáticamente crea las siguientes tablas:

- `Collectors` - Recolectores
- `Vehicles` - Vehículos
- `Households` - Hogares
- `CollectionSessions` - Sesiones de recolección
- `Ratings` - Calificaciones

Las tablas se crean automáticamente la primera vez que se ejecuta el servicio correspondiente.

## 🧪 Testing

### Probar con Swagger
1. Ejecuta `dotnet run`
2. Navega a `https://localhost:7XXX/swagger`
3. Prueba los endpoints interactivamente

### Probar con curl

```bash
# Crear un recolector
curl -X POST https://localhost:7XXX/api/collectors \
  -H "Content-Type: application/json" \
  -d '{
    "id": "RM",
    "name": "Ricardo Morales",
    "document": "4.521.890-2",
    "shift": "Mañana"
  }'

# Obtener todos los recolectores
curl https://localhost:7XXX/api/collectors
```

## 📝 Próximas Funcionalidades

- [ ] Autenticación y autorización
- [ ] Paginación en listados
- [ ] Filtros avanzados
- [ ] Reportes y exportación de datos
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Geocodificación de direcciones
- [ ] Integración con mapas
- [ ] Notificaciones push
- [ ] Logs y monitoreo con Application Insights
