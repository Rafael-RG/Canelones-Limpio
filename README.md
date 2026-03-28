# Canelones Limpio

Sistema completo de gestión de recolección de residuos para el departamento de Canelones, con aplicación móvil para recolectores, dashboard web para administración y backend API en .NET.

## 📱 Estructura del Proyecto

```
canelones-limpio/
├── backend/         # Backend API (.NET 9 + Azure Storage)
├── mobile/          # Aplicación móvil (React Native + Expo)
├── web/             # Aplicación web (React + Vite)
├── mcp-config.json  # Configuración del servidor MCP de Stitch
└── README.md
```

## 🚀 Inicio Rápido

### 1. Backend API (Requerido)

Primero, inicia el backend:

```bash
cd backend
dotnet run
```

La API estará disponible en:
- **HTTPS**: https://localhost:7001
- **HTTP**: http://localhost:5001
- **Swagger UI**: https://localhost:7001

Ver más detalles en [backend/QUICKSTART.md](backend/QUICKSTART.md)

### 2. Aplicación Web

En otra terminal, inicia el frontend web:

```bash
cd web
npm install      # Solo la primera vez
npm run dev
```

La aplicación web estará disponible en http://localhost:3001

Ver más detalles en [web/README.md](web/README.md)

### 3. Aplicación Móvil (Opcional)

```bash
cd mobile
npm install      # Solo la primera vez
npm start
```

Luego escanea el código QR con la app Expo Go en tu teléfono.

## ⚡ Inicio Ultra Rápido

Si quieres iniciar todo de una vez, desde la carpeta raíz:

```bash
# Terminal 1 - Backend
cd backend && dotnet run

# Terminal 2 - Frontend Web (en otra ventana)
cd web && npm run dev

# Terminal 3 - Mobile (opcional, en otra ventana)
cd mobile && npm start
```

## 🏗️ Arquitectura

### Backend (.NET 9)
- **Framework**: ASP.NET Core Web API
- **Base de Datos**: Azure Table Storage
- **Autenticación**: (Por implementar)
- **Documentación**: OpenAPI/Swagger

### Frontend Web (React)
- Panel administrativo
- Gestión de recolectores, vehículos y hogares
- Dashboard con estadísticas en tiempo real
- Visualización de mapas de rutas

### Frontend Mobile (React Native)
- Aplicación para recolectores
- Escaneo QR de viviendas
- Calificación de recolección (Buena/Regular/Mala)
- Gestión de sesiones de trabajo
- Historial de recolecciones

## 🗄️ Modelo de Datos

- **Collectors**: Recolectores (ID, nombre, documento, turno, estado)
- **Vehicles**: Vehículos (ID, tipo, capacidad, estado)
- **Households**: Hogares (ID, dirección, zona, código QR, estadísticas)
- **CollectionSessions**: Sesiones de recolección (recolector, vehículo, hora inicio/fin)
- **Ratings**: Calificaciones de recolección (hogar, recolector, calificación, fecha)

## ✅ Estado de Integración

### Backend ✅
- [x] API REST completa
- [x] Azure Table Storage configurado
- [x] CORS habilitado
- [x] Swagger documentado
- [x] Todos los endpoints funcionando

### Frontend Web ✅
- [x] Integrado con backend
- [x] Dashboard con estadísticas reales
- [x] CRUD de recolectores
- [x] CRUD de vehículos
- [x] CRUD de viviendas
- [x] Manejo de estados de carga
- [x] Manejo de errores

### Frontend Mobile 🔜
- [ ] Integración con backend pendiente
- [ ] Actualmente usa datos mock

## 🎯 Flujo de Trabajo

1. **Backend** expone API REST en `https://localhost:7001/api`
2. **Frontend Web** consume API y muestra datos en dashboard administrativo
3. **Frontend Mobile** (próximo) permitirá a recolectores:
   - Escanear QR de viviendas
   - Calificar recolecciones
   - Gestionar sesiones de trabajo

## 🎨 Integración con Stitch

Este proyecto usa diseños creados en Google Stitch. La configuración del servidor MCP está en `mcp-config.json`.

### Configuración de la API Key

1. Copia el archivo `.env.example` a `.env` en la raíz del proyecto
2. Reemplaza `tu_clave_api_aqui` con tu clave API de Stitch
3. **IMPORTANTE**: Nunca subas la clave API al repositorio

## 📦 Tecnologías Utilizadas

### Backend
- .NET 9
- ASP.NET Core Web API
- Azure Table Storage
- Swashbuckle (Swagger/OpenAPI)

### Móvil
- React Native
- Expo Go
- JavaScript/React

### Web
- React 18
- Vite
- CSS3

## 🔐 Seguridad

- El archivo `mcp-config.json` está en `.gitignore` para proteger tu clave API
- Usa variables de entorno para datos sensibles
- No compartas tu clave API públicamente

## 📝 Próximos Pasos

1. Instalar dependencias en ambos proyectos
2. Configurar las variables de entorno
3. Integrar los diseños de Stitch
4. Desarrollar las funcionalidades principales
5. Probar en dispositivos móviles y navegadores

## 🤝 Contribución

Este es un proyecto en desarrollo. Para contribuir, contacta al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados.
