import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { List, Loader2, Map as MapIcon, MapPin, Truck } from "lucide-react";
import ManualAssignModal from "./ManualAssignModal";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const markerIcon = new L.Icon({
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const css = `
  .dv-card {
    margin-bottom: 20px;
    border: 1px solid rgba(231, 231, 239, 0.92);
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(24, 33, 49, 0.06);
    overflow: hidden;
  }

  .dv-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid #eef0f5;
  }

  .dv-head h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 900;
    color: #101318;
  }

  .dv-head p {
    margin: 4px 0 0;
    color: #7d8490;
    font-size: 0.8rem;
  }

  .dv-tabs {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid #e7e7ef;
    border-radius: 999px;
    background: #f8f8fb;
  }

  .dv-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 14px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #7d8490;
    cursor: pointer;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  }

  .dv-tab.active {
    background: #fff;
    color: #0d8069;
    box-shadow: 0 6px 16px rgba(24, 33, 49, 0.08);
  }

  .dv-body { padding: 0; }

  .dv-map-shell {
    height: min(520px, 62vh);
    min-height: 360px;
  }

  .dv-map-empty {
    display: grid;
    place-items: center;
    min-height: 360px;
    padding: 24px;
    color: #7d8490;
    text-align: center;
    font-size: 0.88rem;
  }

  .dv-table-wrap { overflow-x: auto; }

  .dv-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 720px;
  }

  .dv-table th,
  .dv-table td {
    padding: 14px 18px;
    text-align: left;
    border-bottom: 1px solid #eef0f5;
    font-size: 0.86rem;
  }

  .dv-table th {
    background: #f8faf9;
    color: #7d8490;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .dv-table tr:last-child td { border-bottom: 0; }

  .dv-table tbody tr {
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .dv-table tbody tr:hover,
  .dv-table tbody tr.selected { background: #f4fbf8; }

  .dv-qr { font-weight: 800; color: #101318; }

  .dv-fullness {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
  }

  .dv-bar {
    flex: 1;
    height: 6px;
    max-width: 80px;
    border-radius: 999px;
    background: #eceef4;
    overflow: hidden;
  }

  .dv-bar-fill { height: 100%; border-radius: 999px; }

  .dv-forecast { font-weight: 700; color: #286b9d; }

  .dv-assign-btn {
    min-height: 32px;
    padding: 0 10px;
    border: 1px solid rgba(20, 157, 128, 0.24);
    border-radius: 10px;
    background: #e7f6f1;
    color: #0d8069;
    cursor: pointer;
    font: inherit;
    font-size: 0.74rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .dv-assign-btn:hover { background: #d9f0e8; }

  .dv-popup-assign {
    margin-top: 10px;
    width: 100%;
    min-height: 34px;
    border: 1px solid rgba(20, 157, 128, 0.24);
    border-radius: 10px;
    background: #e7f6f1;
    color: #0d8069;
    cursor: pointer;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .dv-spin { animation: dv-spin 1s linear infinite; }

  @keyframes dv-spin { to { transform: rotate(360deg); } }

  @media (max-width: 700px) {
    .dv-head { align-items: stretch; flex-direction: column; }
    .dv-tabs { width: 100%; }
    .dv-tab { flex: 1; justify-content: center; }
  }
`;

function barColor(fullness) {
  const pct = Number(fullness) || 0;
  if (pct >= 80) return "#e05d63";
  if (pct >= 60) return "#f4a62a";
  return "#149d80";
}

function binKey(bin) {
  return bin.qrCode || bin._id;
}

function toMapBin(bin) {
  const lat = Number(bin.lat);
  const lon = Number(bin.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    qrCode: binKey(bin),
    locationName: bin.locationName || bin.location || "—",
    lat,
    lon,
    fullness: Number(bin.fullness ?? bin.latestFullness) || 0,
    wasteType: bin.wasteType,
    status: bin.status,
  };
}

function formatForecast(pred) {
  if (!pred) return "—";
  const hours = pred.predictedHoursToFull ?? pred.hours_until_full;
  if (hours == null || !Number.isFinite(Number(hours))) {
    return pred.note || "—";
  }
  const h = Number(hours);
  if (h <= 0) return "Overflowing";
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 48) return `${h.toFixed(1)} h`;
  return `${(h / 24).toFixed(1)} d`;
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lon], 15, { duration: 0.8 });
  }, [map, target]);
  return null;
}

