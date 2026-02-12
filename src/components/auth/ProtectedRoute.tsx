import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "CANDIDATE" | "RECRUITER";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== requiredRole) {
    // Redirect to the correct dashboard for their role
    const correctPath = user?.role === "RECRUITER" ? "/recruiter" : "/dashboard";
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
}
