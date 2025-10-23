import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('course-sphere-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await apiLogin(email, password);
      setUser(userData);
      localStorage.setItem('course-sphere-user', JSON.stringify(userData));
      navigate('/dashboard');  
    } catch (error) {
      console.error("Falha no login:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('course-sphere-user');
    navigate('/login'); 
  };

  const value = {
    user,    
    login,
    logout,
    isAuthenticated: !!user
  };
  
  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
};