import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Loader2,
  PackageOpen,
  RefreshCw,
  Route,
  Send,
  ShieldAlert,
  Truck,
  UserCheck,
} from "lucide-react";
import { getAlerts, getApprovedDrivers, getAllTasks, assignTask } from "../services/api";
import { useSocket } from "../hooks/useSocket";

const css = `
  .disp-root {
    --disp-bg: #f4f3f8;
    --disp-card: #ffffff;
    --disp-ink: #101318;
    --disp-muted: #7d8490;
    --disp-line: #e7e7ef;
    --disp-teal: #149d80;
    --disp-teal-dark: #0d8069;
    --disp-teal-soft: #e7f6f1;
    --disp-blue: #4f96ce;
    --disp-blue-dark: #286b9d;
    --disp-blue-soft: #e8f2fb;
    --disp-red: #e6535d;
    --disp-red-soft: #fff0f1;
    --disp-amber: #f4a62a;
    --disp-amber-soft: #fff8e8;
    --disp-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--disp-bg);
    color: var(--disp-ink);
  }

  .disp-root,
  .disp-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .disp-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .disp-header h1 {
    margin: 0 0 5px;
    color: var(--disp-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .disp-header p {
    margin: 0;
    max-width: 720px;
    color: var(--disp-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .disp-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border: 1px solid rgba(20,157,128,.18);
    border-radius: 16px;
    background: var(--disp-teal-soft);
    color: var(--disp-teal-dark);
    box-shadow: var(--disp-shadow);
  }

  .disp-card {
    overflow: hidden;
    margin-bottom: 18px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 18px;
    background: rgba(255,255,255,.94);
    box-shadow: var(--disp-shadow);
  }

  .disp-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .disp-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--disp-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .disp-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--disp-amber-soft);
    color: #8a5a0a;
    font-size: .74rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .disp-count.neutral {
    background: var(--disp-blue-soft);
    color: var(--disp-blue-dark);
  }

  .disp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: .84rem;
  }

  .disp-table th {
    padding: 12px 16px;
    background: #f8f8fb;
    color: var(--disp-muted);
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .disp-table td {
    padding: 14px 16px;
    border-top: 1px solid #f2f3f7;
    vertical-align: middle;
  }

  .disp-table tr:hover td {
    background: #fbfcfd;
  }

  .disp-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--disp-ink);
    font-size: .88rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .disp-id-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
    border-radius: 11px;
    background: var(--disp-teal-soft);
    color: var(--disp-teal-dark);
  }

  .disp-critical {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--disp-red-soft);
    color: var(--disp-red);
    font-size: .78rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .disp-select-wrap {
    position: relative;
    width: min(100%, 260px);
  }

  .disp-select {
    width: 100%;
    min-height: 38px;
    padding: 0 36px 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    color: var(--disp-ink);
    cursor: pointer;
    outline: none;
    appearance: none;
    font: inherit;
    font-size: .82rem;
    font-weight: 800;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .disp-select:focus {
    border-color: rgba(20,157,128,.72);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .disp-select-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    color: var(--disp-muted);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .disp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 13px;
    border: 0;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: .8rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .disp-btn:hover {
    transform: translateY(-1px);
  }

  .disp-btn-blue {
    background: var(--disp-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .disp-btn-blue:hover {
    background: var(--disp-teal-dark);
  }

  .disp-empty {
    display: grid;
    place-items: center;
    gap: 10px;
    padding: 44px 20px;
    color: var(--disp-muted);
    font-size: .88rem;
    text-align: center;
  }

  .disp-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: var(--disp-teal-soft);
    color: var(--disp-teal-dark);
  }

  .disp-loading-icon svg {
    animation: dispSpin .9s linear infinite;
  }

  @keyframes dispSpin {
    to { transform: rotate(360deg); }
  }

  .disp-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .disp-status-assigned { background: var(--disp-blue-soft); color: var(--disp-blue-dark); }
  .disp-status-transit { background: var(--disp-amber-soft); color: #8a5a0a; }
  .disp-status-done { background: var(--disp-teal-soft); color: var(--disp-teal-dark); }

  .disp-muted {
    color: var(--disp-muted);
    font-size: .8rem;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .disp-toast {
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

  @media(max-width: 800px) {
    .disp-root {
      padding: 16px;
    }
  }

  @media(max-width: 700px) {
    .disp-header {
      align-items: center;
      margin-bottom: 16px;
    }

    .disp-header h1 {
      font-size: 1.45rem;
    }

    .disp-header p {
      font-size: .82rem;
    }

    .disp-card {
      margin-bottom: 14px;
      border-radius: 16px;
    }

    .disp-card-head {
      align-items: flex-start;
      flex-direction: column;
      padding: 12px 14px;
    }

    .disp-table,
    .disp-table tbody,
    .disp-table tr,
    .disp-table td {
      display: block;
      width: 100%;
    }

    .disp-table thead {
      display: none;
    }

    .disp-table tr {
      margin: 10px;
      overflow: hidden;
      border: 1px solid var(--disp-line);
      border-radius: 14px;
      background: #fff;
    }

    .disp-table td {
      padding: 10px 12px;
      border-top: 1px solid #f3f4f8;
    }

    .disp-table td:first-child {
      border-top: none;
    }

    .disp-table td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 5px;
      color: #6b7280;
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .disp-select-wrap {
      width: 100%;
    }

    .disp-btn {
      width: 100%;
      min-height: 38px;
    }

    .disp-toast {
      left: 12px;
      right: 12px;
      bottom: 94px;
      padding: 10px 12px;
      font-size: .8rem;
    }
  }
`;

