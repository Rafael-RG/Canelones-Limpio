// Script para probar la API de Stitch y descubrir endpoints disponibles

const API_KEY = 'AQ.Ab8RN6IUgPtGECeR317p3EyzsT7YXx0X20E77pSj-_RxVfFXSA';
const BASE_URL = 'https://stitch.googleapis.com/mcp';

async function testStitchAPI() {
  console.log('🔍 Probando API de Stitch...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`API Key: ${API_KEY.substring(0, 15)}...`);
  console.log('=' .repeat(60));

  // Probar endpoints GET
  const getEndpoints = [
    { path: '', name: 'Root' },
    { path: '/resources', name: 'Resources' },
    { path: '/tools', name: 'Tools' },
    { path: '/designs', name: 'Designs' },
    { path: '/projects', name: 'Projects' },
    { path: '/server/info', name: 'Server Info' },
    { path: '/v1/designs', name: 'Designs v1' },
    { path: '/api/designs', name: 'API Designs' },
  ];

  console.log('\n📡 Probando endpoints con GET:\n');
  
  for (const endpoint of getEndpoints) {
    try {
      console.log(`🔍 ${endpoint.name}: ${BASE_URL}${endpoint.path}`);
      
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log(`   └─ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log(`   └─ Content-Type: ${contentType}`);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log(`   └─ ✅ Respuesta exitosa:`);
          console.log(JSON.stringify(data, null, 2).split('\n').slice(0, 10).join('\n'));
          if (JSON.stringify(data).length > 500) {
            console.log('      ... (datos truncados)');
          }
        } else {
          const text = await response.text();
          console.log(`   └─ 📄 Respuesta (texto):`);
          console.log(`      ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   └─ ❌ Error: ${errorText.substring(0, 150)}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`   └─ ❌ Error de conexión: ${error.message}\n`);
    }
  }

  // Probar con MCP Protocol
  console.log('\n📡 Probando MCP Protocol (POST):\n');
  
  const mcpMethods = [
    { method: 'initialize', params: {} },
    { method: 'resources/list', params: {} },
    { method: 'tools/list', params: {} },
    { method: 'prompts/list', params: {} },
  ];

  for (const mcpCall of mcpMethods) {
    try {
      console.log(`🔍 MCP: ${mcpCall.method}`);
      
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: mcpCall.method,
          params: mcpCall.params,
          id: 1
        })
      });

      console.log(`   └─ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   └─ ✅ Respuesta MCP:`);
        console.log(JSON.stringify(data, null, 2).split('\n').slice(0, 15).join('\n'));
        if (JSON.stringify(data).length > 500) {
          console.log('      ... (datos truncados)');
        }
      } else {
        const errorText = await response.text();
        console.log(`   └─ ❌ Error: ${errorText.substring(0, 150)}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`   └─ ❌ Error: ${error.message}\n`);
    }
  }

  console.log('=' .repeat(60));
  console.log('✅ Pruebas completadas');
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Revisa qué endpoints respondieron exitosamente');
  console.log('   2. Actualiza stitchService.js con los endpoints correctos');
  console.log('   3. Adapta la estructura de datos según la respuesta de la API');
}

// Ejecutar las pruebas
testStitchAPI().catch(console.error);
