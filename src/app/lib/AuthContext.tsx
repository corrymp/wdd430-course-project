"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode
} from "react";

type AuthContextType = {
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
let didInit = false;
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  if(!didInit && typeof window !== 'undefined') {
    // this is okay according to React: https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
    /* eslint-disable react-hooks/globals */
    didInit = true;
    /* eslint-enable react-hooks/globals */
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
