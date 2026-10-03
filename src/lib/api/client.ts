import axios, { AxiosInstance } from 'axios';

/**
 * Central HTTP client for ConstructCRM frontend ↔ backend communication.
 * 
 * BASE URL CONSTRUCTION:
 * The NEXT_PUBLIC_API_URL environment variable is expected to contain the full
 * base URL including the API prefix. 
 * 
 * Example:
 * NEXT_PUBLIC_API_URL="http://localhost:5001/api"
 * 
 * When making requests, provide the path starting with a forward slash, e.g.:
 * apiClient.post('/auth/login')
 * 
 * This prevents double-prefixing like '/api/api/auth/login' and keeps request paths clean.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Note: Future response and request interceptors for token attachment and 
// global error handling will be added here in a later phase.
