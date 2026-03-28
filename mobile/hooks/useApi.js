import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

/**
 * Hook para manejar llamadas a la API con estado
 */
export function useApiCall(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      console.error('API Call Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook para recolectores
 */
export function useCollectors() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCollectors();
      setCollectors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authenticateCollector = async (qrCode) => {
    try {
      setError(null);
      return await apiService.authenticateCollector(qrCode);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  return {
    collectors,
    loading,
    error,
    refetch: fetchCollectors,
    authenticateCollector,
  };
}

/**
 * Hook para vehículos
 */
export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableVehicles = async () => {
    try {
      setError(null);
      return await apiService.getAvailableVehicles();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
    getAvailableVehicles,
  };
}

/**
 * Hook para hogares
 */
export function useHouseholds() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHouseholds();
      setHouseholds(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHouseholdByQr = async (qrCode) => {
    try {
      setError(null);
      return await apiService.getHouseholdByQr(qrCode);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  return {
    households,
    loading,
    error,
    refetch: fetchHouseholds,
    getHouseholdByQr,
  };
}

/**
 * Hook para sesiones
 */
export function useSessions(collectorId = null) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (collectorId) {
        data = await apiService.getSessionsByCollector(collectorId);
      } else {
        data = await apiService.getSessions();
      }
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData) => {
    try {
      setError(null);
      const newSession = await apiService.createSession(sessionData);
      await fetchSessions();
      return newSession;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const finishSession = async (sessionId) => {
    try {
      setError(null);
      await apiService.finishSession(sessionId);
      await fetchSessions();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [collectorId]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    createSession,
    finishSession,
  };
}

/**
 * Hook para calificaciones
 */
export function useRatings(sessionId = null) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (sessionId) {
        data = await apiService.getRatingsBySession(sessionId);
      } else {
        data = await apiService.getRatings();
      }
      setRatings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRating = async (ratingData) => {
    try {
      setError(null);
      const newRating = await apiService.createRating(ratingData);
      await fetchRatings();
      return newRating;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [sessionId]);

  return {
    ratings,
    loading,
    error,
    refetch: fetchRatings,
    createRating,
  };
}
