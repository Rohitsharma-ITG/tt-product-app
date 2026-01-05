import { useState, useEffect } from 'react';
import { Api } from '../components/api.ts';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const api = new Api();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await api.checkAuthStatus();
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, []);

  return isAuthenticated;
}
