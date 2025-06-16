import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

// --- TYPE DEFINITIONS ---
interface User {
  _id: string;
  name: string;
  email?: string;
  username?: string;
  type: 'parent' | 'child';
}

interface AuthState {
  token: string | null;
  authenticated: boolean;
  user: User | null;
}

interface AuthContextData {
  authState: AuthState;
  login: (user: User, token:string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context object, initialized to null.
const AuthContext = createContext<AuthContextData | null>(null);
if (AuthContext === null) {
  throw new Error("AuthContext must be used within an AuthProvider");
}
console.log("AuthContext created");

// Create the Provider Component.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    user: null,
  });

  // Load user from storage on app startup
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userString = await SecureStore.getItemAsync('user');

        if (token && userString) {
          setAuthState({
            token,
            authenticated: true,
            user: JSON.parse(userString),
          });
        } else {
          setAuthState({ token: null, authenticated: false, user: null });
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
        setAuthState({ token: null, authenticated: false, user: null });
      }
    };
    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (user: User, token: string) => {
    try {
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      setAuthState({ token, authenticated: true, user });
    } catch (e) {
      console.error("Failed to save auth state", e);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      setAuthState({ token: null, authenticated: false, user: null });
    } catch (e) {
      console.error("Failed to clear auth state", e);
    }
  };

  // The value provided to the context
  const value = { authState, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
// The custom hook that components will use to access the context