export default function AdminDispatch() {
  const [alerts, setAlerts]           = useState([]);
  const [drivers, setDrivers]         = useState([]);
  const [tasks, setTasks]             = useState([]);
  const [selected, setSelected]       = useState({});
  const [toast, setToast]             = useState("");
  const [loading, setLoading]         = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsRes, driversRes, tasksRes] = await Promise.all([
        getAlerts(),
        getApprovedDrivers(),
        getAllTasks(),
      ]);
      setAlerts(alertsRes.data.filter(a => a.severity === "critical" && !a.resolved));
      setDrivers(driversRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useSocket({
    "task:updated": (task) => {
      setTasks(prev => prev.map(t =>
        (t.id === task.id || t._id === task.id) ? task : t
      ));
    },

    "alert:new": (alert) => {
      if (alert.severity === "critical") {
        setAlerts(prev => [alert, ...prev]);
      }
    },
  });

  const handleAssign = async (containerId, alertId) => {
    const driverId = selected[alertId];
    if (!driverId) return showToast("Please select a driver first");

    try {
      await assignTask(driverId, containerId);
      showToast("Task assigned successfully!");
      setAlerts(prev => prev.filter(a => a._id !== alertId));
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || "Error assigning task");
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="disp-root">
        <div className="disp-header">
          <div>
            <h1>Dispatch Management</h1>
            <p>Assign drivers to critical containers and track active tasks</p>
          </div>
          <span className="disp-header-icon">
            <Route size={22} strokeWidth={2.35} aria-hidden="true" />
          </span>
        </div>

        <div className="disp-card">
          <div className="disp-card-head">
            <span className="disp-card-title">
              <ShieldAlert size={18} strokeWidth={2.35} aria-hidden="true" />
              Critical Containers - Assign Driver
            </span>
            <span className="disp-count">
              <AlertTriangle size={14} strokeWidth={2.35} aria-hidden="true" />
              {alerts.length} critical
            </span>
          </div>

          {loading ? (
            <div className="disp-empty">
              <span className="disp-empty-icon disp-loading-icon">
                <Loader2 size={22} strokeWidth={2.35} aria-hidden="true" />
              </span>
              Loading...
            </div>
          ) : alerts.length === 0 ? (
            <div className="disp-empty">
              <span className="disp-empty-icon">
                <CheckCircle2 size={22} strokeWidth={2.45} aria-hidden="true" />
              </span>
              No critical containers right now
            </div>
          ) : (
            <table className="disp-table">
              <thead>
                <tr>
                  <th>Container</th>
                  <th>Fullness</th>
                  <th>Select Driver</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert._id}>
                    <td data-label="Container">
                      <span className="disp-primary">
                        <span className="disp-id-icon">
                          <PackageOpen size={16} strokeWidth={2.35} aria-hidden="true" />
                        </span>
                        {alert.containerId}
                      </span>
                    </td>
                    <td data-label="Fullness">
                      <span className="disp-critical">
                        <AlertTriangle size={14} strokeWidth={2.35} aria-hidden="true" />
                        {alert.fullness}%
                      </span>
                    </td>
                    <td data-label="Select Driver">
                      <div className="disp-select-wrap">
                        <select
                          className="disp-select"
                          onChange={(e) => setSelected({ ...selected, [alert._id]: e.target.value })}
                          defaultValue=""
                        >
                          <option value="" disabled>Choose Driver</option>
                          {drivers.map((d) => {
                            const driverId = d.id ?? d._id;
                            const driverEmail = d.user?.email || d.userId?.email || `driver-${driverId}`;
                            return (
                              <option key={driverId} value={driverId}>
                                {driverEmail} - {d.plateNumber || "No plate"}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="disp-select-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
                      </div>
                    </td>
                    <td data-label="Action">
                      <button
                        className="disp-btn disp-btn-blue"
                        onClick={() => handleAssign(alert.containerId, alert._id)}
                        type="button"
                      >
                        <Send size={15} strokeWidth={2.35} aria-hidden="true" />
                        Assign Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="disp-card">
          <div className="disp-card-head">
            <span className="disp-card-title">
              <ClipboardList size={18} strokeWidth={2.35} aria-hidden="true" />
              All Tasks
            </span>
            <span className="disp-count neutral">
              <RefreshCw size={14} strokeWidth={2.35} aria-hidden="true" />
              {tasks.length} tasks
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="disp-empty">
              <span className="disp-empty-icon">
                <ClipboardList size={22} strokeWidth={2.35} aria-hidden="true" />
              </span>
              No tasks yet
            </div>
          ) : (
            <table className="disp-table">
              <thead>
                <tr>
                  <th>Container</th>
                  <th>Driver ID</th>
                  <th>Status</th>
                  <th>Assigned At</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id || t.id}>
                    <td data-label="Container">
                      <span className="disp-primary">
                        <span className="disp-id-icon">
                          <PackageOpen size={16} strokeWidth={2.35} aria-hidden="true" />
                        </span>
                        {t.containerId}
                      </span>
                    </td>
                    <td data-label="Driver ID">
                      <span className="disp-muted">
                        <UserCheck size={13} strokeWidth={2.35} aria-hidden="true" />{" "}
                        {t.driverId?.toString().slice(-6) || t.driverId}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={`disp-status ${
                        t.status === "assigned"       ? "disp-status-assigned" :
                        t.status === "in_transit"     ? "disp-status-transit"  :
                        t.status === "completed"      ? "disp-status-done"     : "disp-status-assigned"
                      }`}>
                        {t.status === "completed" ? (
                          <CheckCircle2 size={13} strokeWidth={2.35} aria-hidden="true" />
                        ) : (
                          <Truck size={13} strokeWidth={2.35} aria-hidden="true" />
                        )}
                        {t.status}
                      </span>
                    </td>
                    <td data-label="Assigned At">
                      <span className="disp-muted">
                        <CalendarClock size={13} strokeWidth={2.35} aria-hidden="true" />{" "}
                        {t.assignedAt ? new Date(t.assignedAt).toLocaleString() : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {toast && <div className="disp-toast">{toast}</div>}
    </>
  );
}
