import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  CircleCheck,
  Clock,
  PackageCheck,
  RefreshCw,
  Route,
  Truck,
  User,
  X,
} from "lucide-react";
import api, { reportIncident, toggleShift } from "../services/api";
import { useSocket } from "../hooks/useSocket";

const css = `
  .dd-root {
    --dd-bg: #f4f3f8;
    --dd-card: #ffffff;
    --dd-ink: #101318;
    --dd-muted: #7d8490;
    --dd-line: #e7e7ef;
    --dd-teal: #149d80;
    --dd-teal-dark: #0d8069;
    --dd-teal-soft: #e7f6f1;
    --dd-blue: #4f96ce;
    --dd-blue-soft: #e8f2fb;
    --dd-warning: #f4a62a;
    --dd-danger: #e05d63;
    --dd-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--dd-bg);
    color: var(--dd-ink);
  }

  .dd-root,
  .dd-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .dd-profile-card,
  .dd-stat,
  .dd-card {
    border: 1px solid rgba(231, 231, 239, .92);
    background: rgba(255,255,255,.94);
    box-shadow: var(--dd-shadow);
  }

  .dd-profile-card {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    padding: 18px;
    border-radius: 18px;
  }

  .dd-profile-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    border-radius: 50%;
    background: var(--dd-teal);
    color: #fff;
    font-size: 1.2rem;
    font-weight: 900;
  }

  .dd-profile-name {
    color: var(--dd-ink);
    font-size: 1rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .dd-profile-role {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 3px;
    color: var(--dd-muted);
    font-size: .78rem;
  }

  .dd-avail-toggle {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .dd-shift-label {
    color: var(--dd-ink);
    font-size: .82rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .dd-shift-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dd-switch {
    position: relative;
    display: inline-flex;
    width: 52px;
    height: 30px;
    flex: 0 0 52px;
    cursor: pointer;
  }

  .dd-switch input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .dd-switch-slider {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: #d8dce6;
    transition: background .2s ease;
  }

  .dd-switch-slider::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(16, 19, 24, .18);
    transition: transform .2s ease;
  }

  .dd-switch input:checked + .dd-switch-slider {
    background: var(--dd-teal);
  }

  .dd-switch input:checked + .dd-switch-slider::before {
    transform: translateX(22px);
  }

  .dd-switch input:disabled + .dd-switch-slider {
    opacity: .55;
    cursor: not-allowed;
  }

  .dd-availability-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    transition: background .2s ease, color .2s ease, border-color .2s ease, transform .2s ease;
  }

  .dd-availability-btn:hover {
    transform: translateY(-1px);
  }

  .dd-availability-btn.available {
    border-color: rgba(20,157,128,.16);
    background: var(--dd-teal-soft);
    color: var(--dd-teal-dark);
  }

  .dd-availability-btn.unavailable {
    border-color: var(--dd-line);
    background: #f8f8fb;
    color: var(--dd-muted);
  }

  .dd-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
  }

  .dd-header h1 {
    margin: 0 0 4px;
    color: var(--dd-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .dd-header p {
    margin: 0;
    color: var(--dd-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .dd-refresh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 14px;
    background: #fff;
    color: var(--dd-teal-dark);
    box-shadow: 0 8px 22px rgba(24,33,49,.05);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    transition: all .2s;
  }

  .dd-refresh-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .dd-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  .dd-stat {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 18px;
  }

  .dd-stat::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .dd-stat.blue::before { background: var(--dd-blue); }
  .dd-stat.green::before { background: var(--dd-teal); }
  .dd-stat.orange::before { background: var(--dd-warning); }

  .dd-stat-label {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    color: var(--dd-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .dd-stat-val {
    color: var(--dd-ink);
    font-size: clamp(1.35rem, 5vw, 1.7rem);
    font-weight: 900;
    line-height: 1;
  }

  .dd-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
    background: #f3f7f6;
    color: var(--dd-teal);
  }

  .dd-tabs {
    display: flex;
    gap: 4px;
    width: fit-content;
    margin-bottom: 20px;
    padding: 4px;
    border: 1px solid rgba(231,231,239,.9);
    border-radius: 999px;
    background: rgba(255,255,255,.74);
  }

  .dd-tab {
    min-height: 32px;
    padding: 0 16px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--dd-muted);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    transition: all .2s;
  }

  .dd-tab.active {
    background: #fff;
    color: var(--dd-teal-dark);
    box-shadow: 0 8px 18px rgba(24,33,49,.08);
  }

  .dd-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .dd-card {
    position: relative;
    overflow: hidden;
    padding: 18px;
    border-radius: 18px;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }

  .dd-card:hover {
    transform: translateY(-1px);
    border-color: rgba(214,218,228,.95);
    box-shadow: 0 12px 28px rgba(24,33,49,.08);
  }

  .dd-card-accent {
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
  }

  .dd-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .dd-task-id {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--dd-ink);
    font-size: .98rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .dd-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
    line-height: 1.2;
    white-space: nowrap;
  }

  .dd-status-assigned { background: var(--dd-blue-soft); color: #286b9d; }
  .dd-status-in_transit { background: #fff8e8; color: #8a5a0a; }
  .dd-status-completed { background: var(--dd-teal-soft); color: var(--dd-teal-dark); }
  .dd-status-cancelled { background: #fff1f2; color: #b42335; }

  .dd-info-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    font-size: .8rem;
    line-height: 1.35;
  }

  .dd-info-label {
    display: flex;
    align-items: center;
    gap: 7px;
    flex: 0 0 auto;
    color: var(--dd-muted);
  }

  .dd-info-val {
    color: var(--dd-ink);
    font-weight: 800;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .dd-divider {
    height: 1px;
    margin: 14px 0;
    background: var(--dd-line);
  }

  .dd-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 42px;
    margin-top: 4px;
    padding: 10px;
    border: 0;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: .85rem;
    font-weight: 900;
    transition: all .2s;
  }

  .dd-btn-primary {
    background: var(--dd-teal);
    color: #fff;
    box-shadow: 0 12px 24px rgba(20,157,128,.18);
  }

  .dd-btn-primary:hover {
    background: var(--dd-teal-dark);
    transform: translateY(-1px);
  }

  .dd-btn-green { background: var(--dd-teal); color: #fff; }
  .dd-btn-green:hover { background: var(--dd-teal-dark); }
  .dd-btn-ghost { border: 1px solid var(--dd-line); background: #fff; color: var(--dd-muted); }
  .dd-btn-ghost:hover { background: #f8f8fb; }
  .dd-btn-danger {
    border: 1px solid rgba(224, 93, 99, .24);
    background: #fff5f5;
    color: #c03943;
  }
  .dd-btn-danger:hover { background: #ffecec; }
  .dd-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  .dd-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(16, 19, 24, .42);
  }

  .dd-modal {
    width: min(100%, 420px);
    padding: 22px;
    border: 1px solid rgba(231, 231, 239, .95);
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 18px 48px rgba(16, 19, 24, .18);
  }

  .dd-modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .dd-modal-head h3 {
    margin: 0 0 4px;
    font-size: 1.05rem;
    font-weight: 900;
  }

  .dd-modal-head p {
    margin: 0;
    color: var(--dd-muted);
    font-size: .82rem;
    line-height: 1.45;
  }

  .dd-modal-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 10px;
    background: #f4f3f8;
    color: var(--dd-muted);
    cursor: pointer;
  }

  .dd-reason-list {
    display: grid;
    gap: 8px;
    margin: 16px 0 18px;
  }

  .dd-reason-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid var(--dd-line);
    border-radius: 12px;
    cursor: pointer;
    font-size: .88rem;
    font-weight: 700;
    transition: border-color .2s ease, background .2s ease;
  }

  .dd-reason-option.selected {
    border-color: rgba(224, 93, 99, .35);
    background: #fff7f7;
    color: #b4232a;
  }

  .dd-reason-option input { accent-color: #e05d63; }

  .dd-modal-actions {
    display: flex;
    gap: 10px;
  }

  .dd-modal-actions .dd-btn { flex: 1; margin-top: 0; }

  .dd-empty {
    padding: 48px 20px;
    color: var(--dd-muted);
    text-align: center;
  }

  .dd-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-bottom: 12px;
    border-radius: 50%;
    background: var(--dd-teal-soft);
    color: var(--dd-teal);
  }

  .dd-empty h3 {
    margin: 0 0 6px;
    color: var(--dd-ink);
    font-size: 1rem;
    font-weight: 900;
  }

  .dd-empty p {
    margin: 0;
    font-size: .85rem;
    line-height: 1.6;
  }

  .dd-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 9999;
    padding: 12px 18px;
    border-radius: 14px;
    background: #101318;
    color: #fff;
    box-shadow: 0 12px 30px rgba(0,0,0,.22);
    font-size: .85rem;
    font-weight: 700;
    animation: toastIn .3s ease;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media(max-width: 700px) {
    .dd-root { padding: 16px; }
    .dd-stats { grid-template-columns: 1fr 1fr; }
    .dd-grid { grid-template-columns: 1fr; }
    .dd-profile-card { align-items: flex-start; flex-wrap: wrap; }
    .dd-avail-toggle { width: 100%; margin-left: 0; }
    .dd-availability-btn,
    .dd-refresh-btn { width: 100%; }
    .dd-tabs { width: 100%; }
    .dd-tab { flex: 1; }
    .dd-toast { left: 16px; right: 16px; bottom: 92px; }
  }
`;

