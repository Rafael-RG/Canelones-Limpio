# 🚀 Guía Rápida - Backend Canelones Pro

## ⚡ Inicio Rápido

### 1. Ejecutar el Backend

```bash
cd backend/backend
dotnet run
```

O especificando los puertos:

```bash
dotnet run --urls "https://localhost:7001;http://localhost:5001"
```

### 2. Acceder a la Documentación

Una vez iniciado el backend, abre tu navegador en:

- **Swagger UI**: https://localhost:7001 o http://localhost:5001

### 3. Probar los Endpoints

#### Crear un Recolector
```bash
curl -X POST https://localhost:7001/api/collectors \
  -H "Content-Type: application/json" \
  -d '{
    "id": "RM",
    "name": "Ricardo Morales",
    "document": "4.521.890-2",
    "shift": "Mañana"
  }' -k
```

#### Obtener todos los Recolectores
```bash
curl https://localhost:7001/api/collectors -k
```

#### Crear un Vehículo
```bash
curl -X POST https://localhost:7001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "id": "MT-1024",
    "type": "Carga Trasera",
    "capacity": "15.0 t"
  }' -k
```

#### Crear un Hogar
```bash
curl -X POST https://localhost:7001/api/households \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ID-8829-X",
    "address": "Calle Los Álamos 452",
    "zone": "Zona Norte",
    "qrCode": "QR123456"
  }' -k
```

#### Iniciar una Sesión de Recolección
```bash
curl -X POST https://localhost:7001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "collectorId": "RM",
    "collectorName": "Ricardo Morales",
    "vehicleId": "MT-1024"
  }' -k
```

#### Crear una Calificación
```bash
curl -X POST https://localhost:7001/api/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "householdId": "ID-8829-X",
    "collectorId": "RM",
    "sessionId": "<session-id-from-previous-step>",
    "rating": "good",
    "notes": "Excelente separación de residuos"
  }' -k
```

#### Obtener Estadísticas del Dashboard
```bash
curl https://localhost:7001/api/dashboard/stats -k
```

## 📋 Endpoints Disponibles

### Collectors (Recolectores)
- `GET /api/collectors` - Listar todos
- `GET /api/collectors/{id}` - Obtener por ID
- `POST /api/collectors` - Crear nuevo
- `PUT /api/collectors/{id}` - Actualizar
- `DELETE /api/collectors/{id}` - Eliminar

### Vehicles (Vehículos)
- `GET /api/vehicles` - Listar todos
- `GET /api/vehicles/{id}` - Obtener por ID
- `POST /api/vehicles` - Crear nuevo
- `PUT /api/vehicles/{id}` - Actualizar
- `DELETE /api/vehicles/{id}` - Eliminar

### Households (Hogares)
- `GET /api/households` - Listar todos
- `GET /api/households/{id}` - Obtener por ID
- `GET /api/households/by-qr/{qrCode}` - Buscar por QR
- `POST /api/households` - Crear nuevo
- `PUT /api/households/{id}` - Actualizar
- `DELETE /api/households/{id}` - Eliminar

### Sessions (Sesiones)
- `GET /api/sessions` - Listar todas
- `GET /api/sessions/active` - Listar activas
- `GET /api/sessions/{id}` - Obtener por ID
- `GET /api/sessions/by-collector/{collectorId}` - Por recolector
- `POST /api/sessions` - Crear nueva
- `POST /api/sessions/{id}/end` - Finalizar sesión

### Ratings (Calificaciones)
- `GET /api/ratings` - Listar todas
- `GET /api/ratings/by-household/{householdId}` - Por hogar
- `GET /api/ratings/by-collector/{collectorId}` - Por recolector
- `GET /api/ratings/by-session/{sessionId}` - Por sesión
- `POST /api/ratings` - Crear nueva

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales

## 🗄️ Base de Datos

El backend utiliza **Azure Table Storage** con las siguientes tablas:

- `Collectors` - Recolectores
- `Vehicles` - Vehículos
- `Households` - Hogares
- `CollectionSessions` - Sesiones de recolección
- `Ratings` - Calificaciones

Las tablas se crean automáticamente la primera vez que se usa cada servicio.

## 🔧 Configuración

El connection string de Azure Storage está en `appsettings.json`:

```json
{
  "AzureStorage": {
    "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=storagetestarauco;..."
  }
}
```

## 🌐 CORS

El backend está configurado con CORS habilitado para todas las origines, lo que permite que tanto la web como la aplicación móvil puedan consumir la API.

## 📱 Conectar con el Frontend

### Web (React + Vite)
Actualiza la URL base en `web/src/services/apiService.js`:

```javascript
const API_URL = 'https://localhost:7001/api';
```

### Mobile (React Native)
Actualiza la URL base en `mobile/services/apiService.js`:

```javascript
// Para Android Emulator
const API_URL = 'https://10.0.2.2:7001/api';

// Para dispositivo físico, usa la IP de tu computadora
const API_URL = 'https://192.168.x.x:7001/api';
```

## 🐛 Troubleshooting

### Error: "Azure Storage connection string is not configured"
- Verifica que `appsettings.json` tenga el connection string correcto

### Error de CORS
- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- Verifica que CORS esté habilitado en `Program.cs`

### Swagger no abre
- Asegúrate de estar usando el puerto correcto (7001 o 5001)
- Verifica que estés en modo Development

## 📦 Próximos Pasos

1. [✅] Backend creado y funcional
2. [ ] Integrar con el frontend web
3. [ ] Integrar con la aplicación móvil
4. [ ] Agregar autenticación
5. [ ] Implementar paginación
6. [ ] Agregar filtros avanzados
7. [ ] Implementar caché
8. [ ] Agregar logs y monitoreo
