import { useState, useEffect } from 'react';
import stitchService from '../services/stitchService';

/**
 * Hook para cargar diseños de Stitch
 */
export const useStitchDesign = (designId) => {
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDesign = async () => {
      try {
        setLoading(true);
        const data = await stitchService.getDesign(designId);
        setDesign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (designId) {
      loadDesign();
    }
  }, [designId]);

  return { design, loading, error };
};

/**
 * Hook para cargar todos los diseños
 */
export const useStitchDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setLoading(true);
        const data = await stitchService.getDesigns();
        setDesigns(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, []);

  return { designs, loading, error, reload: () => loadDesigns() };
};

/**
 * Hook para cargar componentes de un diseño
 */
export const useStitchComponents = (designId) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true);
        const data = await stitchService.getDesignComponents(designId);
        setComponents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (designId) {
      loadComponents();
    }
  }, [designId]);

  return { components, loading, error };
};
