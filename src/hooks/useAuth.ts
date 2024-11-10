import { useState, useCallback } from 'react';
import { UserModel } from '../database/models/User';
import { comparePasswords } from '../utils/password';

interface AuthUser {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = useCallback(async (email: string, password: string, isLogin: boolean) => {
    try {
      setError(null);
      
      const existingUser = await UserModel.findByEmail(email);
      
      if (!existingUser) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await comparePasswords(password, existingUser.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      setUser({ 
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
      });
      setIsAuthenticated(true);
      setShowAuthModal(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const isAdmin = user?.role === 'admin';

  return {
    isAuthenticated,
    showAuthModal,
    setShowAuthModal,
    user,
    error,
    handleAuth,
    logout,
    isAdmin,
  };
}