'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '../api/auth-api';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../../../lib/api/token';
import { MeUser, LoginRequest } from '../types/auth';
import axios from 'axios';
import { invalidatePendingAuthRefreshes } from '../../../lib/api/client';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const logoutRequestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const initializeAuth = async () => {
      let accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        if (cancelled) return;
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
          if (cancelled) return;
          setUser(response.data.user);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          clearTokens();
          if (cancelled) return;
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        const isInvalidSession = axios.isAxiosError(error) && error.response?.status === 401;
        if (isInvalidSession) {
          clearTokens();
          if (!cancelled) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        // A network or server failure does not prove that the stored session
        // is invalid. Keep protected routes in their existing loading state
        // and retry restoration without sending the user to /login.
        if (!cancelled) retryTimer = setTimeout(() => void initializeAuth(), 5000);
      }
    };

    initializeAuth();
    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<MeUser> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        const meResponse = await authApi.getMe();
        if (!meResponse.success || !meResponse.data?.user) {
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
          throw new Error('Unable to verify your account. Please try again.');
        }
        // Authorization decisions use the authenticated /auth/me payload,
        // whose systemRole is nullable for organization users.
        setUser(meResponse.data.user);
        setIsAuthenticated(true);
        return meResponse.data.user;
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

  const logout = () => {
    if (logoutRequestRef.current) return logoutRequestRef.current;

    const refreshToken = getRefreshToken();
    invalidatePendingAuthRefreshes();
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);

    const request = (async () => {
      if (!refreshToken) return;
      try {
        await authApi.logout({ refreshToken });
      } catch {
        // Local logout remains complete if the backend is unavailable.
      }
    })();
    logoutRequestRef.current = request.finally(() => {
      logoutRequestRef.current = null;
    });
    return logoutRequestRef.current;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
