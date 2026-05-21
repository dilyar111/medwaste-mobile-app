import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Hash,
  Mail,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import { getPendingDrivers, updateDriverStatus } from "../services/api";

const css = `
  .ad-root {
    --ad-bg: #f4f3f8;
    --ad-card: #ffffff;
    --ad-ink: #101318;
    --ad-muted: #7d8490;
    --ad-line: #e7e7ef;
    --ad-teal: #149d80;
    --ad-teal-dark: #0d8069;
    --ad-teal-soft: #e7f6f1;
    --ad-blue: #4f96ce;
    --ad-blue-soft: #e8f2fb;
    --ad-red: #e6535d;
    --ad-red-soft: #fff0f1;
    --ad-amber: #f4a62a;
    --ad-amber-soft: #fff8e8;
    --ad-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--ad-bg);
    color: var(--ad-ink);
  }

  .ad-root,
  .ad-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .ad-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .ad-header h1 {
    margin: 0 0 5px;
    color: var(--ad-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .ad-header p {
    margin: 0;
    max-width: 680px;
    color: var(--ad-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .ad-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border: 1px solid rgba(20,157,128,.18);
    border-radius: 16px;
    background: var(--ad-teal-soft);
    color: var(--ad-teal-dark);
    box-shadow: var(--ad-shadow);
  }

  .ad-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .ad-stat,
  .ad-card {
    border: 1px solid rgba(231, 231, 239, .92);
    background: rgba(255,255,255,.94);
    box-shadow: var(--ad-shadow);
  }

  .ad-stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 18px;
  }

  .ad-stat-label {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    color: var(--ad-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .ad-stat-value {
    color: var(--ad-ink);
    font-size: clamp(1.3rem, 5vw, 1.7rem);
    font-weight: 900;
    line-height: 1;
  }

  .ad-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
    background: #f3f7f6;
    color: var(--ad-teal);
  }

  .ad-card {
    overflow: hidden;
    border-radius: 18px;
  }

  .ad-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .ad-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ad-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .ad-card-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--ad-amber-soft);
    color: #8a5a0a;
    font-size: .74rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .ad-table {
    width: 100%;
    border-collapse: collapse;
    font-size: .84rem;
  }

  .ad-table th {
    padding: 12px 16px;
    background: #f8f8fb;
    color: var(--ad-muted);
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .ad-table td {
    padding: 14px 16px;
    border-top: 1px solid #f2f3f7;
    vertical-align: middle;
  }

  .ad-table tr:hover td {
    background: #fbfcfd;
  }

  .ad-driver-cell,
  .ad-detail-line,
  .ad-actions {
    display: flex;
    align-items: center;
  }

  .ad-driver-cell {
    gap: 10px;
  }

  .ad-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 50%;
    background: var(--ad-teal);
    color: #fff;
  }

  .ad-primary {
    color: var(--ad-ink);
    font-size: .88rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ad-secondary,
  .ad-detail-line {
    color: var(--ad-muted);
    font-size: .72rem;
    line-height: 1.3;
  }

  .ad-secondary {
    margin-top: 3px;
  }

  .ad-detail-line {
    gap: 5px;
    margin-top: 4px;
    overflow-wrap: anywhere;
  }

  .ad-company {
    color: #286b9d;
    font-weight: 900;
  }

  .ad-plate {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
    padding: 4px 8px;
    border-radius: 999px;
    background: #f4f6f8;
    color: #5e6673;
    font-size: .7rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .ad-actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .ad-action-btn {
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
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .ad-action-btn:hover {
    transform: translateY(-1px);
  }

  .ad-approve {
    border: 1px solid rgba(20,157,128,.2);
    background: var(--ad-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .ad-approve:hover {
    background: var(--ad-teal-dark);
  }

  .ad-reject {
    border: 1px solid rgba(230,83,93,.36);
    background: #fff;
    color: var(--ad-red);
  }

  .ad-reject:hover {
    background: var(--ad-red-soft);
  }

  .ad-empty {
    display: grid;
    place-items: center;
    gap: 10px;
    padding: 44px 20px;
    color: var(--ad-muted);
    font-size: .88rem;
    text-align: center;
  }

  .ad-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: var(--ad-teal-soft);
    color: var(--ad-teal-dark);
  }

  @media(max-width: 800px) {
    .ad-root {
      padding: 16px;
    }

    .ad-stats {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .ad-stat {
      padding: 13px 14px;
      border-radius: 16px;
    }
  }

  @media(max-width: 700px) {
    .ad-header {
      align-items: center;
      margin-bottom: 16px;
    }

    .ad-header h1 {
      font-size: 1.45rem;
    }

    .ad-header p {
      font-size: .82rem;
    }

    .ad-card-head {
      align-items: flex-start;
      flex-direction: column;
      padding: 12px 14px;
    }

    .ad-table,
    .ad-table tbody,
    .ad-table tr,
    .ad-table td {
      display: block;
      width: 100%;
    }

    .ad-table thead {
      display: none;
    }

    .ad-table tr {
      margin: 10px;
      overflow: hidden;
      border: 1px solid var(--ad-line);
      border-radius: 14px;
      background: #fff;
    }

    .ad-table td {
      padding: 10px 12px;
      border-top: 1px solid #f3f4f8;
    }

    .ad-table td:first-child {
      border-top: none;
    }

    .ad-table td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 5px;
      color: #6b7280;
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .ad-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .ad-action-btn {
      width: 100%;
      min-height: 38px;
    }
  }
`;