const STATUS_NEXT = {
  assigned: { label: "Pick Up — Start Transit", next: "in_transit", btnClass: "dd-btn-primary" },
  in_transit: { label: "Deliver to Utilization Station", next: "at_utilization", btnClass: "dd-btn-primary" },
};

const STATUS_COLOR = {
  assigned: "#4f96ce",
  in_transit: "#f4a62a",
  at_utilization: "#8b7bd8",
  completed: "#149d80",
  cancelled: "#e05d63",
  failed_incident: "#e05d63",
};

const INCIDENT_REASONS = [
  "Container Blocked",
  "Container Broken",
  "Road Closed",
];

function StatusIcon({ status }) {
  if (status === "completed") return <CircleCheck size={14} strokeWidth={2.5} aria-hidden="true" />;
  if (status === "in_transit") return <Truck size={14} strokeWidth={2.5} aria-hidden="true" />;
  if (status === "cancelled") return <Bell size={14} strokeWidth={2.5} aria-hidden="true" />;
  return <Clock size={14} strokeWidth={2.5} aria-hidden="true" />;
}

function statusLabel(status) {
  if (status === "assigned") return "Assigned";
  if (status === "in_transit") return "In Transit";
  if (status === "at_utilization") return "Delivered";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return status;
}

export default function DriverDashboard() {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("mw_name") || "Driver";
  const [tab, setTab] = useState("active");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [avail, setAvail] = useState(false);
  const [shiftLoading, setShiftLoading] = useState(false);
  const [incidentTaskId, setIncidentTaskId] = useState(null);
  const [incidentReason, setIncidentReason] = useState(INCIDENT_REASONS[0]);
  const [incidentSubmitting, setIncidentSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/drivers/tasks");
      setTasks(res.data);
    } catch (err) {
      showToast("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("mw_logged_in") !== "true") navigate("/");
    fetchTasks();
    api.get("/api/auth/me")
      .then((res) => setAvail(Boolean(res.data?.isAvailable)))
      .catch(() => setAvail(false));
    const id = setInterval(fetchTasks, 15000);
    return () => clearInterval(id);
  }, []);

  useSocket({
    "task:assigned": (task) => {
      setTasks(prev => [task, ...prev]);
      showToast("New task assigned!");
    },
  });

  const handleStatusUpdate = async (taskId, nextStatus) => {
    setSaving(s => ({ ...s, [taskId]: true }));
    try {
      await api.patch(`/api/drivers/tasks/${taskId}/status`, { status: nextStatus });
      setTasks(prev => prev.map(t =>
        (t.id === taskId || t._id === taskId)
          ? { ...t, status: nextStatus }
          : t
      ));
      showToast(
        nextStatus === "in_transit"
          ? "Pickup started — you are busy until delivery"
          : nextStatus === "at_utilization"
            ? "Delivered — you are available for new pickups"
            : "Status updated"
      );
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update");
    } finally {
      setSaving(s => ({ ...s, [taskId]: false }));
    }
  };

  const handleShiftToggle = async () => {
    setShiftLoading(true);
    try {
      const res = await toggleShift();
      const next = Boolean(res.data?.isAvailable);
      setAvail(next);
      showToast(next ? "Shift started — you are available for tasks" : "Shift ended — auto-assign disabled");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update shift status");
    } finally {
      setShiftLoading(false);
    }
  };

  const openIncidentModal = (taskId) => {
    setIncidentTaskId(taskId);
    setIncidentReason(INCIDENT_REASONS[0]);
  };

  const closeIncidentModal = () => {
    if (incidentSubmitting) return;
    setIncidentTaskId(null);
  };

  const handleIncidentSubmit = async () => {
    if (!incidentTaskId || !incidentReason) return;
    setIncidentSubmitting(true);
    try {
      const res = await reportIncident(incidentTaskId, incidentReason);
      setTasks(prev => prev.filter(t => (t.id || t._id) !== incidentTaskId));
      if (res.data?.isAvailable) setAvail(true);
      setIncidentTaskId(null);
      showToast("Incident reported. Dispatcher has been notified.");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to report incident");
    } finally {
      setIncidentSubmitting(false);
    }
  };

  const active = tasks.filter(t => ["assigned", "in_transit"].includes(t.status));
  const completed = tasks.filter(t => t.status === "completed");
  const displayed = tab === "active" ? active : completed;

  return (
    <>
      <style>{css}</style>
      <div className="dd-root">
        <div className="dd-profile-card">
          <div className="dd-profile-avatar">{name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="dd-profile-name">{name}</div>
            <div className="dd-profile-role">
              <Truck size={15} strokeWidth={2.4} aria-hidden="true" />
              Driver
            </div>
          </div>
          <div className="dd-avail-toggle">
            <div className="dd-shift-label">
              {avail ? "End shift" : "Start shift"}
            </div>
            <div className="dd-shift-row">
              <label className="dd-switch" aria-label={avail ? "End shift" : "Start shift"}>
                <input
                  type="checkbox"
                  checked={avail}
                  disabled={shiftLoading}
                  onChange={handleShiftToggle}
                />
                <span className="dd-switch-slider" />
              </label>
              <span className={`dd-availability-btn ${avail ? "available" : "unavailable"}`} style={{ cursor: "default" }}>
                {avail ? "On shift" : "Off shift"}
              </span>
            </div>
          </div>
        </div>

        <div className="dd-header">
          <div>
            <h1>My Tasks</h1>
            <p>Medical waste collection assignments</p>
          </div>
          <button className="dd-refresh-btn" onClick={fetchTasks} type="button">
            <RefreshCw size={16} strokeWidth={2.4} aria-hidden="true" />
            Refresh
          </button>
        </div>

        <div className="dd-stats">
          <div className="dd-stat blue">
            <div>
              <div className="dd-stat-label">
                <PackageCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                Assigned
              </div>
              <div className="dd-stat-val">{tasks.filter(t => t.status === "assigned").length}</div>
            </div>
            <span className="dd-stat-icon"><PackageCheck size={20} strokeWidth={2.35} aria-hidden="true" /></span>
          </div>
          <div className="dd-stat orange">
            <div>
              <div className="dd-stat-label">
                <Truck size={14} strokeWidth={2.4} aria-hidden="true" />
                In Transit
              </div>
              <div className="dd-stat-val">{tasks.filter(t => t.status === "in_transit").length}</div>
            </div>
            <span className="dd-stat-icon"><Truck size={20} strokeWidth={2.35} aria-hidden="true" /></span>
          </div>
          <div className="dd-stat green">
            <div>
              <div className="dd-stat-label">
                <CircleCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                Completed
              </div>
              <div className="dd-stat-val">{completed.length}</div>
            </div>
            <span className="dd-stat-icon"><CircleCheck size={20} strokeWidth={2.35} aria-hidden="true" /></span>
          </div>
        </div>

        <div className="dd-tabs">
          <button className={`dd-tab ${tab === "active" ? "active" : ""}`} onClick={() => setTab("active")} type="button">
            Active ({active.length})
          </button>
          <button className={`dd-tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")} type="button">
            History ({completed.length})
          </button>
        </div>

        {loading ? (
          <div className="dd-empty">
            <div className="dd-empty-icon"><Clock size={24} strokeWidth={2.4} aria-hidden="true" /></div>
            <p>Loading tasks...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="dd-empty">
            <div className="dd-empty-icon">
              {tab === "active" ? <Bell size={24} strokeWidth={2.4} aria-hidden="true" /> : <Route size={24} strokeWidth={2.4} aria-hidden="true" />}
            </div>
            <h3>{tab === "active" ? "No active tasks" : "No completed tasks yet"}</h3>
            <p>{tab === "active"
              ? "You have no assigned tasks right now. Stay available to receive new assignments."
              : "Completed tasks will appear here."}</p>
          </div>
        ) : (
          <div className="dd-grid">
            {displayed.map(task => {
              const id = task.id || task._id;
              const nextStep = STATUS_NEXT[task.status];

              return (
                <div key={id} className="dd-card">
                  <div className="dd-card-accent" style={{ background: STATUS_COLOR[task.status] }} />

                  <div className="dd-card-top">
                    <span className="dd-task-id">
                      <Route size={18} strokeWidth={2.4} aria-hidden="true" />
                      Task #{String(id).slice(-6)}
                    </span>
                    <span className={`dd-status-badge dd-status-${task.status}`}>
                      <StatusIcon status={task.status} />
                      {statusLabel(task.status)}
                    </span>
                  </div>

                  <div className="dd-info-row">
                    <span className="dd-info-label">
                      <PackageCheck size={15} strokeWidth={2.3} aria-hidden="true" />
                      Container
                    </span>
                    <span className="dd-info-val">{task.containerId}</span>
                  </div>
                  <div className="dd-info-row">
                    <span className="dd-info-label">
                      <Clock size={15} strokeWidth={2.3} aria-hidden="true" />
                      Assigned
                    </span>
                    <span className="dd-info-val">
                      {task.assignedAt ? new Date(task.assignedAt).toLocaleString() : "-"}
                    </span>
                  </div>
                  {task.completedAt && (
                    <div className="dd-info-row">
                      <span className="dd-info-label">
                        <CircleCheck size={15} strokeWidth={2.3} aria-hidden="true" />
                        Completed
                      </span>
                      <span className="dd-info-val">{new Date(task.completedAt).toLocaleString()}</span>
                    </div>
                  )}

                  {nextStep && (
                    <>
                      <div className="dd-divider" />
                      <button
                        className={`dd-btn ${nextStep.btnClass}`}
                        disabled={saving[id]}
                        onClick={() => handleStatusUpdate(id, nextStep.next)}
                        type="button"
                      >
                        <Truck size={17} strokeWidth={2.4} aria-hidden="true" />
                        {saving[id] ? "Updating..." : nextStep.label}
                      </button>
                    </>
                  )}

                  {tab === "active" && ["assigned", "in_transit"].includes(task.status) && (
                    <>
                      <div className="dd-divider" />
                      <button
                        className="dd-btn dd-btn-danger"
                        disabled={saving[id] || incidentSubmitting}
                        onClick={() => openIncidentModal(id)}
                        type="button"
                      >
                        <AlertTriangle size={17} strokeWidth={2.4} aria-hidden="true" />
                        Report issue
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && <div className="dd-toast">{toast}</div>}

      {incidentTaskId && (
        <div className="dd-modal-overlay" onClick={closeIncidentModal}>
          <div className="dd-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="dd-modal-head">
              <div>
                <h3>Report issue</h3>
                <p>Select the reason you cannot collect the waste.</p>
              </div>
              <button className="dd-modal-close" onClick={closeIncidentModal} type="button" aria-label="Close">
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <div className="dd-reason-list">
              {INCIDENT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`dd-reason-option ${incidentReason === reason ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="incident-reason"
                    value={reason}
                    checked={incidentReason === reason}
                    onChange={() => setIncidentReason(reason)}
                  />
                  {reason}
                </label>
              ))}
            </div>

            <div className="dd-modal-actions">
              <button className="dd-btn dd-btn-ghost" onClick={closeIncidentModal} disabled={incidentSubmitting} type="button">
                Cancel
              </button>
              <button className="dd-btn dd-btn-danger" onClick={handleIncidentSubmit} disabled={incidentSubmitting} type="button">
                {incidentSubmitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
