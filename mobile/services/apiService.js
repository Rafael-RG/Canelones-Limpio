// Configuración del API
const API_CONFIG = {
  // Para dispositivo físico o pruebas con backend en Azure
  baseUrl: 'https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net/api',
  
  // Para desarrollo local:
  // Android emulator: http://10.0.2.2:5001/api
  // iOS simulator: http://localhost:5001/api
  // Dispositivo físico (misma red): http://192.168.x.x:5001/api
};

/**
 * Cliente HTTP para interactuar con el backend
 */
class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  /**
   * Realizar petición HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ============ RECOLECTORES ============
  
  async getCollectors() {
    return this.request('/collectors');
  }

  async getCollector(id) {
    return this.request(`/collectors/${id}`);
  }

  async createCollector(data) {
    return this.request('/collectors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCollector(id, data) {
    return this.request(`/collectors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCollector(id) {
    return this.request(`/collectors/${id}`, {
      method: 'DELETE',
    });
  }

  async authenticateCollector(collectorId) {
    // Buscar recolector por ID
    const collectors = await this.getCollectors();
    const collector = collectors.find(c => c.id === collectorId || c.id === collectorId.toUpperCase());
    
    if (!collector) {
      throw new Error('Recolector no encontrado con ID: ' + collectorId);
    }

    if (collector.status !== 'Activo') {
      throw new Error('Recolector no está activo (Estado: ' + collector.status + ')');
    }

    return collector;
  }

  // ============ VEHÍCULOS ============
  
  async getVehicles() {
    return this.request('/vehicles');
  }

  async getVehicle(id) {
    return this.request(`/vehicles/${id}`);
  }

  async getAvailableVehicles() {
    const vehicles = await this.getVehicles();
    return vehicles.filter(v => v.status === 'Operativo');
  }

  async createVehicle(data) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVehicle(id, data) {
    return this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVehicle(id) {
    return this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ HOGARES ============
  
  async getHouseholds() {
    return this.request('/households');
  }

  async getHousehold(id) {
    return this.request(`/households/${id}`);
  }

  async getHouseholdByQr(code) {
    const households = await this.getHouseholds();
    return households.find(h => 
      h.qrCode === code || 
      h.qrCode === code.toUpperCase() ||
      h.id === code ||
      h.id === code.toUpperCase()
    );
  }

  async createHousehold(data) {
    return this.request('/households', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHousehold(id, data) {
    return this.request(`/households/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHousehold(id) {
    return this.request(`/households/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ SESIONES DE RECOLECCIÓN ============
  
  async getSessions() {
    return this.request('/sessions');
  }

  async getSession(id) {
    return this.request(`/sessions/${id}`);
  }

  async createSession(data) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSession(id, data) {
    return this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async endSession(id) {
    return this.request(`/sessions/${id}/end`, {
      method: 'POST',
      body: JSON.stringify({
        endTime: new Date().toISOString()
      }),
    });
  }

  async finishSession(id) {
    return this.endSession(id);
  }

  async deleteSession(id) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  async getSessionsByCollector(collectorId) {
    const sessions = await this.getSessions();
    return sessions.filter(s => s.collectorId === collectorId);
  }

  // ============ CALIFICACIONES ============
  
  async getRatings() {
    return this.request('/ratings');
  }

  async getRating(id) {
    return this.request(`/ratings/${id}`);
  }

  async createRating(data) {
    return this.request('/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRating(householdId, ratingId, data) {
    return this.request(`/ratings/${householdId}/${ratingId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRating(householdId, ratingId) {
    return this.request(`/ratings/${householdId}/${ratingId}`, {
      method: 'DELETE',
    });
  }

  async getRatingsByHousehold(householdId) {
    const ratings = await this.getRatings();
    return ratings.filter(r => r.householdId === householdId);
  }

  async getRatingsBySession(sessionId) {
    const ratings = await this.getRatings();
    return ratings.filter(r => r.sessionId === sessionId);
  }

  // ============ DASHBOARD ============
  
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

// Exportar instancia única
export default new ApiService();
