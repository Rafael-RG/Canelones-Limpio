# Canelones Limpio - Aplicación Móvil

Aplicación móvil de **Canelones Limpio** desarrollada con React Native y Expo. Esta app permite a los recolectores gestionar sesiones de recolección, escanear hogares y registrar calificaciones en tiempo real.

## 🚀 Características

- **Autenticación de Recolectores**: Login mediante código QR
- **Gestión de Sesiones**: Iniciar y finalizar jornadas de recolección
- **Escaneo de Hogares**: Registrar recolección mediante QR
- **Sistema de Calificaciones**: Evaluar la calidad de la separación de residuos
- **Historial**: Ver sesiones y calificaciones pasadas
- **Sincronización en Tiempo Real**: Integrado con backend .NET 9

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn
- Expo CLI
- Dispositivo móvil con Expo Go o emulador Android/iOS

## 🛠️ Instalación

1. **Instalar dependencias**:
```bash
cd mobile
npm install
```

2. **Configurar la URL del backend**:

Edita `mobile/services/apiService.js` y ajusta la URL según tu entorno:

```javascript
const API_CONFIG = {
  // Para Android Emulator:
  baseUrl: 'http://10.0.2.2:5001/api',
  
  // Para iOS Simulator:
  // baseUrl: 'http://localhost:5001/api',
  
  // Para dispositivo físico (usa la IP de tu PC):
  // baseUrl: 'http://192.168.1.X:5001/api',
};
```

## ▶️ Ejecución

1. **Iniciar Expo**:
```bash
npm start
```

2. **Ejecutar en dispositivo**:
   - Escanea el código QR con Expo Go (Android/iOS)
   - O usa las opciones del menú:
     - Presiona `a` para abrir en Android
     - Presiona `i` para abrir en iOS
     - Presiona `w` para abrir en web

## 📱 Flujo de la Aplicación

### 1. Landing Screen
Pantalla inicial con opciones de inicio

### 2. Autenticación (CollectorAuthScreen)
- Escanear código QR del recolector
- Validación contra el backend
- Almacena datos del recolector autenticado

### 3. Selección de Unidad (UnitSelectionScreen)
- Muestra vehículos disponibles
- Selecciona vehículo para la jornada
- Crea sesión de recolección

### 4. Sesión Activa (CollectorSessionScreen)
- Muestra información de la sesión actual
- Botón para escanear hogares
- Estadísticas en tiempo real

### 5. Escaneo de Hogar (HomeScannerScreen)
- Escanea código QR del hogar
- Valida hogar contra el backend
- Navega a pantalla de calificación

### 6. Calificación (HouseholdRatingScreen)
- Interfaz para calificar separación de residuos
- Notas opcionales
- Guarda calificación en el backend

### 7. Historial (HistoryScreen)
- Lista de sesiones pasadas
- Detalle de calificaciones por sesión
- Estadísticas del recolector

## 📁 Estructura del Proyecto

```
mobile/
├── App.js                      # Punto de entrada y navegación
├── package.json                # Dependencias del proyecto
├── components/                 # Componentes reutilizables
│   └── MobileNav.js           # Navegación inferior
├── screens/                    # Pantallas de la aplicación
│   ├── LandingScreen.js       # Pantalla inicial
│   ├── CollectorAuthScreen.js # Autenticación de recolector
│   ├── UnitSelectionScreen.js # Selección de vehículo
│   ├── CollectorSessionScreen.js # Sesión activa
│   ├── HomeScannerScreen.js   # Escaneo de hogar
│   ├── HouseholdRatingScreen.js # Calificación de hogar
│   └── HistoryScreen.js       # Historial de sesiones
├── services/                   # Servicios de API
│   ├── apiService.js          # Cliente HTTP para backend
│   └── stitchService.js       # Integración Stitch (opcional)
├── hooks/                      # Custom React Hooks
│   ├── useApi.js              # Hooks para API calls
│   └── useStitch.js           # Hooks para Stitch
└── data/                       # Datos de prueba
    └── mockData.js            # Datos mock para desarrollo
```

## 🔧 Servicios y Hooks

### apiService.js
Cliente HTTP principal que interactúa con el backend:

```javascript
import apiService from './services/apiService';

// Autenticar recolector
const collector = await apiService.authenticateCollector(qrCode);

// Crear sesión
const session = await apiService.createSession({
  collectorId: collector.id,
  vehicleId: vehicle.id,
  startTime: new Date().toISOString(),
});

// Crear calificación
const rating = await apiService.createRating({
  householdId: household.id,
  sessionId: session.id,
  score: 5,
  notes: 'Excelente separación',
});
```

### useApi.js
Hooks personalizados para React:

```javascript
import { useCollectors, useSessions, useRatings } from './hooks/useApi';

// En tu componente
const { authenticateCollector, error } = useCollectors();
const { sessions, createSession } = useSessions(collectorId);
const { ratings, createRating } = useRatings(sessionId);
```

## 🌐 Configuración de Red

### Android Emulator
El emulador de Android NO puede usar `localhost`. Usa:
```javascript
baseUrl: 'http://10.0.2.2:5001/api'  // ✅ Correcto
baseUrl: 'http://localhost:5001/api' // ❌ No funciona
```

### iOS Simulator
El simulador de iOS SÍ puede usar `localhost`:
```javascript
baseUrl: 'http://localhost:5001/api' // ✅ Correcto
```

### Dispositivo Físico
Encuentra la IP de tu PC y usa:
```javascript
// Windows: ipconfig
// Mac/Linux: ifconfig
baseUrl: 'http://192.168.1.XXX:5001/api' // Reemplaza con tu IP
```

### Backend HTTPS
Si usas HTTPS (puerto 7001), necesitarás:
1. Certificado válido o
2. Configurar la app para aceptar certificados auto-firmados

**Recomendación**: Usa HTTP (puerto 5001) para desarrollo móvil.

## 🔐 Seguridad

Para producción, implementa:
- Autenticación JWT
- Almacenamiento seguro de tokens (SecureStore)
- Validación de certificados SSL
- Cifrado de datos sensibles

## 🐛 Debug

### Ver logs en tiempo real:
```bash
npx expo start
# Presiona 'j' para abrir debugger
```

### Inspeccionar network requests:
1. Instala React Native Debugger
2. O usa el debugger integrado de Chrome

### Troubleshooting común:

**Error: Cannot connect to backend**
- Verifica que el backend esté corriendo
- Confirma la URL en apiService.js
- Revisa que el puerto esté accesible desde el emulador/dispositivo

**Error: Network request failed**
- Para Android Emulator, usa `10.0.2.2` en lugar de `localhost`
- Para dispositivo físico, asegúrate de estar en la misma red Wi-Fi

## 📚 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnavigation.org/)
- [React Navigation](https://reactnavigation.org/)

## 🚧 Próximas Funcionalidades

- [ ] Modo offline con sincronización posterior
- [ ] Notificaciones push
- [ ] Mapas de rutas
- [ ] Cámara integrada para fotos de evidencia
- [ ] Firma digital de recolector
- [ ] Reportes en PDF

## 📄 Licencia

Intendencia de Canelones © 2026
