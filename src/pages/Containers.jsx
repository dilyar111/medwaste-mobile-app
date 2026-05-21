import React, { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gauge,
  Loader2,
  PackageCheck,
  RefreshCw,
  Scale,
  SlidersHorizontal,
  Thermometer,
} from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { getBins } from "../services/api";

const css = `
  .ct-root {
    --ct-bg: #f4f3f8;
    --ct-card: #ffffff;
    --ct-ink: #101318;
    --ct-muted: #7d8490;
    --ct-line: #e7e7ef;
    --ct-teal: #149d80;
    --ct-teal-dark: #0d8069;
    --ct-teal-soft: #e7f6f1;
    --ct-blue: #4f96ce;
    --ct-blue-dark: #286b9d;
    --ct-blue-soft: #e8f2fb;
    --ct-red: #e6535d;
    --ct-red-soft: #fff0f1;
    --ct-amber: #f4a62a;
    --ct-amber-soft: #fff8e8;
    --ct-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--ct-bg);
    color: var(--ct-ink);
  }

  .ct-root,
  .ct-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .ct-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .ct-page-header h1 {
    margin: 0 0 5px;
    color: var(--ct-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .ct-page-header p {
    margin: 0;
    max-width: 700px;
    color: var(--ct-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .ct-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border: 1px solid rgba(20,157,128,.18);
    border-radius: 16px;
    background: var(--ct-teal-soft);
    color: var(--ct-teal-dark);
    box-shadow: var(--ct-shadow);
  }

  .ct-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 18px;
    padding: 12px 14px;
    border: 1px solid rgba(231, 231, 239, .92);
    border-radius: 18px;
    background: rgba(255,255,255,.94);
    box-shadow: var(--ct-shadow);
  }

  .ct-toolbar-left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ct-sort-wrap {
    position: relative;
    min-width: min(100%, 250px);
  }

  .ct-sort-select {
    width: 100%;
    min-height: 38px;
    padding: 0 36px 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    color: var(--ct-ink);
    cursor: pointer;
    outline: none;
    appearance: none;
    font: inherit;
    font-size: .82rem;
    font-weight: 800;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .ct-sort-select:focus {
    border-color: rgba(20,157,128,.72);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .ct-sort-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    color: var(--ct-muted);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .ct-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 11px;
    border-radius: 999px;
    background: var(--ct-blue-soft);
    color: var(--ct-blue-dark);
    font-size: .76rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .ct-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #fff;
    color: var(--ct-ink);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .ct-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .ct-btn-primary {
    border-color: rgba(20,157,128,.2);
    background: var(--ct-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .ct-btn-primary:hover {
    background: var(--ct-teal-dark);
  }

  .ct-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: 16px;
  }

  .ct-card {
    position: relative;
    overflow: hidden;
    padding: 18px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 18px;
    background: rgba(255,255,255,.96);
    box-shadow: var(--ct-shadow);
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }

  .ct-card:hover {
    border-color: rgba(20,157,128,.18);
    box-shadow: 0 12px 30px rgba(24, 33, 49, .09);
    transform: translateY(-2px);
  }

  .ct-card-accent {
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .ct-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 5px;
  }

  .ct-card-id-wrap {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .ct-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 13px;
    background: var(--ct-teal-soft);
    color: var(--ct-teal-dark);
  }

  .ct-card-id {
    color: var(--ct-ink);
    font-size: .95rem;
    font-weight: 900;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .ct-status-badge {
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

  .ct-status-active { background: var(--ct-teal-soft); color: var(--ct-teal-dark); }
  .ct-status-warning { background: var(--ct-amber-soft); color: #8a5a0a; }
  .ct-status-critical { background: var(--ct-red-soft); color: var(--ct-red); }

  .ct-card-sub {
    margin: 0 0 15px 43px;
    color: var(--ct-muted);
    font-size: .74rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .ct-fullness-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 7px;
    color: var(--ct-muted);
    font-size: .78rem;
    font-weight: 800;
  }

  .ct-fullness-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ct-fullness-val {
    color: var(--ct-ink);
    font-weight: 900;
  }

  .ct-bar-track {
    height: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    border-radius: 999px;
    background: #eceef4;
  }

  .ct-bar-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 999px;
    transition: width .6s cubic-bezier(.22,1,.36,1);
  }

  .ct-stats-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 14px;
  }

  .ct-stat {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 54px;
    padding: 9px 10px;
    border: 1px solid rgba(231,231,239,.72);
    border-radius: 14px;
    background: #f8f8fb;
  }

  .ct-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    border-radius: 10px;
    background: #fff;
    color: var(--ct-teal-dark);
  }

  .ct-stat-val {
    color: var(--ct-ink);
    font-size: .84rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .ct-stat-label {
    margin-top: 2px;
    color: var(--ct-muted);
    font-size: .68rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .ct-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid #f1f2f6;
  }

  .ct-type-badge,
  .ct-date {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    line-height: 1.2;
  }

  .ct-type-badge {
    padding: 4px 9px;
    border-radius: 999px;
    background: var(--ct-blue-soft);
    color: var(--ct-blue-dark);
    font-size: .72rem;
    font-weight: 900;
    overflow-wrap: anywhere;
  }

  .ct-date {
    flex-shrink: 0;
    color: var(--ct-muted);
    font-size: .72rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .ct-loading,
  .ct-empty {
    display: grid;
    place-items: center;
    gap: 10px;
    min-height: 180px;
    padding: 44px 20px;
    color: var(--ct-muted);
    font-size: .88rem;
    text-align: center;
  }

  .ct-loading-icon,
  .ct-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: var(--ct-teal-soft);
    color: var(--ct-teal-dark);
  }

  .ct-loading-icon svg {
    animation: ctSpin .9s linear infinite;
  }

  @keyframes ctSpin {
    to { transform: rotate(360deg); }
  }

  @media(max-width: 860px) {
    .ct-root {
      padding: 16px;
    }
  }

  @media(max-width: 700px) {
    .ct-page-header {
      align-items: center;
      margin-bottom: 16px;
    }

    .ct-page-header h1 {
      font-size: 1.45rem;
    }

    .ct-page-header p {
      font-size: .82rem;
    }

    .ct-toolbar {
      align-items: stretch;
      flex-direction: column;
      padding: 10px;
      border-radius: 16px;
    }

    .ct-toolbar-left {
      width: 100%;
    }

    .ct-sort-wrap,
    .ct-btn {
      width: 100%;
    }

    .ct-count {
      width: 100%;
      justify-content: center;
    }

    .ct-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .ct-card {
      padding: 15px;
      border-radius: 16px;
    }

    .ct-card-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .ct-card-sub {
      margin-left: 0;
    }

    .ct-card-footer {
      align-items: flex-start;
      flex-direction: column;
    }

    .ct-date {
      white-space: normal;
    }
  }
`;

