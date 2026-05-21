import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Layout          from './components/Layout';

// Pages admin
import LoginPage       from './pages/loginPage';
import Dashboard       from './pages/Dashboard';
import StatisticsPage  from './pages/StatisticsPage';
import AlertsPage      from './pages/AlertsPage';
import ParentsPage     from './pages/ParentsPage';
import StudentsPage    from './pages/StudentsPage';
import DriversPage     from './pages/DriversPage';
import VehiclesPage    from './pages/VehiclesPage';

// Espace parent séparé
import ParentSpace     from './pages/ParentsPage';

// ── Garde routes ────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { token, role } = useAuth();
  if (!token) return children;
  return <Navigate to={role === 'parent' ? '/parent' : '/dashboard'} replace />;
};

const ParentRoute = ({ children }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'parent') return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>

      {/* ── Login ──────────────────────────────────────────────── */}
      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />

      {/* ── Espace parent (sans Layout admin) ─────────────────── */}
      <Route path="/parent" element={
        <ParentRoute><ParentSpace /></ParentRoute>
      } />

      {/* ── Admin (avec sidebar Layout) ───────────────────────── */}
      <Route path="/" element={
        <PrivateRoute><Layout /></PrivateRoute>
      }>
        <Route index            element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="alerts"     element={<AlertsPage />} />
        <Route path="parents"    element={<ParentsPage />} />
        <Route path="students"   element={<StudentsPage />} />
        <Route path="drivers"    element={<DriversPage />} />
        <Route path="vehicles"   element={<VehiclesPage />} />
      </Route>

      {/* ── 404 ────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}