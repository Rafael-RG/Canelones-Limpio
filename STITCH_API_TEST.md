# Guía de Verificación de API Stitch

## 🔍 Cómo Verificar la Conexión con Stitch

### 1. Probar la API desde la Terminal

Abre PowerShell y ejecuta este comando para probar la conexión:

```powershell
$headers = @{
    "X-Goog-Api-Key" = "AQ.Ab8RN6IUgPtGECeR317p3EyzsT7YXx0X20E77pSj-_RxVfFXSA"
    "Content-Type" = "application/json"
}

# Probar conexión base
Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp" -Headers $headers -Method GET
```

### 2. Descubrir Endpoints Disponibles

La API MCP de Stitch puede tener diferentes endpoints. Prueba estos:

```powershell
# Listar recursos disponibles
Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp/resources" -Headers $headers

# Listar herramientas disponibles
Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp/tools" -Headers $headers

# Info sobre el servidor
Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp/server/info" -Headers $headers
```

### 3. Verificar Diseños

Si conoces el endpoint correcto para tus diseños:

```powershell
# Ejemplo: listar diseños
Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp/designs" -Headers $headers

# Ejemplo: obtener un diseño específico
Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp/designs/DESIGN_ID" -Headers $headers
```

### 4. Llamar al MCP Server

El servidor MCP usa un protocolo específico. Prueba con este formato:

```powershell
$body = @{
    jsonrpc = "2.0"
    method = "resources/list"
    id = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp" -Method POST -Headers $headers -Body $body
```

### 5. Verificar desde Node.js

También puedes crear un script de prueba:

```javascript
// test-stitch.js
const API_KEY = 'AQ.Ab8RN6IUgPtGECeR317p3EyzsT7YXx0X20E77pSj-_RxVfFXSA';
const BASE_URL = 'https://stitch.googleapis.com/mcp';

async function testStitchAPI() {
  try {
    // Probar diferentes endpoints
    const endpoints = [
      '/',
      '/resources',
      '/tools',
      '/designs',
      '/server/info'
    ];

    for (const endpoint of endpoints) {
      console.log(`\n🔍 Probando: ${BASE_URL}${endpoint}`);
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Respuesta:`, data);
      } else {
        console.log(`   ❌ Error: ${await response.text()}`);
      }
    }

    // Probar con método POST (MCP protocol)
    console.log(`\n🔍 Probando MCP Protocol (POST)`);
    const mcpResponse = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "resources/list",
        id: 1
      })
    });

    console.log(`   Status: ${mcpResponse.status}`);
    if (mcpResponse.ok) {
      const data = await mcpResponse.json();
      console.log(`   ✅ Respuesta MCP:`, data);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testStitchAPI();
```

Guarda esto como `test-stitch.js` y ejecútalo:

```bash
node test-stitch.js
```

## 📋 Resultados Esperados

Dependiendo de la respuesta, sabrás:

- **200 OK** - El endpoint existe y funciona
- **404 Not Found** - El endpoint no existe
- **401 Unauthorized** - Problema con la API key
- **403 Forbidden** - No tienes permisos
- **500 Server Error** - Error del servidor

## 🔧 Actualizar la App

Una vez que descubras los endpoints correctos, actualiza:

1. **`mobile/services/stitchService.js`** - Actualizar endpoints
2. **`web/src/services/stitchService.js`** - Actualizar endpoints

Ejemplo de actualización:

```javascript
async getDesigns() {
  // Si el endpoint correcto es diferente:
  return this.request('/v1/projects/YOUR_PROJECT/designs');
  
  // O si usa MCP protocol:
  return this.request('', {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "designs/list",
      id: 1
    })
  });
}
```

## 📚 Documentación

Consulta la documentación oficial de Stitch MCP:
- [Stitch Documentation](https://cloud.google.com/stitch)
- [MCP Protocol Spec](https://spec.modelcontextprotocol.io/)

## 💡 Tips

1. **Revisa los logs**: En la app móvil, los logs aparecerán en la terminal de Expo
2. **Usa React DevTools**: Para ver el estado de la app en tiempo real
3. **Verifica la red**: Usa herramientas como Postman o Bruno para probar la API
4. **Contacta soporte**: Si nada funciona, verifica con el equipo de Stitch

## 🐛 Debugging

Para ver más información en la app:

1. Abre la app en Expo Go
2. Presiona **`j`** en la terminal para abrir el debugger
3. Abre la consola del navegador
4. Intenta cargar los diseños presionando "Reintentar"
5. Revisa los logs detallados

Los logs mostrarán:
- URL completa de la petición
- Status code de la respuesta
- Datos de respuesta o error
- Detalles específicos del problema
