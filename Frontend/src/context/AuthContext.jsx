import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, api } from '../services/authService';
import LoadingScreen from '../components/LoadingScreen';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await checkAuth();
        if (response.success && response.user) {
          setUser({
            ...response.user,
            isAccountVerified: response.user.isAccountVerified,
            role: response.user.role
          });
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser({
      ...userData,
      isAccountVerified: userData.isAccountVerified,
      role: userData.role
    });
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 