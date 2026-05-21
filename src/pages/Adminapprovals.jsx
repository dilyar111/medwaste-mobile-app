import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Contact,
  Hash,
  Loader2,
  MapPin,
  Phone,
  Recycle,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import { getPendingDrivers, updateDriverStatus } from "../services/api";
import api from "../services/api";

const css = `
  .ap-root {
    --ap-bg: #f4f3f8;
    --ap-card: #ffffff;
    --ap-ink: #101318;
    --ap-muted: #7d8490;
    --ap-line: #e7e7ef;
    --ap-teal: #149d80;
    --ap-teal-dark: #0d8069;
    --ap-teal-soft: #e7f6f1;
    --ap-blue: #4f96ce;
    --ap-blue-soft: #e8f2fb;
    --ap-red: #e6535d;
    --ap-red-soft: #fff0f1;
    --ap-amber: #f4a62a;
    --ap-amber-soft: #fff8e8;
    --ap-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--ap-bg);
    color: var(--ap-ink);
  }

  .ap-root,
  .ap-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .ap-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .ap-header h1 {
    margin: 0 0 5px;
    color: var(--ap-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .ap-header p {
    margin: 0;
    max-width: 700px;
    color: var(--ap-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .ap-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border: 1px solid rgba(20,157,128,.18);
    border-radius: 16px;
    background: var(--ap-teal-soft);
    color: var(--ap-teal-dark);
    box-shadow: var(--ap-shadow);
  }

  .ap-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .ap-root.driver-only .ap-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ap-stat,
  .ap-card {
    border: 1px solid rgba(231, 231, 239, .92);
    background: rgba(255,255,255,.94);
    box-shadow: var(--ap-shadow);
  }

  .ap-stat {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 18px;
  }

  .ap-stat::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .ap-stat.total::before { background: var(--ap-blue); }
  .ap-stat.pending::before { background: var(--ap-amber); }
  .ap-stat.approved::before { background: var(--ap-teal); }
  .ap-stat.rejected::before { background: var(--ap-red); }

  .ap-stat-label {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    color: var(--ap-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .ap-stat-val {
    color: var(--ap-ink);
    font-size: clamp(1.28rem, 5vw, 1.7rem);
    font-weight: 900;
    line-height: 1;
  }

  .ap-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
    background: #f3f7f6;
    color: var(--ap-teal);
  }

  .ap-tabs {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
    max-width: 100%;
    margin-bottom: 16px;
    padding: 4px;
    border: 1px solid rgba(231,231,239,.72);
    border-radius: 14px;
    background: #ebeaf1;
  }

  .ap-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 36px;
    padding: 0 14px;
    border: 0;
    border-radius: 11px;
    background: transparent;
    color: var(--ap-muted);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, color .2s ease, box-shadow .2s ease, transform .2s ease;
  }

  .ap-tab:hover {
    color: var(--ap-ink);
  }

  .ap-tab.active {
    background: #fff;
    color: var(--ap-teal-dark);
    box-shadow: 0 5px 14px rgba(24, 33, 49, .08);
  }

  .ap-card {
    overflow: hidden;
    border-radius: 18px;
  }

  .ap-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .ap-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ap-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .ap-driver-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-right: 8px;
    padding: 3px 8px;
    border-radius: 999px;
    background: var(--ap-blue-soft);
    color: #286b9d;
    font-size: .7rem;
    font-weight: 900;
  }

  .ap-card-tools {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .ap-card-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--ap-amber-soft);
    color: #8a5a0a;
    font-size: .74rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .ap-refresh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #fff;
    color: var(--ap-muted);
    cursor: pointer;
    transition: background .2s ease, color .2s ease, transform .2s ease;
  }

  .ap-refresh-btn:hover {
    background: var(--ap-teal-soft);
    color: var(--ap-teal-dark);
    transform: translateY(-1px);
  }

  .ap-table {
    width: 100%;
    border-collapse: collapse;
    font-size: .84rem;
  }

  .ap-table th {
    padding: 12px 16px;
    background: #f8f8fb;
    color: var(--ap-muted);
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .ap-table td {
    padding: 14px 16px;
    border-top: 1px solid #f2f3f7;
    vertical-align: top;
  }

  .ap-table tr:hover td {
    background: #fbfcfd;
  }

  .ap-user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ap-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 50%;
    background: var(--ap-teal);
    color: #fff;
    font-size: .82rem;
    font-weight: 900;
  }

  .ap-user-name {
    color: var(--ap-ink);
    font-size: .88rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ap-user-email {
    margin-top: 3px;
    color: var(--ap-muted);
    font-size: .72rem;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .ap-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
    line-height: 1.2;
    white-space: nowrap;
  }

  .ap-badge-pending { background: var(--ap-amber-soft); color: #8a5a0a; }
  .ap-badge-approved { background: var(--ap-teal-soft); color: var(--ap-teal-dark); }
  .ap-badge-rejected { background: var(--ap-red-soft); color: var(--ap-red); }

  .ap-detail {
    color: var(--ap-ink);
    font-size: .78rem;
    line-height: 1.65;
  }

  .ap-detail span {
    color: var(--ap-muted);
    font-weight: 700;
  }

  .ap-detail-strong {
    font-weight: 900;
  }

  .ap-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ap-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: .8rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .ap-btn:hover {
    transform: translateY(-1px);
  }

  .ap-btn-approve {
    border: 1px solid rgba(20,157,128,.2);
    background: var(--ap-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .ap-btn-approve:hover {
    background: var(--ap-teal-dark);
  }

  .ap-btn-reject {
    border: 1px solid rgba(230,83,93,.36);
    background: #fff;
    color: var(--ap-red);
  }

  .ap-btn-reject:hover {
    background: var(--ap-red-soft);
  }

  .ap-btn:disabled {
    cursor: not-allowed;
    opacity: .55;
    transform: none;
  }

  .ap-expand-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 7px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--ap-teal-dark);
    cursor: pointer;
    font: inherit;
    font-size: .76rem;
    font-weight: 900;
  }

  .ap-expand-btn:hover {
    text-decoration: underline;
  }

  .ap-expanded-cell {
    padding: 0 16px 14px !important;
    border-top: none !important;
  }

  .ap-detail-panel {
    margin-top: 0;
    padding: 13px 14px;
    border: 1px solid rgba(231,231,239,.8);
    border-radius: 14px;
    background: #f8f8fb;
    font-size: .78rem;
    line-height: 1.75;
  }

  .ap-detail-panel-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 8px;
    color: var(--ap-ink);
    font-size: .8rem;
    font-weight: 900;
  }

  .ap-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px 20px;
  }

  .ap-detail-row {
    display: flex;
    gap: 6px;
  }

  .ap-detail-key {
    min-width: 94px;
    flex: 0 0 auto;
    color: var(--ap-muted);
    font-weight: 800;
  }

  .ap-detail-val {
    color: var(--ap-ink);
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .ap-empty,
  .ap-loading {
    display: grid;
    place-items: center;
    gap: 10px;
    padding: 44px 20px;
    color: var(--ap-muted);
    font-size: .88rem;
    text-align: center;
  }

  .ap-empty p {
    margin: 0;
  }

  .ap-empty-icon,
  .ap-loading-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: var(--ap-teal-soft);
    color: var(--ap-teal-dark);
  }

  .ap-loading-icon svg {
    animation: apSpin .9s linear infinite;
  }

  @keyframes apSpin {
    to { transform: rotate(360deg); }
  }

  .ap-toast {
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

  @media(max-width: 900px) {
    .ap-root {
      padding: 16px;
    }

    .ap-stats,
    .ap-root.driver-only .ap-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .ap-stat {
      padding: 13px 14px;
      border-radius: 16px;
    }
  }

  @media(max-width: 700px) {
    .ap-header {
      align-items: center;
      margin-bottom: 16px;
    }

    .ap-header h1 {
      font-size: 1.45rem;
    }

    .ap-header p {
      font-size: .82rem;
    }

    .ap-stats,
    .ap-root.driver-only .ap-stats {
      grid-template-columns: 1fr;
    }

    .ap-tabs {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .ap-tab {
      padding: 0 10px;
      font-size: .78rem;
    }

    .ap-card-head {
      align-items: flex-start;
      flex-direction: column;
      padding: 12px 14px;
    }

    .ap-card-tools {
      justify-content: flex-start;
      width: 100%;
    }

    .ap-table,
    .ap-table tbody,
    .ap-table tr,
    .ap-table td {
      display: block;
      width: 100%;
    }

    .ap-table thead {
      display: none;
    }

    .ap-table tr {
      margin: 10px;
      overflow: hidden;
      border: 1px solid var(--ap-line);
      border-radius: 14px;
      background: #fff;
    }

    .ap-table tr.ap-expanded-row {
      margin-top: -10px;
      border-top: 0;
      border-radius: 0 0 14px 14px;
    }

    .ap-table td {
      padding: 10px 12px;
      border-top: 1px solid #f3f4f8;
    }

    .ap-table td:first-child {
      border-top: none;
    }

    .ap-table td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 5px;
      color: #6b7280;
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .ap-expanded-cell {
      padding: 10px 12px 12px !important;
    }

    .ap-detail-grid {
      grid-template-columns: 1fr;
      gap: 5px;
    }

    .ap-detail-row {
      flex-direction: column;
      gap: 1px;
    }

    .ap-detail-key {
      min-width: 0;
    }

    .ap-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .ap-btn {
      width: 100%;
      min-height: 38px;
    }

    .ap-toast {
      left: 12px;
      right: 12px;
      bottom: 94px;
      padding: 10px 12px;
      font-size: .8rem;
    }
  }
`;

