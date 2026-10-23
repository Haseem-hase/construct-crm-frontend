import { createContext } from 'react';
import { MeUser, LoginRequest } from '../types/auth';

export interface AuthContextType {
  user: MeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<MeUser>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