export default function ContainerDualView({
  bins = [],
  predictions = {},
  loading = false,
  manualAssign = false,
}) {
  const [view, setView] = useState("map");
  const [selectedQr, setSelectedQr] = useState(null);
  const [assignContainer, setAssignContainer] = useState(null);
  const [assignNotice, setAssignNotice] = useState("");

  const mapBins = useMemo(
    () => bins.map(toMapBin).filter(Boolean),
    [bins],
  );

  const listRows = useMemo(() => {
    return [...bins].sort(
      (a, b) => (Number(b.fullness) || 0) - (Number(a.fullness) || 0),
    );
  }, [bins]);

  const selectedMapBin = mapBins.find((b) => b.qrCode === selectedQr) || mapBins[0] || null;
  const mapCenter = selectedMapBin || { lat: 43.24, lon: 76.91 };

  const openAssign = (bin, e) => {
    e?.stopPropagation?.();
    setAssignContainer(bin);
  };

  useEffect(() => {
    if (!assignNotice) return undefined;
    const t = setTimeout(() => setAssignNotice(""), 4000);
    return () => clearTimeout(t);
  }, [assignNotice]);

  const findBinByKey = (key) => bins.find((b) => binKey(b) === key);

  return (
    <>
      <style>{css}</style>
      <section className="dv-card" aria-label="Container dual view">
        <div className="dv-head">
          <div>
            <h2>Container Overview</h2>
            <p>Switch between map and table without reloading data</p>
          </div>
          <div className="dv-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={view === "map"}
              className={`dv-tab ${view === "map" ? "active" : ""}`}
              onClick={() => setView("map")}
            >
              <MapIcon size={15} />
              Map View
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              className={`dv-tab ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              <List size={15} />
              List View
            </button>
          </div>
        </div>

        <div className="dv-body">
          {loading && bins.length === 0 ? (
            <div className="dv-map-empty">
              <Loader2 size={28} className="dv-spin" />
              <p style={{ marginTop: 12 }}>Loading containers...</p>
            </div>
          ) : (
            <>
              <div style={{ display: view === "map" ? "block" : "none" }}>
                {mapBins.length === 0 ? (
                  <div className="dv-map-empty">
                    <MapPin size={28} />
                    <p style={{ marginTop: 12 }}>No containers with coordinates for the map</p>
                  </div>
                ) : (
                  <div className="dv-map-shell">
                    <MapContainer
                      center={[mapCenter.lat, mapCenter.lon]}
                      zoom={12}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {selectedMapBin && <FlyTo target={selectedMapBin} />}
                      {mapBins.map((bin) => (
                        <Marker
                          key={bin.qrCode}
                          position={[bin.lat, bin.lon]}
                          icon={markerIcon}
                          eventHandlers={{ click: () => setSelectedQr(bin.qrCode) }}
                        >
                          <Popup>
                            <strong>{bin.qrCode}</strong>
                            <br />
                            {bin.locationName}
                            <br />
                            Fullness: {bin.fullness}%
                            <br />
                            Forecast: {formatForecast(predictions[bin.qrCode])}
                            {manualAssign && (
                              <>
                                <br />
                                <button
                                  type="button"
                                  className="dv-popup-assign"
                                  onClick={(e) => openAssign(findBinByKey(bin.qrCode) || bin, e)}
                                >
                                  <Truck size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                                  Assign driver manually
                                </button>
                              </>
                            )}
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                )}
              </div>

              <div style={{ display: view === "list" ? "block" : "none" }}>
                {listRows.length === 0 ? (
                  <div className="dv-map-empty">
                    <List size={28} />
                    <p style={{ marginTop: 12 }}>No container data available</p>
                  </div>
                ) : (
                  <div className="dv-table-wrap">
                    <table className="dv-table">
                      <thead>
                        <tr>
                          <th>QR code</th>
                          <th>Address</th>
                          <th>Fullness %</th>
                          <th>Forecast to overflow</th>
                          {manualAssign && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {listRows.map((bin) => {
                          const key = binKey(bin);
                          const fullness = Number(bin.fullness) || 0;
                          const pred = predictions[key];
                          return (
                            <tr
                              key={key}
                              className={selectedQr === key ? "selected" : ""}
                              onClick={() => {
                                setSelectedQr(key);
                                setView("map");
                              }}
                            >
                              <td className="dv-qr">{key}</td>
                              <td>{bin.locationName || bin.location || "—"}</td>
                              <td>
                                <span className="dv-fullness">
                                  <span className="dv-bar">
                                    <span
                                      className="dv-bar-fill"
                                      style={{
                                        width: `${Math.min(fullness, 100)}%`,
                                        background: barColor(fullness),
                                      }}
                                    />
                                  </span>
                                  {fullness}%
                                </span>
                              </td>
                              <td className="dv-forecast">{formatForecast(pred)}</td>
                              {manualAssign && (
                                <td>
                                  <button
                                    type="button"
                                    className="dv-assign-btn"
                                    onClick={(e) => openAssign(bin, e)}
                                  >
                                    Assign driver
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {assignContainer && (
        <ManualAssignModal
          container={assignContainer}
          onClose={() => setAssignContainer(null)}
          onAssigned={() => setAssignNotice("Task assigned to driver")}
        />
      )}

      {assignNotice && (
        <div style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 10003,
          padding: "12px 18px",
          borderRadius: 14,
          background: "#101318",
          color: "#fff",
          fontSize: "0.85rem",
          fontWeight: 700,
        }}
        >
          {assignNotice}
        </div>
      )}
    </>
  );
}