function Containers() {
  const [bins, setBins] = useState([]);
  const [sortType, setSortType] = useState("fullness_desc");
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    try {
      const res = await getBins();
      const items = Array.isArray(res.data) ? res.data : (res.data?.bins || []);
      setBins(items);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bins:", err);
      setBins([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
    const id = setInterval(fetchBins, 5000);
    return () => clearInterval(id);
  }, []);

  useSocket({
    "telemetry:update": ({ binId, fullness, timestamp }) => {
      setBins(prev => {
        const exists = prev.find(b => b._id === binId);
        if (exists) return prev.map(b => b._id === binId ? { ...b, fullness, timestamp } : b);
        fetchBins();
        return prev;
      });
    },
  });

  const sortedBins = useMemo(() => {
    let result = [...bins];
    if (sortType === "fullness_desc") result.sort((a, b) => b.fullness - a.fullness);
    if (sortType === "fullness_asc")  result.sort((a, b) => a.fullness - b.fullness);
    if (sortType === "id_asc")        result.sort((a, b) => a._id.localeCompare(b._id));
    return result;
  }, [bins, sortType]);

  const getStatusInfo = (val) => {
    if (val >= 80) return { class: "ct-status-critical", label: "Critical", color: "#e6535d", icon: AlertTriangle };
    if (val >= 60) return { class: "ct-status-warning", label: "Warning", color: "#f4a62a", icon: AlertCircle };
    return { class: "ct-status-active", label: "Active", color: "#149d80", icon: CheckCircle2 };
  };

  return (
    <>
      <style>{css}</style>
      <div className="ct-root">
        <div className="ct-page-header">
          <div>
            <h1>Bins Monitoring</h1>
            <p>Real-time status of all medical waste containers</p>
          </div>
          <span className="ct-header-icon">
            <Boxes size={22} strokeWidth={2.35} aria-hidden="true" />
          </span>
        </div>

        <div className="ct-toolbar">
          <div className="ct-toolbar-left">
            <div className="ct-sort-wrap">
              <select
                className="ct-sort-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="fullness_desc">Sort by Fullness (High)</option>
                <option value="fullness_asc">Sort by Fullness (Low)</option>
                <option value="id_asc">Sort by ID</option>
              </select>
              <ChevronDown className="ct-sort-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
            </div>
            <span className="ct-count">
              <PackageCheck size={14} strokeWidth={2.35} aria-hidden="true" />
              Total Bins: {bins.length}
            </span>
          </div>
          <button className="ct-btn ct-btn-primary" onClick={fetchBins} type="button">
            <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
            Update Data
          </button>
        </div>

        {loading ? (
          <div className="ct-loading">
            <span className="ct-loading-icon">
              <Loader2 size={22} strokeWidth={2.35} aria-hidden="true" />
            </span>
            Loading containers...
          </div>
        ) : sortedBins.length === 0 ? (
          <div className="ct-empty">
            <span className="ct-empty-icon">
              <Boxes size={22} strokeWidth={2.35} aria-hidden="true" />
            </span>
            No containers found
          </div>
        ) : (
          <div className="ct-grid">
            {sortedBins.map((bin) => {
              const fullness = Number(bin.fullness ?? 0);
              const status = getStatusInfo(fullness);
              const StatusIcon = status.icon;

              return (
                <div key={bin._id} className="ct-card">
                  <div className="ct-card-accent" style={{ background: status.color }} />

                  <div className="ct-card-head">
                    <div className="ct-card-id-wrap">
                      <span className="ct-card-icon">
                        <PackageCheck size={17} strokeWidth={2.35} aria-hidden="true" />
                      </span>
                      <span className="ct-card-id">{bin._id}</span>
                    </div>
                    <span className={`ct-status-badge ${status.class}`}>
                      <StatusIcon size={13} strokeWidth={2.45} aria-hidden="true" />
                      {status.label}
                    </span>
                  </div>

                  <div className="ct-card-sub">{bin.wasteType || "-"} / ID: {bin._id}</div>

                  <div className="ct-fullness-header">
                    <span className="ct-fullness-label">
                      <Gauge size={14} strokeWidth={2.35} aria-hidden="true" />
                      Current Fullness
                    </span>
                    <span className="ct-fullness-val">{fullness.toFixed(1)}%</span>
                  </div>
                  <div className="ct-bar-track">
                    <div
                      className="ct-bar-fill"
                      style={{
                        width: `${fullness}%`,
                        background: status.color,
                      }}
                    />
                  </div>

                  <div className="ct-stats-row">
                    <div className="ct-stat">
                      <span className="ct-stat-icon">
                        <Thermometer size={15} strokeWidth={2.35} aria-hidden="true" />
                      </span>
                      <div>
                        <div className="ct-stat-val">{bin.temperature ?? "-"}</div>
                        <div className="ct-stat-label">Temperature</div>
                      </div>
                    </div>
                    <div className="ct-stat">
                      <span className="ct-stat-icon">
                        <Scale size={15} strokeWidth={2.35} aria-hidden="true" />
                      </span>
                      <div>
                        <div className="ct-stat-val">{bin.weightKg != null ? `${Number(bin.weightKg).toFixed(1)} kg` : "-"}</div>
                        <div className="ct-stat-label">Est. Weight</div>
                      </div>
                    </div>
                  </div>

                  <div className="ct-card-footer">
                    <span className="ct-type-badge">
                      <SlidersHorizontal size={12} strokeWidth={2.35} aria-hidden="true" />
                      {bin.wasteType ? `Type ${bin.wasteType}` : "-"}
                    </span>
                    <span className="ct-date">
                      <Clock3 size={12} strokeWidth={2.35} aria-hidden="true" />
                      Last: {bin.timestamp ? new Date(bin.timestamp).toLocaleTimeString() : "-"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Containers;
