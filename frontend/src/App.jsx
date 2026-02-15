import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Producers from './pages/Producers'
import Collections from './pages/Collections'
import Finance from './pages/Finance'
import Inventory from './pages/Inventory'
import Employees from './pages/Employees'
import Customers from './pages/Customers'
import Suppliers from './pages/Suppliers'
import Projects from './pages/Projects'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import SettingsDetail from './pages/SettingsDetail'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center gap-8 z-50">
      <div className="text-4xl font-bold font-display text-gradient">
        SCCK ERP
      </div>
      <div className="w-[300px] h-1 bg-primary-500/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple w-1/2 animate-pulse" />
      </div>
      <div className="text-sm text-gray-400 font-mono">Loading...</div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="producers" element={<Producers />} />
            <Route path="collections" element={<Collections />} />
            <Route path="finance" element={<Finance />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="employees" element={<Employees />} />
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/:section" element={<SettingsDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
