import React, { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Truck, X } from "lucide-react";
import { completeTask, getInboundTasks } from "../services/api";
import { useSocket } from "../hooks/useSocket";

const css = `
  .il-root,
  .il-root * { box-sizing: border-box; }

  .il-root {
    min-height: 100vh;
    padding: clamp(18px, 4vw, 32px);
    background:
      radial-gradient(circle at top left, rgba(20, 157, 128, 0.1), transparent 32rem),
      linear-gradient(180deg, #f7f8fb 0%, #f2f3f8 100%);
    color: #111827;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .il-shell { width: min(1120px, 100%); margin: 0 auto; }

  .il-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 18px;
  }

  .il-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 8px;
    padding: 6px 10px;
    border: 1px solid rgba(20, 157, 128, 0.2);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    color: #0f8f75;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .il-header h1 {
    margin: 0;
    font-size: clamp(1.42rem, 4.8vw, 1.9rem);
    font-weight: 800;
    letter-spacing: -0.035em;
  }

  .il-header p {
    margin: 8px 0 0;
    max-width: 560px;
    color: #6f7684;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .il-refresh {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid #e7e9f1;
    border-radius: 14px;
    background: #fff;
    color: #0f8f75;
    cursor: pointer;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 800;
    box-shadow: 0 8px 22px rgba(24, 33, 49, 0.05);
  }

  .il-refresh:hover { background: #f8faf9; }

  .il-card {
    overflow: hidden;
    border: 1px solid #e7e9f1;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 12px 30px rgba(24, 33, 49, 0.07);
  }

  .il-table-wrap { overflow-x: auto; }

  .il-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 640px;
  }

  .il-table th,
  .il-table td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid #eef0f5;
    font-size: 0.88rem;
  }

  .il-table th {
    background: #f8faf9;
    color: #6f7684;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .il-table tr:last-child td { border-bottom: 0; }

  .il-driver {
    font-weight: 700;
    color: #101318;
  }

  .il-driver-sub {
    margin-top: 2px;
    color: #8b93a1;
    font-size: 0.76rem;
    font-weight: 500;
  }

  .il-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 800;
  }

  .il-badge.assigned {
    background: #e8f2fb;
    color: #2563a8;
  }

  .il-badge.in_transit {
    background: #fff4df;
    color: #9a6700;
  }

  .il-action-btn {
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid rgba(20, 157, 128, 0.24);
    border-radius: 10px;
    background: #e7f6f1;
    color: #0d8069;
    cursor: pointer;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .il-action-btn:hover { background: #d9f0e8; }
  .il-action-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .il-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(16, 19, 24, 0.42);
  }

  .il-modal {
    width: min(100%, 420px);
    padding: 22px;
    border: 1px solid #e7e9f1;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 18px 48px rgba(16, 19, 24, 0.18);
  }

  .il-modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .il-modal-head h3 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 800; }
  .il-modal-head p { margin: 0; color: #6f7684; font-size: 0.82rem; line-height: 1.45; }

  .il-modal-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 10px;
    background: #f4f3f8;
    color: #6f7684;
    cursor: pointer;
  }

  .il-field label {
    display: block;
    margin-bottom: 6px;
    color: #6f7684;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .il-field input {
    width: 100%;
    min-height: 42px;
    padding: 0 12px;
    border: 1px solid #e7e9f1;
    border-radius: 12px;
    font: inherit;
    font-size: 0.92rem;
  }

  .il-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
  }

  .il-modal-actions button {
    flex: 1;
    min-height: 42px;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 800;
  }

  .il-btn-cancel {
    border: 1px solid #e7e9f1;
    background: #fff;
    color: #6f7684;
  }

  .il-btn-submit {
    border: 0;
    background: #149d80;
    color: #fff;
  }

  .il-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .il-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 10001;
    padding: 12px 18px;
    border-radius: 14px;
    background: #101318;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .il-empty,
  .il-loading {
    padding: 48px 20px;
    text-align: center;
    color: #6f7684;
  }

  .il-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: 12px;
    border-radius: 50%;
    background: #e7f6f1;
    color: #149d80;
  }

  .il-spin { animation: il-spin 1s linear infinite; }

  @keyframes il-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 700px) {
    .il-table th:nth-child(4),
    .il-table td:nth-child(4) { display: none; }
  }
`;

