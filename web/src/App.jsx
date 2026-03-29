import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminCollectors from './pages/AdminCollectors'
import AdminHousing from './pages/AdminHousing'
import AdminFleet from './pages/AdminFleet'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/collectors" element={<ProtectedRoute><AdminCollectors /></ProtectedRoute>} />
          <Route path="/admin/housing" element={<ProtectedRoute><AdminHousing /></ProtectedRoute>} />
          <Route path="/admin/fleet" element={<ProtectedRoute><AdminFleet /></ProtectedRoute>} />
          
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Catch all - redirect to admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

