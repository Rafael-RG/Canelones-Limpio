# 🧪 Guía de Pruebas - Integración Frontend ↔ Backend

Esta guía te ayudará a verificar que la integración entre el frontend y el backend esté funcionando correctamente.

## ✅ Pre-requisitos

Asegúrate de que ambos servicios estén corriendo:

1. **Backend**: Abre https://localhost:7001 - Deberías ver Swagger UI
2. **Frontend**: Abre http://localhost:3001 - Deberías ver el dashboard

## 🎯 Pruebas de Integración

### 1. Dashboard - Estadísticas

**Objetivo**: Verificar que el dashboard cargue estadísticas del backend

**Pasos**:
1. Abre http://localhost:3001
2. Verifica que NO veas el mensaje "Cargando estadísticas..."
3. Deberías ver tarjetas con números (aunque sean 0s)
4. Si ves "Error al cargar datos" → el backend no está corriendo

**Resultado Esperado**:
- ✅ Dashboard carga sin errores
- ✅ Se muestran 4 tarjetas con estadísticas
- ✅ No hay errores en la consola del navegador

### 2. Recolectores - Crear Nuevo

**Objetivo**: Verificar que se pueden crear recolectores

**Pasos**:
1. Click en "Recolectores" en el menú lateral
2. Rellena el formulario:
   - ID: `RM`
   - Nombre: `Ricardo Morales`
   - Documento: `4.521.890-2`
   - Turno: `Mañana`
3. Click en "Guardar Registro"
4. Deberías ver un mensaje verde "Recolector creado exitosamente"
5. El recolector aparece en la tabla abajo

**Resultado Esperado**:
- ✅ Formulario se limpia después de guardar
- ✅ Aparece mensaje de éxito
- ✅ Recolector aparece en la tabla
- ✅ El estado inicial es "Activo"

**Verificación en Backend**:
- Abre https://localhost:7001/swagger
- Expandir `GET /api/collectors`
- Click "Try it out" → "Execute"
- Deberías ver el recolector en la respuesta

### 3. Recolectores - Cambiar Estado

**Objetivo**: Verificar que se puede cambiar el estado de un recolector

**Pasos**:
1. En la tabla de recolectores, busca el que creaste
2. Click en el botón con icono de "swap_horiz"
3. El estado debería cambiar de "Activo" a "Inactivo" (o viceversa)
4. El punto indicador cambia de verde a gris

**Resultado Esperado**:
- ✅ Estado cambia inmediatamente
- ✅ No hay errores en consola
- ✅ El cambio persiste al recargar la página (F5)

### 4. Recolectores - Eliminar

**Objetivo**: Verificar que se pueden eliminar recolectores

**Pasos**:
1. Click en el botón con icono de "delete" (rojo)
2. Confirma en el diálogo
3. El recolector desaparece de la tabla

**Resultado Esperado**:
- ✅ Aparece diálogo de confirmación
- ✅ Recolector se elimina de la tabla
- ✅ El cambio persiste al recargar la página

### 5. Flota - Crear Vehículo

**Objetivo**: Verificar que se pueden crear vehículos

**Pasos**:
1. Click en "Flota" en el menú lateral
2. Click en "+ Nuevo Vehículo"
3. Rellena el formulario:
   - ID: `MT-1024`
   - Tipo: `Carga Trasera`
   - Capacidad: `15.0 t`
4. Click en "Guardar Vehículo"
5. El vehículo aparece en la lista

**Resultado Esperado**:
- ✅ Formulario se oculta después de guardar
- ✅ Vehículo aparece en la lista
- ✅ Estado inicial es "Operativo" (badge verde)
- ✅ Las estadísticas se actualizan (Total de Unidades)

### 6. Flota - Cambiar Estado

**Objetivo**: Verificar el ciclo de estados del vehículo

**Pasos**:
1. Click en el botón "swap_horiz" del vehículo
2. Estado cambia de "Operativo" → "Mantenimiento" (amarillo)
3. Click nuevamente
4. Estado cambia de "Mantenimiento" → "Fuera de Servicio" (rojo)
5. Click nuevamente
6. Estado regresa a "Operativo" (verde)

**Resultado Esperado**:
- ✅ El ciclo completo funciona
- ✅ Los colores cambian correctamente
- ✅ Las estadísticas se actualizan

### 7. Viviendas - Crear Hogar

**Objetivo**: Verificar que se pueden crear viviendas

**Pasos**:
1. Click en "Viviendas" en el menú lateral
2. Rellena el formulario:
   - ID: `ID-8829-X`
   - Dirección: `Calle Los Álamos 452`
   - Zona: `Zona Norte`
   - Código QR: (dejar vacío, se genera automáticamente)
3. Click en "Generar QR y Guardar"
4. La vivienda aparece en la tabla

