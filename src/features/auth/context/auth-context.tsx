import { createContext } from 'react';
import { MeUser, LoginUser, LoginRequest } from '../types/auth';

export interface AuthContextType {
  user: MeUser | LoginUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