export default function AdminApprovals({ driverOnly = false }) {
  const [tab,       setTab]       = useState("drivers");
  const [drivers,   setDrivers]   = useState([]);
  const [utilizers, setUtilizers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState({});
  const [expanded,  setExpanded]  = useState({});
  const [toast,     setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      if (driverOnly) {
        const dRes = await getPendingDrivers();
        setDrivers(dRes.data);
        setUtilizers([]);
      } else {
        const [dRes, uRes] = await Promise.all([
          getPendingDrivers(),
          api.get("/api/utilizers/pending"),
        ]);
        setDrivers(dRes.data);
        setUtilizers(uRes.data);
      }
    } catch (err) {
      showToast("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDriver = async (id, status) => {
    setSaving(s => ({ ...s, [id]: true }));
    try {
      await updateDriverStatus(id, status);
      setDrivers(prev => prev.filter(d => d._id !== id && d.id !== id));
      showToast(status === "approved"
        ? "Driver approved - role updated automatically"
        : "Driver application rejected");
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed");
    } finally {
      setSaving(s => ({ ...s, [id]: false }));
    }
  };

  const handleUtilizer = async (id, status) => {
    setSaving(s => ({ ...s, [`u_${id}`]: true }));
    try {
      await api.patch(`/api/utilizers/${id}/status`, { status });
      setUtilizers(prev => prev.filter(u => u.id !== id));
      showToast(status === "approved"
        ? "Utilizer approved - role updated automatically"
        : "Utilizer application rejected");
    } catch (err) {
      showToast(err.response?.data?.error || "Action failed");
    } finally {
      setSaving(s => ({ ...s, [`u_${id}`]: false }));
    }
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const totalPending = drivers.length + utilizers.length;

  return (
    <>
      <style>{css}</style>
      <div className={`ap-root ${driverOnly ? "driver-only" : ""}`}>
        <div className="ap-header">
          <div>
            <h1>{driverOnly ? "Driver Approvals" : "Approvals"}</h1>
            <p>{driverOnly
              ? "Review and approve driver applications"
              : "Review and approve driver and utilizer station applications"}
            </p>
          </div>
          <span className="ap-header-icon">
            <ShieldCheck size={22} strokeWidth={2.35} aria-hidden="true" />
          </span>
        </div>

        <div className="ap-stats">
          <div className="ap-stat total">
            <div>
              <div className="ap-stat-label">
                <ClipboardCheck size={14} strokeWidth={2.35} aria-hidden="true" />
                Total pending
              </div>
              <div className="ap-stat-val">{totalPending}</div>
            </div>
            <span className="ap-stat-icon">
              <ClipboardCheck size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>

          <div className="ap-stat pending">
            <div>
              <div className="ap-stat-label">
                <Truck size={14} strokeWidth={2.35} aria-hidden="true" />
                Drivers waiting
              </div>
              <div className="ap-stat-val">{drivers.length}</div>
            </div>
            <span className="ap-stat-icon">
              <Truck size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>

          {!driverOnly && (
            <div className="ap-stat pending">
              <div>
                <div className="ap-stat-label">
                  <Recycle size={14} strokeWidth={2.35} aria-hidden="true" />
                  Utilizers waiting
                </div>
                <div className="ap-stat-val">{utilizers.length}</div>
              </div>
              <span className="ap-stat-icon">
                <Recycle size={20} strokeWidth={2.35} aria-hidden="true" />
              </span>
            </div>
          )}

          <div className="ap-stat approved">
            <div>
              <div className="ap-stat-label">
                <BadgeCheck size={14} strokeWidth={2.35} aria-hidden="true" />
                Auto role update
              </div>
              <div className="ap-stat-val">On</div>
            </div>
            <span className="ap-stat-icon">
              <BadgeCheck size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>
        </div>

        {!driverOnly && (
          <div className="ap-tabs">
            <button className={`ap-tab ${tab === "drivers" ? "active" : ""}`} onClick={() => setTab("drivers")} type="button">
              <Truck size={15} strokeWidth={2.35} aria-hidden="true" />
              Drivers ({drivers.length})
            </button>
            <button className={`ap-tab ${tab === "utilizers" ? "active" : ""}`} onClick={() => setTab("utilizers")} type="button">
              <Recycle size={15} strokeWidth={2.35} aria-hidden="true" />
              Utilizers ({utilizers.length})
            </button>
          </div>
        )}

        {(driverOnly || tab === "drivers") && (
          <div className="ap-card">
            <div className="ap-card-head">
              <span className="ap-card-title">
                {driverOnly && (
                  <span className="ap-driver-chip">
                    <Truck size={12} strokeWidth={2.35} aria-hidden="true" />
                    Driver Queue
                  </span>
                )}
                <Truck size={18} strokeWidth={2.35} aria-hidden="true" />
                Driver Applications
              </span>
              <div className="ap-card-tools">
                <span className="ap-card-count">
                  <ClipboardCheck size={14} strokeWidth={2.35} aria-hidden="true" />
                  {drivers.length} pending
                </span>
                <button onClick={fetchAll} className="ap-refresh-btn" type="button" aria-label="Refresh driver applications">
                  <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="ap-loading">
                <span className="ap-loading-icon">
                  <Loader2 size={22} strokeWidth={2.35} aria-hidden="true" />
                </span>
                Loading...
              </div>
            ) : drivers.length === 0 ? (
              <div className="ap-empty">
                <span className="ap-empty-icon">
                  <CircleCheck size={22} strokeWidth={2.45} aria-hidden="true" />
                </span>
                <p>No pending driver applications</p>
              </div>
            ) : (
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>License</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(d => {
                    const id    = d._id || d.id;
                    const email = d.userId?.email || d.email || "-";
                    const name  = d.userId?.fullName || email.split("@")[0];

                    return (
                      <React.Fragment key={id}>
                        <tr>
                          <td data-label="Applicant">
                            <div className="ap-user-cell">
                              <div className="ap-avatar">{name.charAt(0).toUpperCase()}</div>
                              <div>
                                <div className="ap-user-name">{name}</div>
                                <div className="ap-user-email">{email}</div>
                              </div>
                            </div>
                          </td>

                          <td data-label="License">
                            <div className="ap-detail">
                              <div><span>No. </span>{d.licenseNumber}</div>
                              <div><span>Exp: </span>{d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString() : "-"}</div>
                              <div><span>Company: </span>{d.company || "-"}</div>
                            </div>
                          </td>

                          <td data-label="Vehicle">
                            <div className="ap-detail">
                              <div className="ap-detail-strong">{d.vehicleModel || "-"} {d.vehicleYear ? `(${d.vehicleYear})` : ""}</div>
                              <div><span>Plate: </span>{d.plateNumber || "-"}</div>
                              <div><span>Capacity: </span>{d.capacity ? `${d.capacity} kg` : "-"}</div>
                            </div>
                            <button className="ap-expand-btn" onClick={() => toggleExpand(id)} type="button">
                              {expanded[id] ? (
                                <>
                                  <ChevronUp size={14} strokeWidth={2.35} aria-hidden="true" />
                                  Hide details
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={14} strokeWidth={2.35} aria-hidden="true" />
                                  More details
                                </>
                              )}
                            </button>
                          </td>

                          <td data-label="Status">
                            <span className="ap-badge ap-badge-pending">
                              <Loader2 size={13} strokeWidth={2.35} aria-hidden="true" />
                              Pending
                            </span>
                          </td>

                          <td data-label="Actions">
                            <div className="ap-actions">
                              <button className="ap-btn ap-btn-approve"
                                disabled={saving[id]}
                                onClick={() => handleDriver(id, "approved")}
                                type="button">
                                {saving[id] ? (
                                  "Saving..."
                                ) : (
                                  <>
                                    <CircleCheck size={15} strokeWidth={2.45} aria-hidden="true" />
                                    Approve
                                  </>
                                )}
                              </button>
                              <button className="ap-btn ap-btn-reject"
                                disabled={saving[id]}
                                onClick={() => handleDriver(id, "rejected")}
                                type="button">
                                <CircleX size={15} strokeWidth={2.45} aria-hidden="true" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expanded[id] && (
                          <tr className="ap-expanded-row">
                            <td colSpan={5} className="ap-expanded-cell">
                              <div className="ap-detail-panel">
                                <div className="ap-detail-panel-title">
                                  <Contact size={15} strokeWidth={2.35} aria-hidden="true" />
                                  Emergency Contact
                                </div>
                                <div className="ap-detail-grid">
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Name:</span>
                                    <span className="ap-detail-val">{d.emergencyContact?.name || "-"}</span>
                                  </div>
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Phone:</span>
                                    <span className="ap-detail-val">{d.emergencyContact?.phone || "-"}</span>
                                  </div>
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Relation:</span>
                                    <span className="ap-detail-val">{d.emergencyContact?.relation || "-"}</span>
                                  </div>
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Applied:</span>
                                    <span className="ap-detail-val">{d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!driverOnly && tab === "utilizers" && (
          <div className="ap-card">
            <div className="ap-card-head">
              <span className="ap-card-title">
                <Recycle size={18} strokeWidth={2.35} aria-hidden="true" />
                Utilizer Station Applications
              </span>
              <div className="ap-card-tools">
                <span className="ap-card-count">
                  <ClipboardCheck size={14} strokeWidth={2.35} aria-hidden="true" />
                  {utilizers.length} pending
                </span>
                <button onClick={fetchAll} className="ap-refresh-btn" type="button" aria-label="Refresh utilizer applications">
                  <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="ap-loading">
                <span className="ap-loading-icon">
                  <Loader2 size={22} strokeWidth={2.35} aria-hidden="true" />
                </span>
                Loading...
              </div>
            ) : utilizers.length === 0 ? (
              <div className="ap-empty">
                <span className="ap-empty-icon">
                  <CircleCheck size={22} strokeWidth={2.45} aria-hidden="true" />
                </span>
                <p>No pending utilizer applications</p>
              </div>
            ) : (
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Station</th>
                    <th>License & Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {utilizers.map(u => {
                    const id    = u.id;
                    const email = u.user?.email || "-";
                    const name  = u.user?.fullName || email.split("@")[0];

                    return (
                      <React.Fragment key={id}>
                        <tr>
                          <td data-label="Applicant">
                            <div className="ap-user-cell">
                              <div className="ap-avatar">{name.charAt(0).toUpperCase()}</div>
                              <div>
                                <div className="ap-user-name">{name}</div>
                                <div className="ap-user-email">{email}</div>
                              </div>
                            </div>
                          </td>

                          <td data-label="Station">
                            <div className="ap-detail">
                              <div className="ap-detail-strong">{u.stationName}</div>
                              <div><span>Address: </span>{u.stationAddress}</div>
                              <div><span>Method: </span>{u.method}</div>
                            </div>
                          </td>

                          <td data-label="License & Capacity">
                            <div className="ap-detail">
                              <div><span>No. </span>{u.licenseNumber}</div>
                              <div><span>Exp: </span>{u.licenseExpiry ? new Date(u.licenseExpiry).toLocaleDateString() : "-"}</div>
                              <div><span>Capacity: </span>{u.capacity ? `${u.capacity} kg/day` : "-"}</div>
                              <div><span>Waste types: </span>{(u.wasteTypes || []).join(", ") || "-"}</div>
                            </div>
                            <button className="ap-expand-btn" onClick={() => toggleExpand(`u_${id}`)} type="button">
                              {expanded[`u_${id}`] ? (
                                <>
                                  <ChevronUp size={14} strokeWidth={2.35} aria-hidden="true" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={14} strokeWidth={2.35} aria-hidden="true" />
                                  More
                                </>
                              )}
                            </button>
                          </td>

                          <td data-label="Status">
                            <span className="ap-badge ap-badge-pending">
                              <Loader2 size={13} strokeWidth={2.35} aria-hidden="true" />
                              Pending
                            </span>
                          </td>

                          <td data-label="Actions">
                            <div className="ap-actions">
                              <button className="ap-btn ap-btn-approve"
                                disabled={saving[`u_${id}`]}
                                onClick={() => handleUtilizer(id, "approved")}
                                type="button">
                                {saving[`u_${id}`] ? (
                                  "Saving..."
                                ) : (
                                  <>
                                    <CircleCheck size={15} strokeWidth={2.45} aria-hidden="true" />
                                    Approve
                                  </>
                                )}
                              </button>
                              <button className="ap-btn ap-btn-reject"
                                disabled={saving[`u_${id}`]}
                                onClick={() => handleUtilizer(id, "rejected")}
                                type="button">
                                <CircleX size={15} strokeWidth={2.45} aria-hidden="true" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expanded[`u_${id}`] && (
                          <tr className="ap-expanded-row">
                            <td colSpan={5} className="ap-expanded-cell">
                              <div className="ap-detail-panel">
                                <div className="ap-detail-panel-title">
                                  <MapPin size={15} strokeWidth={2.35} aria-hidden="true" />
                                  Contact & Location
                                </div>
                                <div className="ap-detail-grid">
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Contact:</span>
                                    <span className="ap-detail-val">{u.contactName || "-"}</span>
                                  </div>
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Phone:</span>
                                    <span className="ap-detail-val">
                                      <Phone size={12} strokeWidth={2.35} aria-hidden="true" /> {u.contactPhone || "-"}
                                    </span>
                                  </div>
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Coordinates:</span>
                                    <span className="ap-detail-val">
                                      {u.stationLat && u.stationLon ? `${u.stationLat}, ${u.stationLon}` : "Not set"}
                                    </span>
                                  </div>
                                  <div className="ap-detail-row">
                                    <span className="ap-detail-key">Applied:</span>
                                    <span className="ap-detail-val">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {toast && <div className="ap-toast">{toast}</div>}
    </>
  );
}
