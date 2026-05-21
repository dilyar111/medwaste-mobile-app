import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Gauge,
  Layers,
  List,
  Loader2,
  Map as MapIcon,
  MapPin,
  PackageOpen,
  RefreshCw,
  Route,
  SlidersHorizontal,
} from "lucide-react";
import { getBins } from "../services/api";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redBinIcon = new L.Icon({
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const css = `
  .mp-root {
    --mp-bg: #f4f3f8;
    --mp-card: #ffffff;
    --mp-ink: #101318;
    --mp-muted: #7d8490;
    --mp-line: #e7e7ef;
    --mp-teal: #149d80;
    --mp-teal-dark: #0d8069;
    --mp-teal-soft: #e7f6f1;
    --mp-blue: #4f96ce;
    --mp-blue-dark: #286b9d;
    --mp-blue-soft: #e8f2fb;
    --mp-red: #e6535d;
    --mp-red-soft: #fff0f1;
    --mp-amber: #f4a62a;
    --mp-amber-soft: #fff8e8;
    --mp-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--mp-bg);
    color: var(--mp-ink);
  }

  .mp-root,
  .mp-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .mp-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .mp-header h1 {
    margin: 0 0 5px;
    color: var(--mp-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .mp-header p {
    margin: 0;
    max-width: 700px;
    color: var(--mp-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .mp-header-btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }

  .mp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #fff;
    color: var(--mp-ink);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .mp-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .mp-btn-green {
    border-color: rgba(20,157,128,.2);
    background: var(--mp-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .mp-btn-green:hover {
    background: var(--mp-teal-dark);
  }

  .mp-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 16px;
    align-items: start;
  }

  .mp-map-card,
  .mp-sidebar {
    overflow: hidden;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 18px;
    background: rgba(255,255,255,.96);
    box-shadow: var(--mp-shadow);
  }

  .mp-map-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .mp-map-label-title,
  .mp-sidebar-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--mp-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .mp-map-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--mp-blue-soft);
    color: var(--mp-blue-dark);
    font-size: .74rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .mp-map-shell {
    height: 586px;
    width: 100%;
  }

  .mp-map-empty {
    display: grid;
    place-items: center;
    gap: 10px;
    height: 586px;
    padding: 20px;
    color: var(--mp-muted);
    font-size: .88rem;
    font-weight: 800;
    text-align: center;
  }

  .mp-map-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: var(--mp-teal-soft);
    color: var(--mp-teal-dark);
  }

  .mp-map-empty-icon svg {
    animation: mpSpin .9s linear infinite;
  }

  @keyframes mpSpin {
    to { transform: rotate(360deg); }
  }

  .mp-sidebar {
    display: flex;
    flex-direction: column;
    height: 632px;
  }

  .mp-sidebar-head {
    padding: 14px 16px 0;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .mp-sidebar-title {
    margin-bottom: 12px;
  }

  .mp-tabs {
    display: inline-flex;
    gap: 4px;
    max-width: 100%;
    margin-bottom: 10px;
    padding: 4px;
    border: 1px solid rgba(231,231,239,.72);
    border-radius: 14px;
    background: #ebeaf1;
  }

  .mp-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 12px;
    border: 0;
    border-radius: 11px;
    background: transparent;
    color: var(--mp-muted);
    cursor: pointer;
    font: inherit;
    font-size: .78rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, color .2s ease, box-shadow .2s ease;
  }

  .mp-tab:hover {
    color: var(--mp-ink);
  }

  .mp-tab.active {
    background: #fff;
    color: var(--mp-teal-dark);
    box-shadow: 0 5px 14px rgba(24, 33, 49, .08);
  }

  .mp-sort {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .mp-sort-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 30px;
    padding: 0 10px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 999px;
    background: #fff;
    color: var(--mp-muted);
    cursor: pointer;
    font: inherit;
    font-size: .72rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
  }

  .mp-sort-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .mp-sort-btn.active {
    border-color: rgba(20,157,128,.2);
    background: var(--mp-teal-soft);
    color: var(--mp-teal-dark);
  }

  .mp-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    padding: 10px;
  }

  .mp-bin-item {
    position: relative;
    overflow: hidden;
    padding: 12px 13px 12px 15px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 14px;
    background: #fff;
    cursor: pointer;
    transition: background .2s ease, border-color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .mp-bin-item:hover {
    border-color: rgba(20,157,128,.22);
    background: #fbfcfd;
    transform: translateY(-1px);
  }

  .mp-bin-item.selected {
    border-color: rgba(20,157,128,.32);
    background: var(--mp-teal-soft);
    box-shadow: 0 8px 18px rgba(20,157,128,.08);
  }

  .mp-bin-item-accent {
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .mp-bin-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 5px;
  }

  .mp-bin-id {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--mp-ink);
    font-size: .88rem;
    font-weight: 900;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .mp-bin-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: .68rem;
    font-weight: 900;
    line-height: 1.2;
    white-space: nowrap;
  }

  .mp-status-active {
    background: var(--mp-teal-soft);
    color: var(--mp-teal-dark);
  }

  .mp-bin-sub {
    margin-bottom: 9px;
    color: var(--mp-muted);
    font-size: .72rem;
    font-weight: 800;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .mp-bin-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
  }

  .mp-bin-bar-track {
    flex: 1;
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: #eceef4;
  }

  .mp-bin-bar-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 999px;
    transition: width .5s ease;
  }

  .mp-bin-pct {
    min-width: 38px;
    font-size: .78rem;
    font-weight: 900;
    text-align: right;
  }

  .mp-bin-coords {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--mp-muted);
    font-size: .68rem;
    font-weight: 800;
    line-height: 1.3;
  }

  .mp-stats-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding: 14px;
  }

  .mp-stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border: 1px solid rgba(231,231,239,.72);
    border-radius: 14px;
    background: #f8f8fb;
  }

  .mp-stat-label {
    color: var(--mp-muted);
    font-size: .8rem;
    font-weight: 800;
    line-height: 1.3;
  }

  .mp-stat-val {
    color: var(--mp-ink);
    font-size: .86rem;
    font-weight: 900;
    line-height: 1.3;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .mp-popup {
    min-width: 180px;
  }

  .mp-popup h3 {
    margin: 0 0 5px;
    color: var(--mp-ink);
    font-size: .94rem;
    font-weight: 900;
  }

  .mp-popup p {
    margin: 3px 0;
    color: #5e6673;
    font-size: .78rem;
    line-height: 1.35;
  }

  .mp-popup-bar {
    height: 6px;
    overflow: hidden;
    margin: 7px 0;
    border-radius: 999px;
    background: #eceef4;
  }

  @media(max-width: 900px) {
    .mp-root {
      padding: 16px;
    }

    .mp-layout {
      grid-template-columns: 1fr;
    }

    .mp-sidebar {
      height: auto;
      max-height: none;
    }

    .mp-list,
    .mp-stats-content {
      max-height: 420px;
    }
  }

  @media(max-width: 700px) {
    .mp-header {
      align-items: stretch;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .mp-header h1 {
      font-size: 1.45rem;
    }

    .mp-header p {
      font-size: .82rem;
    }

    .mp-header-btns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .mp-btn {
      width: 100%;
      min-height: 38px;
      padding: 0 10px;
      font-size: .78rem;
    }

    .mp-map-card,
    .mp-sidebar {
      border-radius: 16px;
    }

    .mp-map-label {
      align-items: flex-start;
      flex-direction: column;
      padding: 12px 14px;
    }

    .mp-map-shell,
    .mp-map-empty {
      height: 420px;
    }

    .mp-sidebar-head {
      padding: 12px 12px 0;
    }

    .mp-tabs {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .mp-sort {
      padding: 10px;
    }

    .mp-sort-btn {
      flex: 1 1 auto;
    }

    .mp-list,
    .mp-stats-content {
      max-height: 360px;
      padding: 10px;
    }
  }
`;

function barColor(fullness) {
  const pct = Number(fullness) || 0;
  return pct >= 80 ? "#e6535d" : pct >= 60 ? "#f4a62a" : "#149d80";
}

function normalizeBin(bin) {
  const lat = Number(bin.lat);
  const lon = Number(bin.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    id: bin.id,
    qrCode: bin.qrCode,
    locationName: bin.locationName,
    lat,
    lon,
    wasteType: bin.wasteType,
    latestFullness: Number.isFinite(Number(bin.latestFullness)) ? Number(bin.latestFullness) : 0,
    lastUpdated: bin.lastUpdated,
    status: bin.status || "unknown",
  };
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lon], 15, { duration: 1 });
  }, [map, target]);
  return null;
}

