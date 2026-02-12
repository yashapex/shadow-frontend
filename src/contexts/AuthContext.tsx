import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthUser {
  name: string;
  role: "CANDIDATE" | "RECRUITER";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, userProfile: { name: string; role: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    if (token && role && name) {
      setUser({ name, role: role as AuthUser["role"] });
    }
  }, []);

  const login = (token: string, userProfile: { name: string; role: string }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", userProfile.role);
    localStorage.setItem("userName", userProfile.name);
    setUser({ name: userProfile.name, role: userProfile.role as AuthUser["role"] });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
