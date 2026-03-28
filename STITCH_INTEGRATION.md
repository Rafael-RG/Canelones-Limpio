# Guía de Integración con Stitch

## 🎨 Configuración Completa

La integración con Stitch está lista en ambas aplicaciones. Aquí está lo que se ha configurado:

### Archivos Creados

#### Móvil (React Native)
- `mobile/services/stitchService.js` - Servicio de API para Stitch
- `mobile/hooks/useStitch.js` - Hooks de React para cargar diseños
- `mobile/components/StitchComponent.js` - Componente para renderizar diseños

#### Web (React)
- `web/src/services/stitchService.js` - Servicio de API para Stitch
- `web/src/hooks/useStitch.js` - Hooks de React para cargar diseños
- `web/src/components/StitchComponent.jsx` - Componente para renderizar diseños

## 🚀 Cómo Usar

### 1. Cargar Todos los Diseños

```javascript
import { useStitchDesigns } from './hooks/useStitch';

function MyComponent() {
  const { designs, loading, error } = useStitchDesigns();
  
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      {designs.map(design => (
        <div key={design.id}>{design.name}</div>
      ))}
    </div>
  );
}
```

### 2. Cargar un Diseño Específico

```javascript
import { useStitchDesign } from './hooks/useStitch';

function MyComponent() {
  const { design, loading, error } = useStitchDesign('design-id');
  
  if (loading) return <p>Cargando diseño...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return <div>{design.name}</div>;
}
```

### 3. Usar el Servicio Directamente

```javascript
import stitchService from './services/stitchService';

async function loadMyDesign() {
  try {
    const design = await stitchService.getDesign('my-design-id');
    const components = await stitchService.getDesignComponents('my-design-id');
    const styles = await stitchService.getDesignStyles('my-design-id');
    console.log(design, components, styles);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 4. Renderizar un Componente de Stitch

```javascript
import StitchComponent from './components/StitchComponent';

function MyScreen() {
  return (
    <StitchComponent 
      design={myDesign}
      componentId="header"
      className="my-custom-class"
    />
  );
}
```

## 📝 Próximos Pasos

### 1. Verificar la API de Stitch

Primero, verifica que la API de Stitch esté respondiendo correctamente:

```bash
# En la terminal de cualquier proyecto
node -e "fetch('https://stitch.googleapis.com/mcp/designs', {headers: {'X-Goog-Api-Key': 'TU_API_KEY'}}).then(r => r.json()).then(console.log)"
```

### 2. Descomentar el Código de Producción

En ambos archivos `App.js` / `App.jsx`, hay código comentado:

```javascript
// Descomentar cuando estés listo para cargar diseños reales
// const data = await stitchService.getDesigns();
// setDesigns(data);
```

Una vez que verifiques que la API funciona, descomenta estas líneas y elimina los datos de ejemplo.

### 3. Mapear tus Diseños

Necesitarás mapear los diseños de Stitch a componentes de React:

```javascript
// Ejemplo de mapeo
const componentMap = {
  'button': ButtonComponent,
  'header': HeaderComponent,
  'card': CardComponent,
  // ... tus componentes
};

function renderStitchComponent(component) {
  const Component = componentMap[component.type];
  return <Component {...component.props} />;
}
```

### 4. Organizar tus Diseños

Coloca los diseños exportados en:
- `designs/mobile/` - Para la app móvil
- `designs/web/` - Para la app web

## 🔒 Seguridad

La API key está actualmente hardcodeada en los archivos de servicio. Para producción:

1. **Móvil**: Usar variables de entorno con `react-native-dotenv`
2. **Web**: Usar variables de entorno de Vite (`.env.local`)

```javascript
// En lugar de hardcoded:
const STITCH_API_KEY = import.meta.env.VITE_STITCH_API_KEY; // Web
// o
const STITCH_API_KEY = process.env.STITCH_API_KEY; // Mobile
```

## 📚 API de Stitch Service

```javascript
// Métodos disponibles:
stitchService.getDesigns()                    // Obtener todos los diseños
stitchService.getDesign(designId)             // Obtener un diseño específico
stitchService.getDesignComponents(designId)   // Obtener componentes de un diseño
stitchService.getDesignStyles(designId)       // Obtener estilos de un diseño
stitchService.getAssets(designId)            // Obtener assets (imágenes, etc.)
```

## 🐛 Debugging

Si encuentras problemas:

1. Verifica que la API key sea correcta
2. Chequea la consola del navegador / logs de React Native
3. Verifica que la URL de Stitch sea correcta
4. Asegúrate de que los diseños existan en tu cuenta de Stitch

## ✨ Ejemplo Completo

```javascript
import React, { useEffect } from 'react';
import { useStitchDesign } from './hooks/useStitch';
import StitchComponent from './components/StitchComponent';

export default function HomeScreen() {
  const { design, loading, error } = useStitchDesign('home-screen');
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  return (
    <StitchDesignLoader designId="home-screen">
      <StitchComponent 
        design={design}
        componentId="main-content"
      />
    </StitchDesignLoader>
  );
}
```

## 🎯 Estado Actual

✅ Servicios de API configurados  
✅ Hooks de React creados  
✅ Componentes de renderizado creados  
✅ Apps actualizadas para mostrar diseños  
✅ Estructura de carpetas organizada  

⏳ Pendiente:
- Instalar dependencias
- Verificar API de Stitch
- Mapear diseños específicos
- Implementar componentes personalizados