const STATUS_LABELS = {
  at_utilization: "At station — awaiting disposal",
};

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export default function UtilizerInbound() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disposeTask, setDisposeTask] = useState(null);
  const [actualWeight, setActualWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchInbound = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getInboundTasks();
      const nextRows = Array.isArray(res.data) ? res.data : [];
      setRows(nextRows);
      setDisposeTask((current) => {
        if (!current || nextRows.some((row) => row.id === current.id)) return current;
        setActualWeight("");
        return null;
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load queue");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbound();
    const id = setInterval(fetchInbound, 15000);
    return () => clearInterval(id);
  }, [fetchInbound]);

  useSocket({
    "task:updated": () => fetchInbound(),
  });

  const openDisposeModal = (row) => {
    setDisposeTask(row);
    setActualWeight("");
  };

  const closeDisposeModal = () => {
    if (submitting) return;
    setDisposeTask(null);
    setActualWeight("");
  };

  const handleDisposeSubmit = async (e) => {
    e.preventDefault();
    if (!disposeTask) return;

    const weight = Number(actualWeight);
    if (!Number.isFinite(weight) || weight <= 0) {
      showToast("Enter a valid weight (kg)");
      return;
    }

    setSubmitting(true);
    try {
      await completeTask(disposeTask.id, { actualWeight: weight });
      setRows((prev) => prev.filter((row) => row.id !== disposeTask.id));
      setDisposeTask(null);
      setActualWeight("");
      showToast("Waste accepted and disposed");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to complete task");
      fetchInbound();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="il-root">
        <div className="il-shell">
          <div className="il-header">
            <div>
              <div className="il-kicker">
                <Truck size={14} strokeWidth={2.4} />
                Inbound Logistics
              </div>
              <h1>Inbound queue</h1>
              <p>
                Waste delivered by drivers to your station. Accept and dispose only after delivery.
                The list updates automatically.
              </p>
            </div>
            <button className="il-refresh" onClick={fetchInbound} type="button">
              <RefreshCw size={16} className={loading ? "il-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="il-card">
            {loading && rows.length === 0 ? (
              <div className="il-loading">
                <Loader2 size={28} className="il-spin" />
                <p>Loading queue...</p>
              </div>
            ) : error ? (
              <div className="il-empty">
                <p>{error}</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="il-empty">
                <div className="il-empty-icon">
                  <Truck size={24} />
                </div>
                <p>No waste waiting at your station</p>
              </div>
            ) : (
              <div className="il-table-wrap">
                <table className="il-table">
                  <thead>
                    <tr>
                      <th>Driver name</th>
                      <th>Container code</th>
                      <th>Trip status</th>
                      <th>Assigned</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="il-driver">{row.driverName}</div>
                          {row.driverEmail && (
                            <div className="il-driver-sub">{row.driverEmail}</div>
                          )}
                        </td>
                        <td>{row.containerId}</td>
                        <td>
                          <span className={`il-badge ${row.status}`}>
                            {statusLabel(row.status)}
                          </span>
                        </td>
                        <td>
                          {row.assignedAt
                            ? new Date(row.assignedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td>
                          <button
                            className="il-action-btn"
                            type="button"
                            onClick={() => openDisposeModal(row)}
                          >
                            Accept & Dispose
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {disposeTask && (
        <div className="il-modal-overlay" onClick={closeDisposeModal}>
          <form className="il-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleDisposeSubmit}>
            <div className="il-modal-head">
              <div>
                <h3>Accept & Dispose</h3>
                <p>
                  Container {disposeTask.containerId} · driver {disposeTask.driverName}
                </p>
              </div>
              <button className="il-modal-close" onClick={closeDisposeModal} type="button" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="il-field">
              <label htmlFor="actual-weight">Actual Weight (kg)</label>
              <input
                id="actual-weight"
                type="number"
                min="0.1"
                step="0.1"
                required
                value={actualWeight}
                onChange={(e) => setActualWeight(e.target.value)}
                placeholder="e.g. 12.5"
              />
            </div>
            <div className="il-modal-actions">
              <button className="il-btn-cancel" onClick={closeDisposeModal} disabled={submitting} type="button">
                Cancel
              </button>
              <button className="il-btn-submit" disabled={submitting} type="submit">
                {submitting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="il-toast">{toast}</div>}
    </>
  );
}