function MapPage() {
  const [tab, setTab] = useState("list");
  const [sort, setSort] = useState("fullness_desc");
  const [selected, setSelected] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBins = async () => {
    setError("");
    try {
      const { data } = await getBins();
      const nextBins = (Array.isArray(data) ? data : []).map(normalizeBin).filter(Boolean);
      setBins(nextBins);
      setSelected((current) => current && nextBins.find((bin) => bin.qrCode === current.qrCode) ? current : null);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to load map bins");
      setBins([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBins();
  }, []);

  const sorted = useMemo(() => {
    return [...bins].sort((a, b) => {
      if (sort === "fullness_desc") return b.latestFullness - a.latestFullness;
      if (sort === "fullness_asc") return a.latestFullness - b.latestFullness;
      if (sort === "recent") return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      return 0;
    });
  }, [bins, sort]);

  const avg = bins.length ? Math.round(bins.reduce((s, b) => s + b.latestFullness, 0) / bins.length) : 0;
  const maxBin = bins.reduce((max, bin) => (bin.latestFullness > max.latestFullness ? bin : max), bins[0] || null);
  const mapCenter = selected || bins[0];

  return (
    <>
      <style>{css}</style>
      <div className="mp-root">
        <div className="mp-header">
          <div>
            <h1>Container Map</h1>
            <p>Interactive map showing all container locations</p>
          </div>
          <div className="mp-header-btns">
            <button className="mp-btn" type="button">
              <SlidersHorizontal size={15} strokeWidth={2.35} aria-hidden="true" />
              Filters
            </button>
            <button className="mp-btn mp-btn-green" onClick={loadBins} type="button">
              <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mp-layout">
          <div className="mp-map-card">
            <div className="mp-map-label">
              <span className="mp-map-label-title">
                <MapIcon size={18} strokeWidth={2.35} aria-hidden="true" />
                Container Map
              </span>
              <span className="mp-map-chip">
                <MapPin size={14} strokeWidth={2.35} aria-hidden="true" />
                {bins.length} mapped
              </span>
            </div>
            {!mapCenter ? (
              <div className="mp-map-empty">
                <span className="mp-map-empty-icon">
                  {loading ? (
                    <Loader2 size={22} strokeWidth={2.35} aria-hidden="true" />
                  ) : (
                    <MapPin size={22} strokeWidth={2.35} aria-hidden="true" />
                  )}
                </span>
                {loading ? "Loading containers..." : error || "No geocoded containers available."}
              </div>
            ) : (
              <div className="mp-map-shell">
                <MapContainer center={[mapCenter.lat, mapCenter.lon]} zoom={12} style={{ height: "100%", width: "100%" }}>
                  <TileLayer attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {selected && <FlyTo target={selected} />}
                  {bins.map((bin) => (
                    <Marker key={bin.qrCode} position={[bin.lat, bin.lon]} icon={redBinIcon} eventHandlers={{ click: () => setSelected(bin) }}>
                      <Popup>
                        <div className="mp-popup">
                          <h3>{bin.qrCode}</h3>
                          <p>Status: <strong style={{ color: "#149d80" }}>{bin.status}</strong></p>
                          <p>Location: {bin.locationName || "-"}</p>
                          <div className="mp-popup-bar">
                            <div style={{ width: `${bin.latestFullness}%`, height: "100%", background: barColor(bin.latestFullness), borderRadius: 99 }} />
                          </div>
                          <p>Fullness: <strong>{bin.latestFullness}%</strong></p>
                          <p>Coords: {bin.lat}, {bin.lon}</p>
                          <p>Updated: {bin.lastUpdated ? new Date(bin.lastUpdated).toLocaleString() : "-"}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>

          <div className="mp-sidebar">
            <div className="mp-sidebar-head">
              <div className="mp-sidebar-title">
                <Layers size={18} strokeWidth={2.35} aria-hidden="true" />
                Containers
              </div>
              <div className="mp-tabs">
                <button className={`mp-tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")} type="button">
                  <List size={14} strokeWidth={2.35} aria-hidden="true" />
                  List
                </button>
                <button className={`mp-tab ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")} type="button">
                  <BarChart3 size={14} strokeWidth={2.35} aria-hidden="true" />
                  Statistics
                </button>
              </div>
            </div>

            {tab === "list" && (
              <>
                <div className="mp-sort">
                  <button className={`mp-sort-btn ${sort === "fullness_desc" ? "active" : ""}`} onClick={() => setSort("fullness_desc")} type="button">
                    <Gauge size={12} strokeWidth={2.35} aria-hidden="true" />
                    Fullness high
                  </button>
                  <button className={`mp-sort-btn ${sort === "fullness_asc" ? "active" : ""}`} onClick={() => setSort("fullness_asc")} type="button">
                    <Gauge size={12} strokeWidth={2.35} aria-hidden="true" />
                    Fullness low
                  </button>
                  <button className={`mp-sort-btn ${sort === "recent" ? "active" : ""}`} onClick={() => setSort("recent")} type="button">
                    <Clock3 size={12} strokeWidth={2.35} aria-hidden="true" />
                    Recently updated
                  </button>
                </div>
                <div className="mp-list">
                  {sorted.map((bin) => (
                    <div key={bin.qrCode} className={`mp-bin-item ${selected?.qrCode === bin.qrCode ? "selected" : ""}`} onClick={() => setSelected(bin)}>
                      <div className="mp-bin-item-accent" style={{ background: barColor(bin.latestFullness) }} />
                      <div className="mp-bin-head">
                        <span className="mp-bin-id">
                          <PackageOpen size={14} strokeWidth={2.35} aria-hidden="true" />
                          {bin.qrCode}
                        </span>
                        <span className="mp-bin-status mp-status-active">
                          <CheckCircle2 size={11} strokeWidth={2.5} aria-hidden="true" />
                          {bin.status}
                        </span>
                      </div>
                      <div className="mp-bin-sub">{bin.wasteType || "-"} / {bin.locationName || "-"}</div>
                      <div className="mp-bin-bar-row">
                        <div className="mp-bin-bar-track">
                          <div className="mp-bin-bar-fill" style={{ width: `${bin.latestFullness}%`, background: barColor(bin.latestFullness) }} />
                        </div>
                        <span className="mp-bin-pct" style={{ color: barColor(bin.latestFullness) }}>{bin.latestFullness}%</span>
                      </div>
                      <div className="mp-bin-coords">
                        <MapPin size={11} strokeWidth={2.35} aria-hidden="true" />
                        {bin.lat}, {bin.lon}
                      </div>
                    </div>
                  ))}
                  {!loading && sorted.length === 0 && (
                    <div className="mp-map-empty" style={{ height: "auto", minHeight: 160 }}>
                      <span className="mp-map-empty-icon">
                        <AlertTriangle size={22} strokeWidth={2.35} aria-hidden="true" />
                      </span>
                      {error || "No geocoded containers available."}
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "stats" && (
              <div className="mp-stats-content">
                {[
                  { label: "Total containers", val: bins.length },
                  { label: "Active", val: bins.filter((b) => b.status === "active").length },
                  { label: "Average fullness", val: `${avg}%` },
                  { label: "Most full", val: maxBin ? `${maxBin.qrCode} (${maxBin.latestFullness}%)` : "-" },
                  { label: "Need attention (>=80%)", val: bins.filter((b) => b.latestFullness >= 80).length },
                  { label: "Warning (60-79%)", val: bins.filter((b) => b.latestFullness >= 60 && b.latestFullness < 80).length },
                  { label: "Normal (<60%)", val: bins.filter((b) => b.latestFullness < 60).length },
                ].map((r) => (
                  <div className="mp-stat-row" key={r.label}>
                    <span className="mp-stat-label">{r.label}</span>
                    <span className="mp-stat-val">{r.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MapPage;
