import React, { useEffect, useState, useMemo } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import api from "../services/api";

const css = `
  .al-root {
    --al-bg: #f4f3f8;
    --al-card: #ffffff;
    --al-ink: #101318;
    --al-muted: #7d8490;
    --al-line: #e7e7ef;
    --al-teal: #149d80;
    --al-teal-dark: #0d8069;
    --al-teal-soft: #e7f6f1;
    --al-blue: #4f96ce;
    --al-blue-dark: #286b9d;
    --al-blue-soft: #e8f2fb;
    --al-red: #e6535d;
    --al-red-soft: #fff0f1;
    --al-amber: #f4a62a;
    --al-amber-soft: #fff8e8;
    --al-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--al-bg);
    color: var(--al-ink);
  }

  .al-root,
  .al-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .al-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .al-header h1 {
    margin: 0 0 5px;
    color: var(--al-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .al-header p {
    margin: 0;
    max-width: 700px;
    color: var(--al-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .al-header-btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }

  .al-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #fff;
    color: var(--al-ink);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .al-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .al-btn-primary {
    border-color: rgba(20,157,128,.2);
    background: var(--al-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .al-btn-primary:hover {
    background: var(--al-teal-dark);
  }

  .al-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .al-kpi-card,
  .al-filters,
  .al-card {
    border: 1px solid rgba(231, 231, 239, .92);
    background: rgba(255,255,255,.94);
    box-shadow: var(--al-shadow);
  }

  .al-kpi-card {
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

  .al-kpi-card:hover {
    transform: translateY(-1px);
  }

  .al-kpi-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .al-kpi-card.red::before { background: var(--al-red); }
  .al-kpi-card.orange::before { background: var(--al-amber); }
  .al-kpi-card.blue::before { background: var(--al-blue); }
  .al-kpi-card.green::before { background: var(--al-teal); }

  .al-kpi-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
  }

  .al-kpi-card.red .al-kpi-icon { background: var(--al-red-soft); color: var(--al-red); }
  .al-kpi-card.orange .al-kpi-icon { background: var(--al-amber-soft); color: #8a5a0a; }
  .al-kpi-card.blue .al-kpi-icon { background: var(--al-blue-soft); color: var(--al-blue-dark); }
  .al-kpi-card.green .al-kpi-icon { background: var(--al-teal-soft); color: var(--al-teal-dark); }

  .al-kpi-label {
    margin-bottom: 7px;
    color: var(--al-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .al-kpi-val {
    color: var(--al-ink);
    font-size: clamp(1.3rem, 5vw, 1.7rem);
    font-weight: 900;
    line-height: 1;
  }

  .al-filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: 18px;
  }

  .al-filter-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--al-muted);
    font-size: .76rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .04em;
    white-space: nowrap;
  }

  .al-filter-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 11px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 999px;
    background: #fff;
    color: var(--al-muted);
    cursor: pointer;
    font: inherit;
    font-size: .78rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
  }

  .al-filter-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .al-filter-btn.active {
    border-color: rgba(79,150,206,.22);
    background: var(--al-blue-soft);
    color: var(--al-blue-dark);
  }

  .al-filter-btn.active-red {
    border-color: rgba(230,83,93,.3);
    background: var(--al-red-soft);
    color: var(--al-red);
  }

  .al-filter-btn.active-orange {
    border-color: rgba(244,166,42,.34);
    background: var(--al-amber-soft);
    color: #8a5a0a;
  }

  .al-card {
    overflow: hidden;
    border-radius: 18px;
  }

  .al-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .al-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--al-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .al-card-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--al-blue-soft);
    color: var(--al-blue-dark);
    font-size: .74rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .al-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 14px 20px;
    border-bottom: 1px solid #f2f3f7;
    animation: alSlideIn .3s ease both;
    transition: background .18s ease;
  }

  @keyframes alSlideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .al-item:last-child {
    border-bottom: none;
  }

  .al-item:hover {
    background: #fbfcfd;
  }

  .al-item.resolved {
    opacity: .62;
  }

  .al-item-left-bar {
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 0 3px 3px 0;
  }

  .al-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 13px;
  }

  .al-icon-red { background: var(--al-red-soft); color: var(--al-red); }
  .al-icon-orange { background: var(--al-amber-soft); color: #8a5a0a; }
  .al-icon-blue { background: var(--al-blue-soft); color: var(--al-blue-dark); }
  .al-icon-green { background: var(--al-teal-soft); color: var(--al-teal-dark); }

  .al-item-body {
    flex: 1;
  }

  .al-item-top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 4px;
  }

  .al-item-title {
    color: var(--al-ink);
    font-size: .9rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .al-severity {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: .66rem;
    font-weight: 900;
    line-height: 1.2;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .al-sev-critical { background: var(--al-red-soft); color: var(--al-red); }
  .al-sev-warning { background: var(--al-amber-soft); color: #8a5a0a; }
  .al-sev-info { background: var(--al-blue-soft); color: var(--al-blue-dark); }
  .al-sev-resolved,
  .al-sev-success { background: var(--al-teal-soft); color: var(--al-teal-dark); }

  .al-item-desc {
    margin-bottom: 7px;
    color: var(--al-muted);
    font-size: .8rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .al-item-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
  }

  .al-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    max-width: 100%;
    padding: 4px 8px;
    border-radius: 999px;
    background: #f4f6f8;
    color: #5e6673;
    font-size: .72rem;
    font-weight: 800;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .al-item-actions {
    display: flex;
    align-items: flex-start;
    flex-shrink: 0;
    gap: 7px;
    margin-top: 2px;
  }

  .al-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 32px;
    padding: 0 10px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 11px;
    background: #fff;
    color: var(--al-muted);
    cursor: pointer;
    font: inherit;
    font-size: .75rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
  }

  .al-action-btn:hover {
    transform: translateY(-1px);
  }

  .al-action-btn.resolve {
    border-color: rgba(20,157,128,.24);
    color: var(--al-teal-dark);
  }

  .al-action-btn.resolve:hover {
    background: var(--al-teal-soft);
  }

  .al-action-btn.dismiss:hover {
    background: #f8f8fb;
    color: var(--al-ink);
  }

  .al-loading,
  .al-empty {
    display: grid;
    place-items: center;
    gap: 10px;
    padding: 44px 20px;
    color: var(--al-muted);
    font-size: .88rem;
    text-align: center;
  }

  .al-loading-icon,
  .al-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: var(--al-teal-soft);
    color: var(--al-teal-dark);
  }

  .al-loading-icon svg {
    animation: alSpin .9s linear infinite;
  }

  @keyframes alSpin {
    to { transform: rotate(360deg); }
  }

  .al-error {
    display: grid;
    place-items: center;
    gap: 12px;
    margin: 16px;
    padding: 28px 18px;
    border: 1px solid rgba(230,83,93,.25);
    border-radius: 14px;
    background: var(--al-red-soft);
    color: var(--al-red);
    font-size: .85rem;
    font-weight: 800;
    text-align: center;
  }

  .al-empty h3 {
    margin: 0;
    color: var(--al-ink);
    font-size: .98rem;
    font-weight: 900;
  }

  .al-empty p {
    margin: 0;
    color: var(--al-muted);
    font-size: .84rem;
    line-height: 1.55;
  }

  @media(max-width: 860px) {
    .al-root {
      padding: 16px;
    }

    .al-kpi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .al-kpi-card {
      padding: 13px 14px;
      border-radius: 16px;
    }
  }

  @media(max-width: 700px) {
    .al-header {
      align-items: stretch;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .al-header h1 {
      font-size: 1.45rem;
    }

    .al-header p {
      font-size: .82rem;
    }

    .al-header-btns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .al-btn {
      width: 100%;
      min-height: 38px;
      padding: 0 10px;
      font-size: .78rem;
    }

    .al-filters {
      padding: 10px;
      border-radius: 16px;
    }

    .al-filter-label {
      width: 100%;
    }

    .al-filter-btn {
      flex: 1 1 auto;
    }

    .al-card-head {
      align-items: flex-start;
      flex-direction: column;
      padding: 12px 14px;
    }

    .al-item {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 10px;
      padding: 13px 14px;
    }

    .al-item-actions {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 40px;
      width: 100%;
      margin-top: 0;
    }

    .al-action-btn {
      width: 100%;
      min-height: 36px;
    }
  }

  @media(max-width: 430px) {
    .al-kpi-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const SEV = {
  critical: { label: "Critical", barColor: "#e6535d", iconBg: "al-icon-red", icon: AlertTriangle },
  warning:  { label: "Warning",  barColor: "#f4a62a", iconBg: "al-icon-orange", icon: AlertCircle },
  info:     { label: "Info",     barColor: "#4f96ce", iconBg: "al-icon-blue", icon: Info },
  success:  { label: "Success",  barColor: "#149d80", iconBg: "al-icon-green", icon: CheckCircle2 },
  resolved: { label: "Resolved", barColor: "#149d80", iconBg: "al-icon-green", icon: CheckCircle2 },
};

function normalize(a) {
  const severity = a.severity || (a.fullness >= 80 ? "critical" : a.fullness >= 60 ? "warning" : "info");
  return {
    id:       a._id || a.id,
    severity: a.resolved ? "resolved" : severity,
    type:     a.type || "fullness",
    title:    a.title || `Container ${a.containerId || a.binId} Alert`,
    desc:     a.message || a.desc || "No description",
    bin:      a.containerId || a.binId || "-",
    location: a.location || "-",
    time:     a.timestamp ? new Date(a.timestamp).toLocaleString() : "-",
    resolved: !!a.resolved,
  };
}

export default function Alerts() {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [sevFilter, setSevFilter]   = useState("all");
  const [showResolved, setShowResolved] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/alerts");
      setAlerts(res.data.map(normalize));
    } catch (e) {
      console.error("Alerts fetch error", e);
      setError("Could not load alerts. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const timer = setInterval(fetchAlerts, 30000);
    return () => clearInterval(timer);
  }, []);

  useSocket({
    "alert:new": (alert) => {
      setAlerts(prev => [{ ...alert, id: alert._id }, ...prev]);
    },
  });

  const resolve = async (id) => {
    try {
      await api.patch(`/api/alerts/resolve`);
      setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true, severity: "resolved" } : x));
    } catch {
      setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true, severity: "resolved" } : x));
    }
  };

  const dismiss = async (id) => {
    try {
      await api.delete(`/api/alerts/${id}`);
    } catch { /* silent */ }
    setAlerts(a => a.filter(x => x.id !== id));
  };

  const filtered = useMemo(() => alerts.filter(a => {
    if (!showResolved && a.resolved) return false;
    if (sevFilter !== "all" && a.severity !== sevFilter) return false;
    return true;
  }), [alerts, sevFilter, showResolved]);

  const counts = {
    critical: alerts.filter(a => a.severity === "critical").length,
    warning:  alerts.filter(a => a.severity === "warning").length,
    info:     alerts.filter(a => a.severity === "info").length,
    resolved: alerts.filter(a => a.resolved).length,
  };

  return (
    <>
      <style>{css}</style>
      <div className="al-root">
        <div className="al-header">
          <div>
            <h1>Alerts</h1>
            <p>Monitor and manage system notifications and warnings</p>
          </div>
          <div className="al-header-btns">
            <button className="al-btn" onClick={() => setShowResolved(s => !s)} type="button">
              {showResolved ? (
                <>
                  <EyeOff size={15} strokeWidth={2.35} aria-hidden="true" />
                  Hide resolved
                </>
              ) : (
                <>
                  <Eye size={15} strokeWidth={2.35} aria-hidden="true" />
                  Show resolved
                </>
              )}
            </button>
            <button className="al-btn al-btn-primary" onClick={fetchAlerts} type="button">
              <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="al-kpi-grid">
          <div className="al-kpi-card red">
            <div>
              <div className="al-kpi-label">Critical</div>
              <div className="al-kpi-val">{counts.critical}</div>
            </div>
            <span className="al-kpi-icon">
              <AlertTriangle size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>
          <div className="al-kpi-card orange">
            <div>
              <div className="al-kpi-label">Warnings</div>
              <div className="al-kpi-val">{counts.warning}</div>
            </div>
            <span className="al-kpi-icon">
              <AlertCircle size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>
          <div className="al-kpi-card blue">
            <div>
              <div className="al-kpi-label">Info</div>
              <div className="al-kpi-val">{counts.info}</div>
            </div>
            <span className="al-kpi-icon">
              <Info size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>
          <div className="al-kpi-card green">
            <div>
              <div className="al-kpi-label">Resolved</div>
              <div className="al-kpi-val">{counts.resolved}</div>
            </div>
            <span className="al-kpi-icon">
              <CheckCircle2 size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="al-filters">
          <span className="al-filter-label">
            <ShieldCheck size={14} strokeWidth={2.35} aria-hidden="true" />
            Severity
          </span>
          {[
            { key: "all",      label: "All", icon: Bell },
            { key: "critical", label: "Critical", activeClass: "active-red", icon: AlertTriangle },
            { key: "warning",  label: "Warning",  activeClass: "active-orange", icon: AlertCircle },
            { key: "info",     label: "Info",     activeClass: "active", icon: Info },
          ].map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                className={`al-filter-btn ${sevFilter === f.key ? (f.activeClass || "active") : ""}`}
                onClick={() => setSevFilter(f.key)}
                type="button"
              >
                <Icon size={14} strokeWidth={2.35} aria-hidden="true" />
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="al-card">
          <div className="al-card-head">
            <span className="al-card-title">
              <Bell size={18} strokeWidth={2.35} aria-hidden="true" />
              Active Alerts
            </span>
            <span className="al-card-count">{filtered.length} alert{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {loading && (
            <div className="al-loading">
              <span className="al-loading-icon">
                <Loader2 size={22} strokeWidth={2.35} aria-hidden="true" />
              </span>
              Loading alerts...
            </div>
          )}

          {!loading && error && (
            <div className="al-error">
              <AlertCircle size={22} strokeWidth={2.35} aria-hidden="true" />
              {error}
              <button className="al-btn" onClick={fetchAlerts} type="button">
                <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="al-empty">
              <span className="al-empty-icon">
                <CheckCircle2 size={22} strokeWidth={2.45} aria-hidden="true" />
              </span>
              <h3>No alerts</h3>
              <p>All systems are operating normally. New alerts will appear here automatically.</p>
            </div>
          )}

          {!loading && !error && filtered.map((alert, i) => {
            const cfg = SEV[alert.severity] || SEV.info;
            const Icon = cfg.icon;

            return (
              <div
                key={alert.id}
                className={`al-item ${alert.resolved ? "resolved" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="al-item-left-bar" style={{ background: cfg.barColor }} />
                <div className={`al-item-icon ${cfg.iconBg}`}>
                  <Icon size={19} strokeWidth={2.35} aria-hidden="true" />
                </div>
                <div className="al-item-body">
                  <div className="al-item-top">
                    <span className="al-item-title">{alert.title}</span>
                    <span className={`al-severity al-sev-${alert.severity}`}>
                      <Icon size={11} strokeWidth={2.5} aria-hidden="true" />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="al-item-desc">{alert.desc}</div>
                  <div className="al-item-meta">
                    <span className="al-meta-chip">
                      <Trash2 size={12} strokeWidth={2.3} aria-hidden="true" />
                      {alert.bin}
                    </span>
                    <span className="al-meta-chip">
                      <MapPin size={12} strokeWidth={2.3} aria-hidden="true" />
                      {alert.location}
                    </span>
                    <span className="al-meta-chip">
                      <Clock3 size={12} strokeWidth={2.3} aria-hidden="true" />
                      {alert.time}
                    </span>
                  </div>
                </div>
                {!alert.resolved && (
                  <div className="al-item-actions">
                    <button className="al-action-btn resolve" onClick={() => resolve(alert.id)} type="button">
                      <CheckCircle2 size={14} strokeWidth={2.45} aria-hidden="true" />
                      Resolve
                    </button>
                    <button className="al-action-btn dismiss" onClick={() => dismiss(alert.id)} type="button" aria-label="Dismiss alert">
                      <X size={15} strokeWidth={2.45} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
