'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '../api/auth-api';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../../../lib/api/token';
import { MeUser, LoginUser, LoginRequest } from '../types/auth';
import axios from 'axios';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeUser | LoginUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      let accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        if (!accessToken && refreshToken) {
          const refreshResponse = await authApi.refresh({ refreshToken });
          if (!refreshResponse.success || !refreshResponse.data?.accessToken || !refreshResponse.data?.refreshToken) {
            throw new Error('Session refresh failed');
          }
          setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
          accessToken = refreshResponse.data.accessToken;
        }

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
        // Preserve tokens when the API is temporarily unavailable. The next
        // visit can retry validation without signing out a valid user.
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          clearTokens();
        } else if (!axios.isAxiosError(error)) {
          clearTokens();
        }
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

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    window.addEventListener('constructcrm:session-expired', handleSessionExpired);
    return () => window.removeEventListener('constructcrm:session-expired', handleSessionExpired);
  }, []);

  const logout = async () => {
    const refreshToken = getRefreshToken();
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    if (refreshToken) {
      try {
        await authApi.logout({ refreshToken });
      } catch (error) {
        // Local logout remains complete if the backend is unavailable.
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
