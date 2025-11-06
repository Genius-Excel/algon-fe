import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../Types/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log('⚠️ Role not allowed:', user.role, 'Allowed:', allowedRoles);
    
    // ✅ Redirect to appropriate dashboard based on actual role
    if (user.role === 'superAdmin') {
      return <Navigate to="/super-admin-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/lg-admin-dashboard" replace />;
    } else {
      return <Navigate to="/applicant-dashboard" replace />;
    }
  }

  return <>{children}</>;
}