// Configuración de Stitch API
const STITCH_CONFIG = {
  apiUrl: 'https://stitch.googleapis.com/mcp',
  apiKey: 'AQ.Ab8RN6IUgPtGECeR317p3EyzsT7YXx0X20E77pSj-_RxVfFXSA',
};

/**
 * Servicio para interactuar con la API de Stitch usando MCP Protocol
 */
class StitchService {
  constructor() {
    this.baseUrl = STITCH_CONFIG.apiUrl;
    this.apiKey = STITCH_CONFIG.apiKey;
    this.requestId = 1;
    this.initialized = false;
  }

  /**
   * Inicializar la conexión MCP
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const response = await this.mcpRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'Canelones Limpio Web',
          version: '1.0.0'
        }
      });

      console.log('MCP initialized:', response);
      this.initialized = true;
      return response;
    } catch (error) {
      console.error('Error initializing MCP:', error);
      throw error;
    }
  }

  /**
   * Realizar petición usando MCP Protocol (JSON-RPC 2.0)
   */
  async mcpRequest(method, params = {}) {
    try {
      const url = this.baseUrl;
      const requestBody = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: this.requestId++
      };

      console.log('MCP Request:', method, params);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('MCP Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('MCP Error Response:', errorText);
        throw new Error(`Error en Stitch MCP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('MCP Response Data:', data);

      // Verificar si hay error en la respuesta JSON-RPC
      if (data.error) {
        throw new Error(`MCP Error: ${data.error.message} (code: ${data.error.code})`);
      }

      return data.result || data;
    } catch (error) {
      console.error('Error en MCP request:', error);
      throw error;
    }
  }

  /**
   * Obtener herramientas disponibles (diseños, proyectos, etc.)
   */
  async getTools() {
    return this.mcpRequest('tools/list');
  }

  /**
   * Obtener recursos disponibles
   */
  async getResources() {
    return this.mcpRequest('resources/list');
  }

  /**
   * Obtener diseños disponibles
   * Nota: Stitch organiza diseños como herramientas (tools)
   */
  async getDesigns() {
    // Primero inicializar si no está inicializado
    if (!this.initialized) {
      await this.initialize();
    }

    // Obtener lista de herramientas que incluyen proyectos y diseños
    const toolsResponse = await this.getTools();
    console.log('Tools disponibles:', toolsResponse);
    
    // Las herramientas contienen información sobre proyectos de Stitch
    // Cada proyecto puede tener diseños
    const tools = toolsResponse.tools || [];
    
    // Convertir herramientas a formato de diseños para la UI
    const designs = tools
      .filter(tool => tool.name && tool.description)
      .map((tool, index) => ({
        id: tool.name,
        name: tool.name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
        description: tool.description,
        type: 'tool',
        inputSchema: tool.inputSchema
      }));

    return designs;
  }

  /**
   * Llamar a una herramienta específica de Stitch
   */
  async callTool(toolName, args = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.mcpRequest('tools/call', {
      name: toolName,
      arguments: args
    });
  }

  /**
   * Métodos legacy para compatibilidad
   */
  async getDesign(designId) {
    return this.callTool(designId);
  }

  async getDesignComponents(designId) {
    return this.callTool(`${designId}_components`);
  }

  async getDesignStyles(designId) {
    return this.callTool(`${designId}_styles`);
  }

  async getAssets(designId) {
    return this.callTool(`${designId}_assets`);
  }
}

export default new StitchService();
