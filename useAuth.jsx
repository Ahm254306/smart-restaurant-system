import { createContext, useCallback, useContext, useState } from 'react';
import { loadJSON, saveJSON, removeKey } from '../utils/storage';

// DEMO AUTHENTICATION ONLY.
// Credentials are hard-coded in the client and the session flag is kept in LocalStorage.
// This is NOT production-grade security. A real deployment needs a backend with hashed passwords,
// secure sessions/JWT, and server-side authorization.
export const DEMO_CREDENTIALS = { email: 'admin@restaurant.com', password: 'Admin123' };

const AuthContext = createContext(null);
const AUTH_KEY = 'sr_auth';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => loadJSON(AUTH_KEY, false) === true);

  const login = useCallback((email, password) => {
    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
    if (ok) {
      saveJSON(AUTH_KEY, true);
      setIsAdmin(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    removeKey(AUTH_KEY);
    setIsAdmin(false);
  }, []);

  return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
