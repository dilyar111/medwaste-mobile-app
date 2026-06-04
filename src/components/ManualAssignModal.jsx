import React, { useEffect, useState } from "react";
import { Loader2, Truck, X } from "lucide-react";
import { assignTask, getAvailableDrivers } from "../services/api";

const css = `
  .ma-overlay {
    position: fixed;
    inset: 0;
    z-index: 10002;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(16, 19, 24, 0.42);
  }

  .ma-modal {
    width: min(100%, 440px);
    padding: 22px;
    border: 1px solid #e7e9f1;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 18px 48px rgba(16, 19, 24, 0.18);
  }

  .ma-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .ma-head h3 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 800; }
  .ma-head p { margin: 0; color: #6f7684; font-size: 0.82rem; line-height: 1.45; }

  .ma-close {
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

  .ma-field label {
    display: block;
    margin-bottom: 6px;
    color: #6f7684;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .ma-field select {
    width: 100%;
    min-height: 42px;
    padding: 0 12px;
    border: 1px solid #e7e9f1;
    border-radius: 12px;
    font: inherit;
    font-size: 0.88rem;
    background: #fff;
  }

  .ma-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
  }

  .ma-actions button {
    flex: 1;
    min-height: 42px;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 800;
  }

  .ma-cancel {
    border: 1px solid #e7e9f1;
    background: #fff;
    color: #6f7684;
  }

  .ma-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    background: #149d80;
    color: #fff;
  }

  .ma-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .ma-empty {
    padding: 12px;
    border-radius: 12px;
    background: #fff8e8;
    color: #9a6700;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .ma-spin { animation: ma-spin 1s linear infinite; }

  @keyframes ma-spin { to { transform: rotate(360deg); } }
`;

export default function ManualAssignModal({ container, onClose, onAssigned }) {
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const containerId = container?.qrCode || container?._id;

  useEffect(() => {
    (async () => {
      setLoadingDrivers(true);
      setError("");
      try {
        const res = await getAvailableDrivers();
        const list = Array.isArray(res.data) ? res.data : [];
        setDrivers(list);
        if (list.length > 0) setDriverId(String(list[0].id));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load drivers");
        setDrivers([]);
      } finally {
        setLoadingDrivers(false);
      }
    })();
  }, [containerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverId || !containerId) return;

    setSubmitting(true);
    setError("");
    try {
      await assignTask(Number(driverId), containerId);
      onAssigned?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to assign task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ma-overlay" onClick={onClose}>
        <form className="ma-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <div className="ma-head">
            <div>
              <h3>Assign driver manually</h3>
              <p>
                Container {containerId}
                {container?.locationName ? ` · ${container.locationName}` : ""}
              </p>
            </div>
            <button className="ma-close" type="button" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {loadingDrivers ? (
            <div className="ma-empty" style={{ background: "#f8faf9", color: "#6f7684" }}>
              <Loader2 size={18} className="ma-spin" /> Loading drivers...
            </div>
          ) : drivers.length === 0 ? (
            <div className="ma-empty">
              No on-shift drivers available in your company.
            </div>
          ) : (
            <div className="ma-field">
              <label htmlFor="manual-driver">Driver</label>
              <select
                id="manual-driver"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              >
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.fullName}
                    {driver.plateNumber ? ` · ${driver.plateNumber}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="ma-empty" style={{ marginTop: 12 }}>{error}</div>}

          <div className="ma-actions">
            <button className="ma-cancel" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              className="ma-submit"
              type="submit"
              disabled={submitting || loadingDrivers || drivers.length === 0}
            >
              <Truck size={16} />
              {submitting ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
