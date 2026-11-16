'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '../api/auth-api';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired } from '../../../lib/api/token';
import { MeUser, LoginRequest } from '../types/auth';
import axios from 'axios';
import { expireSession, invalidatePendingAuthRefreshes } from '../../../lib/api/client';
import { clearSelectedInventoryOrganization } from '../../inventory/utils/inventory-organization';

import { watchSessionExpiry } from '../../../lib/api/session-expiry';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const logoutRequestRef = useRef<Promise<void> | null>(null);

  const sessionRevision = useRef(0);

  useEffect(() => {
    const revision = sessionRevision.current;
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const handleSessionExpired = () => {
      sessionRevision.current += 1;
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      clearSelectedInventoryOrganization();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    window.addEventListener('constructcrm:session-expired', handleSessionExpired);
    const stopWatching = watchSessionExpiry(expireSession);
    const isStale = () => cancelled || revision !== sessionRevision.current;

    const initializeAuth = async () => {
      if (isStale()) return;
      let accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        if (isStale()) return;
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (!refreshToken || isTokenExpired(refreshToken)) {
        expireSession();
        return;
      }

      try {
        if (!accessToken && refreshToken) {
          const refreshResponse = await authApi.refresh({ refreshToken });
          if (!refreshResponse.success || !refreshResponse.data?.accessToken || !refreshResponse.data?.refreshToken) {
            throw new Error('Session refresh failed');
          }
          if (isStale()) return;
          setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
          accessToken = refreshResponse.data.accessToken;
        }

        if (isStale()) return;
        const response = await authApi.getMe();
        if (isStale()) return;
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          if (response.data.user.systemRole !== 'SUPER_ADMIN') clearSelectedInventoryOrganization();
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          clearTokens();
          if (isStale()) return;
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        if (isStale()) return;
        const isInvalidSession = axios.isAxiosError(error) && error.response?.status === 401;
        if (isInvalidSession) {
          clearTokens();
          if (!isStale()) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        // A network or server failure does not prove that the stored session
        // is invalid. Keep protected routes in their existing loading state
        // and retry restoration without sending the user to /login.
        if (!isStale()) retryTimer = setTimeout(() => void initializeAuth(), 5000);
      }
    };

    initializeAuth();
    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      stopWatching();
      window.removeEventListener('constructcrm:session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<MeUser> => {
    const revision = ++sessionRevision.current;
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      if (revision !== sessionRevision.current) throw new Error('Your session ended. Please sign in again.');
      if (response.success && response.data) {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        const meResponse = await authApi.getMe();
        if (revision !== sessionRevision.current) throw new Error('Your session ended. Please sign in again.');
        if (!meResponse.success || !meResponse.data?.user) {
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
          throw new Error('Unable to verify your account. Please try again.');
        }
        // Authorization decisions use the authenticated /auth/me payload,
        // whose systemRole is nullable for organization users.
        setUser(meResponse.data.user);
        if (meResponse.data.user.systemRole !== 'SUPER_ADMIN') clearSelectedInventoryOrganization();
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

  const logout = () => {
    if (logoutRequestRef.current) return logoutRequestRef.current;

    const refreshToken = getRefreshToken();
    sessionRevision.current += 1;
    invalidatePendingAuthRefreshes();
    clearSelectedInventoryOrganization();
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);

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
