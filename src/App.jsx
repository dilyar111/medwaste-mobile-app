import React from "react";
import { Capacitor } from "@capacitor/core";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home               from "./pages/Home";
import Login              from "./pages/Auth/Login";
import Register           from "./pages/Auth/Register";
import Dashboard          from "./pages/Dashboard";
import Containers         from "./pages/Containers";
import MapPage            from "./pages/MapPage";
import Alerts             from "./pages/Alerts";
import Reports            from "./pages/Reports";
import DriverRegistration from "./pages/DriverRegistration";
import RouteHistory       from "./pages/RouteHistory";
import Profile            from "./pages/Profile";
import AdminApprovals     from "./pages/Adminapprovals.jsx";
import AdminUsers         from "./pages/AdminUsers";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminInquiries from "./pages/AdminInquiries";
import UtilizerPage       from "./pages/Utilizerpage.jsx";
import UtilizerInbound    from "./pages/UtilizerInbound.jsx";
import UtilizerRegistration from "./pages/Utilizerregistration.jsx";
import DriverDashboard    from "./pages/Driverdashboard";

// Components
import Layout       from "./components/Layout";
import PrivateRoute from "./components/Privateroute.jsx";
import ApiConfigBanner from "./components/ApiConfigBanner.jsx";

const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

function App() {
  return (
    <div className="mobile-shell">
      <Router>
        <ApiConfigBanner />
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
            path="admin/organizations"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminOrganizations />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/inquiries"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminInquiries />
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
            path="utilizer/inbound"
            element={
              <PrivateRoute requiredRole="utilizer">
                <UtilizerInbound />
              </PrivateRoute>
            }
          />
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
      </Router>
    </div>
  );
}

export default App;