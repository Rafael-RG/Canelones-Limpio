import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminCollectors from './pages/AdminCollectors'
import AdminHousing from './pages/AdminHousing'
import AdminFleet from './pages/AdminFleet'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/collectors" element={<AdminCollectors />} />
        <Route path="/admin/housing" element={<AdminHousing />} />
        <Route path="/admin/fleet" element={<AdminFleet />} />
        
        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

