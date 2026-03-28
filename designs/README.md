# Estructura de Diseños

Esta carpeta contiene los diseños importados desde Stitch.

## Organización

```
designs/
├── mobile/          # Diseños específicos para móvil
│   ├── screens/     # Pantallas completas
│   ├── components/  # Componentes reutilizables
│   └── assets/      # Imágenes, iconos, etc.
│
└── web/            # Diseños específicos para web
    ├── pages/      # Páginas completas
    ├── components/ # Componentes reutilizables
    └── assets/     # Imágenes, iconos, etc.
```

## Uso

### Importar un diseño

```javascript
// En React Native (Mobile)
import HomeScreen from './designs/mobile/screens/HomeScreen';

// En React (Web)
import HomePage from './designs/web/pages/HomePage';
```

### Integración con Stitch

Los diseños se sincronizan automáticamente desde Stitch usando:
- `stitchService.js` - Servicio de API
- `useStitch.js` - Hooks de React
- `StitchComponent` - Componente de renderizado

## Próximos pasos

1. Exportar diseños desde Stitch
2. Colocarlos en las carpetas correspondientes
3. Actualizar las importaciones en las aplicaciones
4. Ajustar estilos según necesidades específicas
