import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Typography } from '@mui/material';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      

      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />} 
      />
      
      <Route path="*" element={<Typography>Página não encontrada (404)</Typography>} />
    </Routes>
  );
}

export default App;