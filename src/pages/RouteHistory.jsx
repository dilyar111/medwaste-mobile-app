import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import {
  AlertTriangle,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Map as MapIcon,
  MapPin,
  Navigation,
  PackageCheck,
  RefreshCw,
  Route,
  Truck,
  XCircle,
} from "lucide-react";
import { getRouteHistory, getRouteHistoryDetail } from "../services/api";
import { getSharedSocket, useSocket } from "../hooks/useSocket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultKpis = {
  totalRoutes: 0,
  completed: 0,
  totalDistance: 0,
  containersCollected: 0,
};
const MAX_POLYLINE_POINTS = 1000;
const MAX_MARKERS = 100;

function samplePoints(points, maxPoints) {
  if (!Array.isArray(points) || points.length <= maxPoints) return points || [];
  if (maxPoints <= 2) return [points[0], points[points.length - 1]];

  const sampled = [points[0]];
  const step = (points.length - 2) / (maxPoints - 2);
  for (let i = 1; i < maxPoints - 1; i += 1) {
    sampled.push(points[Math.round(i * step)]);
  }
  sampled.push(points[points.length - 1]);
  return sampled;
}

const css = `
  .rh-root {
    --rh-bg: #f4f3f8;
    --rh-card: #ffffff;
    --rh-ink: #101318;
    --rh-muted: #7d8490;
    --rh-line: #e7e7ef;
    --rh-teal: #149d80;
    --rh-teal-dark: #0d8069;
    --rh-teal-soft: #e7f6f1;
    --rh-blue: #4f96ce;
    --rh-blue-dark: #286b9d;
    --rh-blue-soft: #e8f2fb;
    --rh-red: #e6535d;
    --rh-red-soft: #fff0f1;
    --rh-amber: #f4a62a;
    --rh-amber-soft: #fff8e8;
    --rh-purple: #8b7bd8;
    --rh-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--rh-bg);
    color: var(--rh-ink);
  }

  .rh-root,
  .rh-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .rh-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  .rh-header h1 {
    margin: 0 0 5px;
    color: var(--rh-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .rh-header p {
    margin: 0;
    max-width: 720px;
    color: var(--rh-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .rh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #fff;
    color: var(--rh-ink);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .rh-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .rh-btn:disabled {
    cursor: not-allowed;
    opacity: .6;
    transform: none;
  }

  .rh-btn-green,
  .rh-btn-blue {
    border-color: rgba(20,157,128,.2);
    background: var(--rh-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .rh-btn-green:hover,
  .rh-btn-blue:hover {
    background: var(--rh-teal-dark);
  }

  .rh-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 16px;
  }

  .rh-kpi-card,
  .rh-filters,
  .rh-sidebar,
  .rh-map-card {
    border: 1px solid rgba(231,231,239,.92);
    background: rgba(255,255,255,.96);
    box-shadow: var(--rh-shadow);
  }

  .rh-kpi-card {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 18px;
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .rh-kpi-card:hover {
    transform: translateY(-1px);
  }

  .rh-kpi-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .rh-kpi-card:nth-child(1)::before { background: var(--rh-blue); }
  .rh-kpi-card:nth-child(2)::before { background: var(--rh-teal); }
  .rh-kpi-card:nth-child(3)::before { background: var(--rh-purple); }
  .rh-kpi-card:nth-child(4)::before { background: var(--rh-amber); }

  .rh-kpi-label {
    margin-bottom: 7px;
    color: var(--rh-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .rh-kpi-val {
    color: var(--rh-ink);
    font-size: clamp(1.25rem, 5vw, 1.65rem);
    font-weight: 900;
    line-height: 1;
  }

  .rh-kpi-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
    background: var(--rh-teal-soft);
    color: var(--rh-teal-dark);
  }

  .rh-filters {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 14px;
    align-items: end;
    margin-bottom: 16px;
    padding: 14px;
    border-radius: 18px;
  }

  .rh-field label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: var(--rh-muted);
    font-size: .74rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .rh-select-wrap {
    position: relative;
  }

  .rh-field select {
    width: 100%;
    min-height: 40px;
    padding: 0 36px 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    color: var(--rh-ink);
    cursor: pointer;
    outline: none;
    appearance: none;
    font: inherit;
    font-size: .84rem;
    font-weight: 800;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .rh-field select:focus {
    border-color: rgba(20,157,128,.72);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .rh-select-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    color: var(--rh-muted);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .rh-error {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 12px;
    padding: 10px 12px;
    border: 1px solid rgba(230,83,93,.24);
    border-radius: 12px;
    background: var(--rh-red-soft);
    color: var(--rh-red);
    font-size: .82rem;
    font-weight: 800;
  }

  .rh-main {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 16px;
  }

  .rh-sidebar,
  .rh-map-card {
    overflow: hidden;
    border-radius: 18px;
  }

  .rh-sidebar {
    display: flex;
    flex-direction: column;
    height: 580px;
  }

  .rh-sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 15px 16px;
    border-bottom: 1px solid rgba(231,231,239,.8);
    color: var(--rh-ink);
    font-size: .96rem;
    font-weight: 900;
  }

  .rh-sidebar-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .rh-sidebar-count {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    border-radius: 999px;
    background: var(--rh-blue-soft);
    color: var(--rh-blue-dark);
    font-size: .72rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .rh-sidebar-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .rh-empty,
  .rh-map-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
    padding: 22px;
    color: var(--rh-muted);
    font-size: .84rem;
    font-weight: 800;
    line-height: 1.55;
    text-align: center;
  }

  .rh-empty-icon,
  .rh-map-placeholder-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: var(--rh-teal-soft);
    color: var(--rh-teal-dark);
  }

  .rh-empty-icon svg.loading {
    animation: rhSpin .9s linear infinite;
  }

  @keyframes rhSpin {
    to { transform: rotate(360deg); }
  }

  .rh-empty h3,
  .rh-map-placeholder h2 {
    margin: 0;
    color: var(--rh-ink);
    font-size: .96rem;
    font-weight: 900;
  }

  .rh-empty p,
  .rh-map-placeholder p {
    margin: 0;
    color: var(--rh-muted);
    font-size: .82rem;
    line-height: 1.55;
  }

  .rh-route-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 8px;
    padding: 12px 13px 12px 15px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 14px;
    background: #fff;
    cursor: pointer;
    transition: background .2s ease, border-color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .rh-route-item:hover {
    border-color: rgba(20,157,128,.22);
    background: #fbfcfd;
    transform: translateY(-1px);
  }

  .rh-route-item.active {
    border-color: rgba(20,157,128,.32);
    background: var(--rh-teal-soft);
    box-shadow: 0 8px 18px rgba(20,157,128,.08);
  }

  .rh-route-item-accent {
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: var(--rh-teal);
  }

  .rh-route-name {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    color: var(--rh-ink);
    font-size: .88rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .rh-route-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 7px;
    color: var(--rh-muted);
    font-size: .74rem;
    font-weight: 800;
    line-height: 1.3;
  }

  .rh-route-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: .7rem;
    font-weight: 900;
    line-height: 1.2;
    white-space: nowrap;
  }

  .rh-status-done { background: var(--rh-teal-soft); color: var(--rh-teal-dark); }
  .rh-status-cancelled { background: var(--rh-red-soft); color: var(--rh-red); }
  .rh-status-active { background: var(--rh-blue-soft); color: var(--rh-blue-dark); }

  .rh-map-card {
    display: flex;
    flex-direction: column;
    height: 580px;
  }

  .rh-map-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .rh-map-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--rh-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .rh-map-subtitle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--rh-muted);
    font-size: .78rem;
    font-weight: 800;
    overflow-wrap: anywhere;
  }

  .rh-map-body {
    position: relative;
    flex: 1;
  }

  @media(max-width: 860px) {
    .rh-root {
      padding: 16px;
    }

    .rh-main {
      grid-template-columns: 1fr;
    }

    .rh-kpi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .rh-filters {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .rh-filters .rh-btn {
      grid-column: 1 / -1;
      width: 100%;
    }

    .rh-map-card,
    .rh-sidebar {
      height: 430px;
    }
  }

  @media(max-width: 700px) {
    .rh-header {
      align-items: stretch;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .rh-header h1 {
      font-size: 1.45rem;
    }

    .rh-header p {
      font-size: .82rem;
    }

    .rh-btn {
      width: 100%;
      min-height: 38px;
      padding: 0 10px;
      font-size: .78rem;
    }

    .rh-kpi-grid,
    .rh-filters {
      grid-template-columns: 1fr;
    }

    .rh-kpi-card,
    .rh-filters,
    .rh-sidebar,
    .rh-map-card {
      border-radius: 16px;
    }

    .rh-map-header {
      align-items: flex-start;
      flex-direction: column;
      padding: 12px 14px;
    }

    .rh-map-card,
    .rh-sidebar {
      height: 390px;
    }
  }
`;

