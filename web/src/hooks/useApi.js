import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export function useCollectors() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCollectors();
      setCollectors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collectors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const createCollector = async (collectorData) => {
    try {
      const newCollector = await apiService.createCollector(collectorData);
      setCollectors(prev => [...prev, newCollector]);
      return newCollector;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCollector = async (id, updates) => {
    try {
      const updated = await apiService.updateCollector(id, updates);
      setCollectors(prev => 
        prev.map(c => c.id === id ? updated : c)
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCollector = async (id) => {
    try {
      await apiService.deleteCollector(id);
      setCollectors(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    collectors,
    loading,
    error,
    refetch: fetchCollectors,
    createCollector,
    updateCollector,
    deleteCollector,
  };
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const createVehicle = async (vehicleData) => {
    try {
      const newVehicle = await apiService.createVehicle(vehicleData);
      setVehicles(prev => [...prev, newVehicle]);
      return newVehicle;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateVehicle = async (id, updates) => {
    try {
      const updated = await apiService.updateVehicle(id, updates);
      setVehicles(prev => 
        prev.map(v => v.id === id ? updated : v)
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await apiService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}

export function useHouseholds() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHouseholds();
      setHouseholds(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching households:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const createHousehold = async (householdData) => {
    try {
      const newHousehold = await apiService.createHousehold(householdData);
      setHouseholds(prev => [...prev, newHousehold]);
      return newHousehold;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateHousehold = async (id, updates) => {
    try {
      const updated = await apiService.updateHousehold(id, updates);
      setHouseholds(prev => 
        prev.map(h => h.id === id ? updated : h)
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteHousehold = async (id) => {
    try {
      await apiService.deleteHousehold(id);
      setHouseholds(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    households,
    loading,
    error,
    refetch: fetchHouseholds,
    createHousehold,
    updateHousehold,
    deleteHousehold,
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
