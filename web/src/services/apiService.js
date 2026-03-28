// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Error: ${response.status}`);
      }

      // Si es 204 No Content, no intentar parsear JSON
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // COLLECTORS
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

  // VEHICLES
  async getVehicles() {
    return this.request('/vehicles');
  }

  async getVehicle(id) {
    return this.request(`/vehicles/${id}`);
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

  // HOUSEHOLDS
  async getHouseholds() {
    return this.request('/households');
  }

  async getHousehold(id) {
    return this.request(`/households/${id}`);
  }

  async getHouseholdByQR(qrCode) {
    return this.request(`/households/by-qr/${qrCode}`);
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

  // SESSIONS
  async getSessions() {
    return this.request('/sessions');
  }

  async getActiveSessions() {
    return this.request('/sessions/active');
  }

  async getSession(id) {
    return this.request(`/sessions/${id}`);
  }

  async getSessionsByCollector(collectorId) {
    return this.request(`/sessions/by-collector/${collectorId}`);
  }

  async createSession(data) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async endSession(id, data) {
    return this.request(`/sessions/${id}/end`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // RATINGS
  async getRatings() {
    return this.request('/ratings');
  }

  async getRating(householdId, ratingId) {
    return this.request(`/ratings/${householdId}/${ratingId}`);
  }

  async getRatingsByHousehold(householdId) {
    return this.request(`/ratings/by-household/${householdId}`);
  }

  async getRatingsByCollector(collectorId) {
    return this.request(`/ratings/by-collector/${collectorId}`);
  }

  async getRatingsBySession(sessionId) {
    return this.request(`/ratings/by-session/${sessionId}`);
  }

  async createRating(data) {
    return this.request('/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // DASHBOARD
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

// Exportar una instancia única del servicio
export default new ApiService();