function statusMeta(status) {
  if (status === "completed") {
    return { className: "rh-status-done", label: "Completed", icon: CheckCircle2 };
  }
  if (status === "cancelled") {
    return { className: "rh-status-cancelled", label: "Cancelled", icon: XCircle };
  }
  return { className: "rh-status-active", label: "Live", icon: Navigation };
}

function RouteHistory() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [period, setPeriod]   = useState("all");
  const [status, setStatus]   = useState("all");
  const [routes, setRoutes]   = useState([]);
  const [kpis, setKpis]       = useState(defaultKpis);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const mountedRef = useRef(false);

  const params = useMemo(() => ({ period, status }), [period, status]);

  const loadRoutes = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getRouteHistory(params);
      if (!mountedRef.current) return;
      const nextRoutes = data.routes || [];
      setRoutes(nextRoutes);
      setKpis(data.kpis || defaultKpis);
      setSelectedRoute((current) => {
        if (!current) return nextRoutes[0] || null;
        return nextRoutes.find((route) => route.id === current.id) || nextRoutes[0] || null;
      });
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.response?.data?.error || err.message || "Unable to load route history");
      setRoutes([]);
      setKpis(defaultKpis);
      setSelectedRoute(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const selectRoute = async (route) => {
    setSelectedRoute(route);
    setError("");
    try {
      const { data } = await getRouteHistoryDetail(route.id);
      if (!mountedRef.current) return;
      setSelectedRoute(data);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.response?.data?.error || err.message || "Unable to load route details");
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadRoutes();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const selectedCoordinates = selectedRoute?.coordinates || [];
  const polylineCoordinates = useMemo(
    () => samplePoints(selectedCoordinates, MAX_POLYLINE_POINTS),
    [selectedCoordinates]
  );
  const markerCoordinates = useMemo(
    () => samplePoints(selectedCoordinates, MAX_MARKERS),
    [selectedCoordinates]
  );
  const mapCenter = selectedCoordinates[0];

  useSocket({
    "route:point": (update) => {
      if (!update?.routeId) return;
      setRoutes((prev) => prev.map((route) => (
        route.id === update.routeId
          ? {
              ...route,
              coordinates: update.coordinates || route.coordinates || [],
              distance: update.distance ?? route.distance,
              status: update.status || route.status,
              hasRealGpsPoints: true,
              coordinateSource: "route_points",
            }
          : route
      )));
      setSelectedRoute((current) => (
        current?.id === update.routeId
          ? {
              ...current,
              coordinates: update.coordinates || current.coordinates || [],
              distance: update.distance ?? current.distance,
              status: update.status || current.status,
              hasRealGpsPoints: true,
              coordinateSource: "route_points",
            }
          : current
      ));
    },
    "route:status": (update) => {
      if (!update?.routeId) return;
      setRoutes((prev) => prev.map((route) => (
        route.id === update.routeId
          ? { ...route, status: update.status || route.status, rawStatus: update.rawStatus || route.rawStatus }
          : route
      )));
      setSelectedRoute((current) => (
        current?.id === update.routeId
          ? { ...current, status: update.status || current.status, rawStatus: update.rawStatus || current.rawStatus }
          : current
      ));
    },
  });

  useEffect(() => {
    const socket = getSharedSocket();
    if (!socket || !selectedRoute?.id) return undefined;

    const subscribe = () => socket.emit("route:subscribe", selectedRoute.id);
    subscribe();
    socket.on("connect", subscribe);

    return () => {
      socket.off("connect", subscribe);
      socket.emit("route:unsubscribe", selectedRoute.id);
    };
  }, [selectedRoute?.id]);

  const kpiItems = [
    { label: "Total Routes", val: kpis.totalRoutes || 0, icon: Route },
    { label: "Completed", val: kpis.completed || 0, icon: CheckCircle2 },
    { label: "Total Distance", val: `${kpis.totalDistance || 0} km`, icon: Navigation },
    { label: "Containers Collected", val: kpis.containersCollected || 0, icon: Boxes },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="rh-root">
        <div className="rh-header">
          <div>
            <h1>Route History</h1>
            <p>View and analyse completed collection routes</p>
          </div>
          <button className="rh-btn rh-btn-blue" onClick={loadRoutes} disabled={loading} type="button">
            {loading ? (
              <>
                <Loader2 size={15} strokeWidth={2.35} aria-hidden="true" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
                Refresh
              </>
            )}
          </button>
        </div>

        <div className="rh-kpi-grid">
          {kpiItems.map((k) => {
            const Icon = k.icon;
            return (
              <div className="rh-kpi-card" key={k.label}>
                <div>
                  <div className="rh-kpi-label">{k.label}</div>
                  <div className="rh-kpi-val">{k.val}</div>
                </div>
                <span className="rh-kpi-icon">
                  <Icon size={20} strokeWidth={2.35} aria-hidden="true" />
                </span>
              </div>
            );
          })}
        </div>

        <div className="rh-filters">
          <div className="rh-field">
            <label>
              <CalendarDays size={13} strokeWidth={2.35} aria-hidden="true" />
              Period
            </label>
            <div className="rh-select-wrap">
              <select value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
              </select>
              <ChevronDown className="rh-select-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
            </div>
          </div>
          <div className="rh-field">
            <label>
              <Truck size={13} strokeWidth={2.35} aria-hidden="true" />
              Status
            </label>
            <div className="rh-select-wrap">
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="rh-select-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
            </div>
          </div>
          <button className="rh-btn" onClick={loadRoutes} disabled={loading} type="button">
            <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
            Apply Filters
          </button>
        </div>

        {error && (
          <div className="rh-error">
            <AlertTriangle size={15} strokeWidth={2.35} aria-hidden="true" />
            {error}
          </div>
        )}

        <div className="rh-main">
          <div className="rh-sidebar">
            <div className="rh-sidebar-head">
              <span className="rh-sidebar-title">
                <Route size={18} strokeWidth={2.35} aria-hidden="true" />
                Routes
              </span>
              <span className="rh-sidebar-count">{routes.length}</span>
            </div>
            <div className="rh-sidebar-list">
              {routes.length === 0 ? (
                <div className="rh-empty">
                  <span className="rh-empty-icon">
                    {loading ? (
                      <Loader2 className="loading" size={22} strokeWidth={2.35} aria-hidden="true" />
                    ) : (
                      <Route size={22} strokeWidth={2.35} aria-hidden="true" />
                    )}
                  </span>
                  <h3>{loading ? "Loading routes" : "No routes found"}</h3>
                  <p>{loading ? "Fetching route history from the system." : "Routes will appear here once collection trips are recorded in the system."}</p>
                </div>
              ) : (
                routes.map((route) => {
                  const meta = statusMeta(route.status);
                  const StatusIcon = meta.icon;

                  return (
                    <div
                      key={route.id}
                      className={`rh-route-item ${selectedRoute?.id === route.id ? "active" : ""}`}
                      onClick={() => selectRoute(route)}
                    >
                      <div className="rh-route-item-accent" />
                      <div className="rh-route-name">
                        <Route size={14} strokeWidth={2.35} aria-hidden="true" />
                        {route.name}
                      </div>
                      <div className="rh-route-meta">
                        <Navigation size={12} strokeWidth={2.35} aria-hidden="true" />
                        {route.distance} km / {route.bins} bins
                      </div>
                      <span className={`rh-route-status ${meta.className}`}>
                        <StatusIcon size={12} strokeWidth={2.45} aria-hidden="true" />
                        {meta.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rh-map-card">
            <div className="rh-map-header">
              <span className="rh-map-title">
                <MapIcon size={18} strokeWidth={2.35} aria-hidden="true" />
                Route Map
              </span>
              {selectedRoute && (
                <span className="rh-map-subtitle">
                  <MapPin size={13} strokeWidth={2.35} aria-hidden="true" />
                  {selectedRoute.name}
                </span>
              )}
            </div>
            <div className="rh-map-body">
              {!selectedRoute || selectedCoordinates.length === 0 ? (
                <div className="rh-map-placeholder">
                  <span className="rh-map-placeholder-icon">
                    <MapPin size={22} strokeWidth={2.35} aria-hidden="true" />
                  </span>
                  <h2>{selectedRoute ? "No GPS points available" : "No route selected"}</h2>
                  <p>{selectedRoute ? "This route has no usable coordinates yet." : "Select a route from the list on the left to view it on the map."}</p>
                </div>
              ) : (
                <MapContainer
                  key={selectedRoute.id}
                  center={mapCenter}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={polylineCoordinates}
                    color="#149d80"
                    weight={4}
                    opacity={0.85}
                  />
                  {markerCoordinates.map((point, i) => (
                    <Marker key={i} position={point}>
                      <Popup>Stop {i + 1}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RouteHistory;
