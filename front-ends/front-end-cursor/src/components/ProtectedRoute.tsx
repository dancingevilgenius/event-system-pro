import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { AppRole } from '../lib/session';
import { useAuth } from '../hooks/useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: AppRole[];
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { session, hasAnyRole } = useAuth();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (roles && !hasAnyRole(roles)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
