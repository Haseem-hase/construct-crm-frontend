'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '../api/auth-api';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../../../lib/api/token';
import { MeUser, LoginUser, LoginRequest } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeUser | LoginUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: loggedInUser } = response.data;
        setTokens(accessToken, refreshToken);
        setUser(loggedInUser);
        setIsAuthenticated(true);
      } else {
        // If the backend returns a 200 with success: false (though unusual for standard errors)
        throw new Error('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout({ refreshToken });
      } catch (error) {
        // Do not throw a logout error if backend logout fails after local cleanup
      }
    }
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
