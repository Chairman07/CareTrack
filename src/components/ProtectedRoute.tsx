import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useRole } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
  fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Redirects to unauthorized if role requirements not met
 */
export function ProtectedRoute({
  children,
  requiredRoles,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const hasRole = useRole(requiredRoles);

  if (loading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

/**
 * Admin-only route
 */
export function AdminRoute({
  children,
  fallback,
}: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Doctor-only route (includes admins)
 */
export function DoctorRoute({
  children,
  fallback,
}: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'doctor']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Staff-only route (all authenticated users)
 */
export function StaffRoute({
  children,
  fallback,
}: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
