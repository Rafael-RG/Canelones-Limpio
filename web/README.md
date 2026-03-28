# Frontend Web - Canelones Limpio

Panel administrativo web para la gestión de recolección de residuos en Canelones.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` (ya existe uno de ejemplo):

```bash
VITE_API_URL=https://localhost:7001/api
```

### 3. Asegúrate de que el Backend esté corriendo

El frontend necesita que el backend esté ejecutándose. Desde la carpeta raíz:

```bash
cd backend
dotnet run
```

El backend debe estar disponible en `https://localhost:7001`

### 4. Ejecutar la Aplicación Web

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

## 📋 Funcionalidades

### Dashboard Principal
- Estadísticas en tiempo real
- Total de recolecciones del día
- Estado de la flota
- Eficiencia promedio
- Alertas activas

### Gestión de Recolectores
- ✅ Crear nuevos recolectores
- ✅ Ver listado completo
- ✅ Cambiar estado (Activo/Inactivo)
- ✅ Eliminar recolectores
- 🔜 Generar credenciales QR

### Gestión de Flota
- ✅ Registrar nuevos vehículos
- ✅ Ver estado de cada unidad
- ✅ Cambiar estado (Operativo/Mantenimiento/Fuera de Servicio)
- ✅ Eliminar vehículos
- ✅ Estadísticas de flota

### Registro de Viviendas
- ✅ Registrar nuevas viviendas
- ✅ Generar códigos QR
- ✅ Ver estadísticas de recolección por vivienda
- ✅ Eliminar viviendas
- 🔜 Imprimir códigos QR

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Material Symbols** - Iconos

## 📁 Estructura del Proyecto

```
web/src/
├── components/           # Componentes reutilizables
│   ├── AdminLayout.jsx
│   └── ...
├── pages/               # Páginas principales
│   ├── AdminDashboard.jsx      # Dashboard principal
│   ├── AdminCollectors.jsx     # Gestión de recolectores
│   ├── AdminFleet.jsx          # Gestión de flota
│   └── AdminHousing.jsx        # Registro de viviendas
├── services/            # Servicios de API
│   └── apiService.js    # Cliente HTTP para el backend
├── hooks/               # Custom React hooks
│   └── useApi.js        # Hooks para consumir API
├── data/                # Datos mock (ya no se usan)
├── App.jsx              # Componente raíz
└── main.jsx             # Entry point
```

## 🔧 Configuración Adicional

### Cambiar la URL del Backend

Si tu backend está en otra URL, actualiza el archivo `.env`:

```bash
VITE_API_URL=http://tu-servidor:puerto/api
```

### Modo de Producción

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`.

Para previsualizar el build de producción:

```bash
npm run preview
```

## 🐛 Solución de Problemas

### Error: "Failed to fetch" o errores de CORS

**Causa**: El backend no está corriendo o no está accesible.

**Solución**:
1. Verifica que el backend esté ejecutándose en `https://localhost:7001`
2. Asegúrate de que CORS esté habilitado en el backend
3. Verifica que la URL en `.env` sea correcta

### El Dashboard muestra "Error al cargar datos"

**Causa**: No se puede conectar con el backend.

**Solución**:
1. Abre `https://localhost:7001/swagger` en tu navegador
2. Si ves el Swagger UI, el backend está funcionando
3. Verifica que la variable `VITE_API_URL` en `.env` sea correcta
4. Revisa la consola del navegador para ver el error exacto

### Los datos no se actualizan

**Causa**: Caché del navegador o problema con el backend.

**Solución**:
1. Refresca la página con `Ctrl + F5` (limpia caché)
2. Abre DevTools (F12) y verifica la pestaña Network
3. Revisa si las peticiones al backend se están completando

### Warning sobre certificado SSL

**Causa**: El backend usa un certificado auto-firmado para desarrollo.

**Solución**:
1. Abre `https://localhost:7001` en tu navegador
2. Acepta el certificado auto-firmado
3. Luego recarga la aplicación web

## 📦 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción
npm run lint         # Ejecuta el linter
```

## 🔄 Flujo de Datos

1. Los componentes usan hooks personalizados (`useCollectors`, `useVehicles`, etc.)
2. Los hooks llaman al `apiService`
3. `apiService` hace peticiones HTTP al backend
4. Los datos se actualizan automáticamente en la UI

## 🎨 Personalización

### Colores

Los colores primarios están definidos en `index.css` usando variables CSS:

```css
--primary: #008a45;
```

### Agregar Nueva Página

1. Crea el componente en `src/pages/`
2. Agrega la ruta en `App.jsx`
3. Agrega el link en `AdminLayout.jsx`

## 📝 Próximas Funcionalidades

- [ ] Autenticación de usuarios
- [ ] Exportar reportes en PDF/Excel
- [ ] Visualización de mapa en tiempo real
- [ ] Notificaciones push
- [ ] Filtros avanzados en listas
- [ ] Gráficos y estadísticas detalladas
- [ ] Modo oscuro
- [ ] Impresión de códigos QR

## 🤝 Integración con Mobile

La app móvil comparte el mismo backend. Los recolectores pueden:
- Iniciar sesiones de trabajo
- Escanear códigos QR de viviendas
- Calificar recolecciones (Buena/Regular/Mala)
- Ver historial

## 💡 Tips de Desarrollo

1. **DevTools**: Usa React DevTools extension para debugging
2. **Hot Reload**: Los cambios se reflejan automáticamente
3. **Console**: Revisa la consola del navegador para errores de API
4. **Network Tab**: Útil para inspeccionar peticiones HTTP

## 🔒 Seguridad

⚠️ **Importante para Producción**:

1. Nunca subas el archivo `.env` al repositorio (ya está en `.gitignore`)
2. Implementa autenticación y autorización
3. Usa HTTPS en producción
4. Valida datos de entrada en el backend
5. Implementa rate limiting
6. Sanitiza inputs del usuario

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del backend
2. Revisa la consola del navegador
3. Verifica que ambos servicios estén corriendo
4. Asegúrate de tener las últimas versiones de las dependencias

---

**Estado**: ✅ Integración completa con backend
**Última actualización**: 28 de marzo de 2026