const AdminDrivers = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getPendingDrivers();
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await updateDriverStatus(id, status);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      alert(`Driver ${status}!`);
    } catch (err) {
      console.error(err);
      alert("Action failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ad-root">
        <div className="ad-header">
          <div>
            <h1>Driver Approval Queue</h1>
            <p>Review pending driver applications and approve verified logistics access.</p>
          </div>
          <span className="ad-header-icon">
            <ShieldCheck size={22} strokeWidth={2.35} aria-hidden="true" />
          </span>
        </div>

        <div className="ad-stats">
          <div className="ad-stat">
            <div>
              <div className="ad-stat-label">
                <UserCheck size={14} strokeWidth={2.35} aria-hidden="true" />
                Pending drivers
              </div>
              <div className="ad-stat-value">{requests.length}</div>
            </div>
            <span className="ad-stat-icon">
              <Truck size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>

          <div className="ad-stat">
            <div>
              <div className="ad-stat-label">
                <ClipboardCheck size={14} strokeWidth={2.35} aria-hidden="true" />
                Review status
              </div>
              <div className="ad-stat-value">{requests.length ? "Open" : "Clear"}</div>
            </div>
            <span className="ad-stat-icon">
              <BadgeCheck size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>

          <div className="ad-stat">
            <div>
              <div className="ad-stat-label">
                <Building2 size={14} strokeWidth={2.35} aria-hidden="true" />
                Workflow
              </div>
              <div className="ad-stat-value">Admin</div>
            </div>
            <span className="ad-stat-icon">
              <ShieldCheck size={20} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-card-head">
            <span className="ad-card-title">
              <Truck size={18} strokeWidth={2.35} aria-hidden="true" />
              Driver Applications
            </span>
            <span className="ad-card-count">
              <ClipboardCheck size={14} strokeWidth={2.35} aria-hidden="true" />
              {requests.length} pending
            </span>
          </div>

          <table className="ad-table">
            <thead>
              <tr>
                <th>Driver / Email</th>
                <th>License & Company</th>
                <th>Vehicle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td data-label="Driver / Email">
                    <div className="ad-driver-cell">
                      <div className="ad-avatar">
                        <Mail size={17} strokeWidth={2.35} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="ad-primary">{req.userId?.email || "N/A"}</div>
                        <div className="ad-detail-line">
                          <Hash size={12} strokeWidth={2.35} aria-hidden="true" />
                          ID: {req._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td data-label="License & Company">
                    <div className="ad-primary">{req.licenseNumber}</div>
                    <div className="ad-detail-line ad-company">
                      <Building2 size={12} strokeWidth={2.35} aria-hidden="true" />
                      {req.company}
                    </div>
                  </td>

                  <td data-label="Vehicle">
                    <div className="ad-primary">{req.vehicleModel} ({req.vehicleYear})</div>
                    <span className="ad-plate">
                      <Truck size={12} strokeWidth={2.35} aria-hidden="true" />
                      Plate: {req.plateNumber}
                    </span>
                  </td>

                  <td data-label="Actions">
                    <div className="ad-actions">
                      <button
                        onClick={() => handleAction(req._id, "approved")}
                        className="ad-action-btn ad-approve"
                        type="button"
                      >
                        <CircleCheck size={15} strokeWidth={2.45} aria-hidden="true" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        className="ad-action-btn ad-reject"
                        type="button"
                      >
                        <CircleX size={15} strokeWidth={2.45} aria-hidden="true" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <div className="ad-empty">
              <span className="ad-empty-icon">
                <CircleCheck size={22} strokeWidth={2.45} aria-hidden="true" />
              </span>
              No pending applications. Good job!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDrivers;
