# Canelones Limpio

Proyecto dual con aplicación móvil y web para la gestión de limpieza en Canelones.

## 📱 Estructura del Proyecto

```
canelones-limpio/
├── mobile/          # Aplicación móvil (React Native + Expo)
├── web/            # Aplicación web (React + Vite)
├── mcp-config.json # Configuración del servidor MCP de Stitch
└── README.md
```

## 🚀 Inicio Rápido

### Aplicación Móvil

```bash
cd mobile
npm install
npm start
```

Luego escanea el código QR con la app Expo Go en tu teléfono.

### Aplicación Web

```bash
cd web
npm install
npm run dev
```

La aplicación web estará disponible en http://localhost:3000

## 🎨 Integración con Stitch

Este proyecto usa diseños creados en Google Stitch. La configuración del servidor MCP está en `mcp-config.json`.

### Configuración de la API Key

1. Copia el archivo `.env.example` a `.env` en la raíz del proyecto
2. Reemplaza `tu_clave_api_aqui` con tu clave API de Stitch
3. **IMPORTANTE**: Nunca subas la clave API al repositorio

## 📦 Tecnologías Utilizadas

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