**Resultado Esperado**:
- ✅ Se genera un código QR automáticamente
- ✅ Vivienda aparece en la tabla
- ✅ Estadísticas muestran 0/0/0 (sin recolecciones aún)
- ✅ El contador de viviendas se actualiza

### 8. Dashboard - Verificar Actualización

**Objetivo**: Verificar que el dashboard se actualiza con los datos nuevos

**Pasos**:
1. Regresa al Dashboard (click en "Panel Principal")
2. Verifica los números:
   - "Unidades Eco" debería mostrar el número de vehículos que creaste
   - Las estadísticas reflejan los datos actuales

**Resultado Esperado**:
- ✅ Los números reflejan los datos reales
- ✅ No hay datos hardcodeados

## 🐛 Pruebas de Manejo de Errores

### 9. Backend Desconectado

**Objetivo**: Verificar que el frontend maneja errores correctamente

**Pasos**:
1. Detén el backend (Ctrl+C en la terminal del backend)
2. Recarga el frontend (F5)
3. Deberías ver mensajes de error en lugar de pantalla en blanco

**Resultado Esperado**:
- ✅ Aparece mensaje "Error al cargar datos"
- ✅ Se sugiere verificar que el backend esté corriendo
- ✅ No hay pantalla en blanco
- ✅ La aplicación no se rompe

### 10. Datos Duplicados

**Objetivo**: Verificar que se manejan errores de duplicación

**Pasos**:
1. Intenta crear un recolector con un ID que ya existe
2. Deberías ver un mensaje de error

**Resultado Esperado**:
- ✅ Aparece alerta con mensaje de error
- ✅ El formulario no se limpia
- ✅ Puedes corregir el ID e intentar nuevamente

## 📊 Verificación en Backend

Para cada operación del frontend, puedes verificar en el backend:

### Usando Swagger UI

1. Abre https://localhost:7001
2. Expande cualquier endpoint
3. Click "Try it out" → "Execute"
4. Verifica que los datos coincidan con lo que hiciste en el frontend

### Usando Azure Storage Explorer (Opcional)

Si tienes Azure Storage Explorer instalado:
1. Conéctate con el connection string
2. Navega a Tables
3. Verás las tablas: `Collectors`, `Vehicles`, `Households`, etc.
4. Verifica que los datos están ahí

## 🔄 Prueba de Persistencia

**Objetivo**: Verificar que los datos persisten entre recargas

**Pasos**:
1. Crea varios recolectores, vehículos y viviendas
2. Cierra el navegador completamente
3. Abre el navegador nuevamente
4. Navega a http://localhost:3001
5. Todos los datos deberían seguir ahí

**Resultado Esperado**:
- ✅ Los datos persisten
- ✅ No se pierden al recargar
- ✅ Las estadísticas son correctas

## 🎉 Lista de Verificación Final

Marca cada ítem según lo hayas probado:

- [ ] Dashboard carga correctamente
- [ ] Se pueden crear recolectores
- [ ] Se pueden modificar recolectores
- [ ] Se pueden eliminar recolectores
- [ ] Se pueden crear vehículos
- [ ] Se pueden cambiar estados de vehículos
- [ ] Se pueden eliminar vehículos
- [ ] Se pueden crear viviendas
- [ ] Se pueden eliminar viviendas
- [ ] Dashboard muestra estadísticas reales
- [ ] Los errores se manejan correctamente
- [ ] Los datos persisten entre recargas

## 🚨 Problemas Comunes

### "Failed to fetch" en consola

**Causa**: Backend no está corriendo o CORS no configurado

**Solución**:
```bash
cd backend
dotnet run
```

### Certificado SSL no confiable

**Causa**: El backend usa certificado auto-firmado

**Solución**:
1. Abre https://localhost:7001 en tu navegador
2. Click en "Avanzado" → "Continuar de todas formas"
3. Acepta el certificado
4. Recarga el frontend

### Los datos no se actualizan

**Solución**:
1. Abre DevTools (F12)
2. Ve a la pestaña Network
3. Realiza la acción nuevamente
4. Verifica que la petición se complete (status 200 o 201)
5. Si es 4xx o 5xx, revisa los logs del backend

### "Cannot read property of undefined"

**Causa**: Estructura de datos no coincide

**Solución**:
1. Verifica la estructura de datos en Swagger
2. Comprueba que los DTOs en el backend coincidan con el frontend
3. Revisa la consola para el error exacto

## 📝 Notas

- Todas las operaciones deben ser instantáneas (< 1 segundo)
- No debería haber retrasos notables
- Los mensajes de éxito deben aparecer y desaparecer automáticamente
- Los errores deben ser claros y descriptivos

---

**Última actualización**: 28 de marzo de 2026
**Estado**: ✅ Integración completa funcional
