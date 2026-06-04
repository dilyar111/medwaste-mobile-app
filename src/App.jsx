import React, { Suspense, lazy } from "react";
import { Capacitor } from "@capacitor/core";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";

// Route-level code splitting keeps the WebView initial payload smaller on mobile.
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Containers = lazy(() => import("./pages/Containers"));
const MapPage = lazy(() => import("./pages/MapPage"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Reports = lazy(() => import("./pages/Reports"));
const DriverRegistration = lazy(() => import("./pages/DriverRegistration"));
const RouteHistory = lazy(() => import("./pages/RouteHistory"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminApprovals = lazy(() => import("./pages/Adminapprovals.jsx"));
const AdminDispatch = lazy(() => import("./pages/AdminDispatch"));
const UtilizerPage = lazy(() => import("./pages/Utilizerpage.jsx"));
const UtilizerRegistration = lazy(() => import("./pages/Utilizerregistration.jsx"));
const DriverDashboard = lazy(() => import("./pages/Driverdashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));

// Components
import Layout       from "./components/Layout";
import PrivateRoute from "./components/Privateroute.jsx";
import ApiConfigBanner from "./components/ApiConfigBanner.jsx";

const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      Loading MedWaste...
    </div>
  );
}

function App() {
  return (
    <div className="mobile-shell web-shell">
      <Router>
        <ApiConfigBanner />
        <Suspense fallback={<RouteFallback />}>
          <Routes>

        {/* ── Public ──────────────────────────────────────── */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected — all logged-in users ─────────────── */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index                    element={<Dashboard />} />
          <Route path="containers"        element={<Containers />} />
          <Route path="map"               element={<MapPage />} />
          <Route path="alerts"            element={<Alerts />} />
          <Route path="reports"           element={<Reports />} />
          <Route path="driver-registration" element={<DriverRegistration />} />
          <Route path="routes-history"    element={<RouteHistory />} />
          <Route path="profile"           element={<Profile />} />
          <Route path="utilizer-registration" element={<UtilizerRegistration />} />
          <Route path="driver-dashboard"        element={<DriverDashboard />} />

          {/* ── Admin only ──────────────────────────────── */}
          <Route
            path="admin/drivers"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminApprovals driverOnly />
              </PrivateRoute>
            }
          />
          <Route
            path="driver-approvals"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminApprovals driverOnly />
              </PrivateRoute>
            }
          />
          <Route
            path="approvals"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminApprovals />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/dispatch"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDispatch />
              </PrivateRoute>
            }
          />
          <Route 
            path="admin/users" 
            element={
              <PrivateRoute requiredRole="admin">
                <AdminUsers />
              </PrivateRoute>
            }  
          />

          {/* ── Utilizer only ───────────────────────────── */}
          <Route
            path="utilizer"
            element={
              <PrivateRoute requiredRole="utilizer">
                <UtilizerPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="utilizer-registration" 
            element={
              <UtilizerRegistration />
            } 
          />
        </Route>

        {/* ── Catch-all ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
