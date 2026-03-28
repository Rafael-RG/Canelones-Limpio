import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import stitchService from '../services/stitchService';

/**
 * Navegador de proyectos de Stitch
 * Muestra todos los proyectos y sus pantallas
 */
export default function StitchProjectsScreen({ onSelectScreen }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener lista de proyectos del usuario
      const response = await stitchService.callTool('list_projects', {});
      console.log('Proyectos obtenidos:', response);
      
      // Extraer los proyectos del content
      const projectsList = response?.content?.[0]?.text 
        ? JSON.parse(response.content[0].text).projects 
        : [];
      
      setProjects(projectsList);
      
      // Si hay al menos un proyecto, seleccionarlo automáticamente
      if (projectsList.length > 0) {
        selectProject(projectsList[0]);
      }
    } catch (err) {
      console.error('Error cargando proyectos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = async (project) => {
    try {
      setSelectedProject(project);
      setLoading(true);
      
      // Obtener pantallas del proyecto
      const response = await stitchService.callTool('list_screens', {
        project_name: project.name
      });
      
      console.log('Pantallas del proyecto:', response);
      
      const screensList = response?.content?.[0]?.text 
        ? JSON.parse(response.content[0].text).screens 
        : [];
      
      setScreens(screensList);
    } catch (err) {
      console.error('Error cargando pantallas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedProject) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando tus proyectos de Stitch...</Text>
      </View>
    );
  }

  if (error && projects.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProjects}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No hay proyectos</Text>
        <Text style={styles.emptyText}>
          Crea un proyecto en Stitch primero para verlo aquí.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Selector de proyectos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Proyectos de Stitch</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {projects.map((project) => (
            <TouchableOpacity
              key={project.name}
              style={[
                styles.projectCard,
                selectedProject?.name === project.name && styles.projectCardSelected
              ]}
              onPress={() => selectProject(project)}
            >
              <Text style={styles.projectName}>{project.display_name || project.name}</Text>
              <Text style={styles.projectInfo} numberOfLines={2}>
                {project.description || 'Proyecto de Stitch'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de pantallas del proyecto seleccionado */}
      {selectedProject && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pantallas en "{selectedProject.display_name || selectedProject.name}"
          </Text>
          
          {loading ? (
            <ActivityIndicator size="small" color="#0066cc" />
          ) : screens.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay pantallas en este proyecto aún.
            </Text>
          ) : (
            screens.map((screen) => (
              <TouchableOpacity
                key={screen.name}
                style={styles.screenCard}
                onPress={() => onSelectScreen(selectedProject, screen)}
              >
                <Text style={styles.screenName}>
                  {screen.display_name || screen.name}
                </Text>
                {screen.description && (
                  <Text style={styles.screenDescription} numberOfLines={2}>
                    {screen.description}
                  </Text>
                )}
                <Text style={styles.screenAction}>👉 Tocar para abrir</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  projectCardSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#e3f2fd',
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  projectInfo: {
    fontSize: 13,
    color: '#666',
  },
  screenCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  screenName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  screenDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  screenAction: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
