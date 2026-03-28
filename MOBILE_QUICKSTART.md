# Guía de Inicio Rápido - Mobile App

## 1. Configurar la URL del Backend

### Opción A: Android Emulator
1. Abre `mobile/services/apiService.js`
2. La configuración predeterminada ya está lista para Android Emulator:
```javascript
baseUrl: 'http://10.0.2.2:5001/api'
```

### Opción B: iOS Simulator
1. Abre `mobile/services/apiService.js`
2. Cambia a:
```javascript
baseUrl: 'http://localhost:5001/api'
```

### Opción C: Dispositivo Físico
1. Encuentra la IP de tu PC:
   - Windows: Abre PowerShell y ejecuta `ipconfig`
   - Busca "Dirección IPv4" en tu adaptador de red activo
   - Ejemplo: `192.168.1.100`

2. Abre `mobile/services/apiService.js`
3. Cambia a:
```javascript
baseUrl: 'http://TU_IP_PC:5001/api'  // Reemplaza TU_IP_PC
```

4. **IMPORTANTE**: Tu PC y dispositivo deben estar en la misma red Wi-Fi

## 2. Levantar el Backend

```powershell
# En una terminal PowerShell
cd backend
dotnet run --urls "http://0.0.0.0:5001"  # Escuchar en todas las interfaces
```

**Nota**: Usa el puerto HTTP (5001) en lugar de HTTPS (7001) para móvil, es más sencillo.

## 3. Iniciar la App Móvil

```powershell
cd mobile
npm install  # Solo la primera vez
npm start
```

## 4. Ejecutar en Dispositivo

### Android Emulator:
1. Abre Android Studio
2. Inicia un emulador
3. En la terminal de Expo, presiona `a`

### iOS Simulator (Solo Mac):
1. En la terminal de Expo, presiona `i`

### Dispositivo Físico:
1. Instala "Expo Go" desde:
   - Google Play Store (Android)
   - App Store (iOS)

2. Escanea el código QR que aparece en la terminal

## 5. Flujo de Prueba

### Paso 1: Crear Datos de Prueba
Primero crea datos desde la web admin:

1. Abre http://localhost:3001 en tu navegador
2. Ve a "Recolectores" y crea uno:
   - Nombre: Juan Pérez
   - Documento: 12345678
   - Teléfono: 099123456
   - **Anota el Código QR que se genera (ej: COL-0001)**

3. Ve a "Flota" y crea un vehículo:
   - Matrícula: ABC-1234
   - Tipo: Camión Compactador
   - Estado: Disponible
   - Zona: Zona Norte

4. Ve a "Viviendas" y crea varios hogares:
   - ID: HOME-0001
   - Dirección: Calle 1 esquina 2
   - Zona: Zona Norte
   - **Anota los Códigos QR generados**

### Paso 2: Usar la App Móvil

**2.1 Autenticación**
- En la pantalla inicial, toca "Identificación"
- Ingresa el código QR del recolector (ej: COL-0001) en el campo manual
- Presiona "INGRESAR"

**2.2 Seleccionar Vehículo**
- Verás los vehículos disponibles
- Toca "Seleccionar Unidad" en el vehículo que creaste
- Se crea automáticamente una sesión

**2.3 Escanear Hogares**
- Toca el botón grande "Identificar Hogar"
- Ingresa el código QR de un hogar (ej: HOME-0001)
- Presiona "Confirmar Código"

**2.4 Calificar**
- Elige una calificación (Excelente, Buena, Regular, Mala, Muy Mala)
- Opcionalmente agrega notas
- Se guarda automáticamente

**2.5 Ver Estadísticas**
- Vuelve a "Sesión Activa"
- Verás el contador de hogares visitados y el promedio de calificaciones

**2.6 Finalizar Sesión**
- Toca el ícono de salida (logout) en la esquina superior izquierda
- Confirma que deseas finalizar
- El vehículo vuelve a estado "Disponible"

## 6. Troubleshooting

### "Failed to fetch" o "Network request failed"

**Si usas Android Emulator:**
- ✅ Verifica que uses `http://10.0.2.2:5001/api`
- ❌ NO uses `localhost`

**Si usas iOS Simulator:**
- ✅ Usa `http://localhost:5001/api`

**Si usas dispositivo físico:**
- ✅ Verifica que la IP sea correcta
- ✅ PC y móvil deben estar en la MISMA red Wi-Fi
- ✅ Desactiva temporalmente el firewall de Windows:
  ```powershell
  # Permitir puerto 5001
  netsh advfirewall firewall add rule name="Canelones Backend" dir=in action=allow protocol=TCP localport=5001
  ```

### "Recolector no encontrado"
- Verifica que el código QR sea exactamente el que aparece en la web admin
- Los códigos son case-sensitive

### "No hay vehículos disponibles"
- Asegúrate de crear al menos un vehículo con estado "Disponible"
- Verifica que el backend esté corriendo

### Backend no responde
```powershell
# Verificar que el puerto esté escuchando
Test-NetConnection -ComputerName localhost -Port 5001

# Si devuelve False, el backend no está corriendo
# Reinicia el backend:
cd backend
dotnet run --urls "http://0.0.0.0:5001"
```

## 7. Tips de Desarrollo

### Ver Logs en Tiempo Real
```powershell
# En la terminal de Expo, presiona:
j  # Para abrir el debugger
r  # Para recargar la app
```

### Limpiar Cache
```powershell
cd mobile
npm start --clear
```

### Simular en Web
```powershell
cd mobile
npm start
# Presiona 'w' para abrir en navegador
```

## 8. Próximos Pasos

Una vez que todo funcione:

1. **Implementar Cámara Real**: Integrar `expo-camera` o `expo-barcode-scanner`
2. **Modo Offline**: Usar AsyncStorage para guardar datos cuando no hay conexión
3. **Geolocalización**: Agregar `expo-location` para tracking de rutas
4. **Notificaciones**: Implementar push notifications con expo-notifications
5. **Fotos de Evidencia**: Permitir tomar fotos de la recolección

## 9. Recursos Útiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 10. Contacto y Soporte

¿Problemas? Revisa:
1. Este archivo (MOBILE_QUICKSTART.md)
2. mobile/README.md
3. Los logs de la consola de Expo
4. Los logs del backend
