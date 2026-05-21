import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  FileBarChart,
  FileText,
  Gauge,
  Loader2,
  Printer,
  RefreshCw,
  Scale,
  Settings2,
} from "lucide-react";
import { getReports } from "../services/api";

const emptyOverview = {
  totalContainers: 0,
  avgFullness: 0,
  needAttention: 0,
  totalWeight: 0,
};

const wasteTypeColors = ["#4f96ce", "#149d80", "#f4a62a", "#8b7bd8"];

const css = `
  .rp-root {
    --rp-bg: #f4f3f8;
    --rp-card: #ffffff;
    --rp-ink: #101318;
    --rp-muted: #7d8490;
    --rp-line: #e7e7ef;
    --rp-teal: #149d80;
    --rp-teal-dark: #0d8069;
    --rp-teal-soft: #e7f6f1;
    --rp-blue: #4f96ce;
    --rp-blue-dark: #286b9d;
    --rp-blue-soft: #e8f2fb;
    --rp-red: #e6535d;
    --rp-red-soft: #fff0f1;
    --rp-amber: #f4a62a;
    --rp-amber-soft: #fff8e8;
    --rp-purple: #8b7bd8;
    --rp-purple-soft: #f2efff;
    --rp-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--rp-bg);
    color: var(--rp-ink);
  }

  .rp-root,
  .rp-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .rp-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  .rp-header h1 {
    margin: 0 0 5px;
    color: var(--rp-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .rp-header p {
    margin: 0;
    max-width: 760px;
    color: var(--rp-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .rp-header-btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }

  .rp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #fff;
    color: var(--rp-ink);
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .rp-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .rp-btn:disabled {
    cursor: not-allowed;
    opacity: .6;
    transform: none;
  }

  .rp-btn-green,
  .rp-btn-blue {
    border-color: rgba(20,157,128,.2);
    background: var(--rp-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .rp-btn-green:hover,
  .rp-btn-blue:hover {
    background: var(--rp-teal-dark);
  }

  .rp-card,
  .rp-kpi-card {
    border: 1px solid rgba(231,231,239,.92);
    background: rgba(255,255,255,.96);
    box-shadow: var(--rp-shadow);
  }

  .rp-card {
    overflow: hidden;
    margin-bottom: 16px;
    padding: 18px;
    border-radius: 18px;
  }

  .rp-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: var(--rp-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .rp-params-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .rp-field label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: var(--rp-muted);
    font-size: .74rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .rp-field-input {
    position: relative;
  }

  .rp-field input,
  .rp-field select {
    width: 100%;
    min-height: 40px;
    padding: 0 36px 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    color: var(--rp-ink);
    outline: none;
    font: inherit;
    font-size: .84rem;
    font-weight: 800;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .rp-field select {
    cursor: pointer;
    appearance: none;
  }

  .rp-field input:focus,
  .rp-field select:focus {
    border-color: rgba(20,157,128,.72);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .rp-select-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    color: var(--rp-muted);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .rp-error {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 12px;
    padding: 10px 12px;
    border: 1px solid rgba(230,83,93,.24);
    border-radius: 12px;
    background: var(--rp-red-soft);
    color: var(--rp-red);
    font-size: .82rem;
    font-weight: 800;
  }

  .rp-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 16px;
  }

  .rp-kpi-card {
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

  .rp-kpi-card:hover {
    transform: translateY(-1px);
  }

  .rp-kpi-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .rp-kpi-card:nth-child(1)::before { background: var(--rp-blue); }
  .rp-kpi-card:nth-child(2)::before { background: var(--rp-teal); }
  .rp-kpi-card:nth-child(3)::before { background: var(--rp-amber); }
  .rp-kpi-card:nth-child(4)::before { background: var(--rp-purple); }

  .rp-kpi-label {
    margin-bottom: 7px;
    color: var(--rp-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .rp-kpi-val {
    margin-bottom: 5px;
    color: var(--rp-ink);
    font-size: clamp(1.25rem, 5vw, 1.65rem);
    font-weight: 900;
    line-height: 1;
  }

  .rp-kpi-sub {
    color: var(--rp-muted);
    font-size: .74rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .rp-kpi-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
    background: var(--rp-teal-soft);
    color: var(--rp-teal-dark);
  }

  .rp-chart-wrap {
    margin-top: 8px;
  }

  .rp-chart-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .rp-chart-dept {
    width: 120px;
    flex: 0 0 120px;
    color: var(--rp-muted);
    font-size: .8rem;
    font-weight: 800;
    line-height: 1.25;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .rp-chart-bars {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 5px;
  }

  .rp-chart-track {
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: #eceef4;
  }

  .rp-chart-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 999px;
    transition: width .6s ease;
  }

  .rp-chart-pct {
    width: 42px;
    flex: 0 0 42px;
    color: var(--rp-ink);
    font-size: .78rem;
    font-weight: 900;
    text-align: right;
  }

  .rp-chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    margin-top: 14px;
  }

  .rp-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--rp-muted);
    font-size: .75rem;
    font-weight: 800;
  }

  .rp-legend-dot {
    width: 9px;
    height: 9px;
    flex: 0 0 9px;
    border-radius: 50%;
  }

  .rp-chart-yaxis {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    padding-left: 130px;
    padding-right: 46px;
    color: #a1a8b3;
    font-size: .68rem;
    font-weight: 800;
  }

  .rp-donut-wrap {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .rp-donut {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 122px;
    height: 122px;
    flex: 0 0 122px;
    border-radius: 50%;
    background: conic-gradient(#4f96ce 0deg 360deg, #e4e9f0 360deg);
  }

  .rp-donut-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 82px;
    height: 82px;
    border: 1px solid rgba(231,231,239,.8);
    border-radius: 50%;
    background: #fff;
  }

  .rp-donut-pct {
    color: var(--rp-ink);
    font-size: 1.05rem;
    font-weight: 900;
    line-height: 1;
  }

  .rp-donut-sub {
    margin-top: 4px;
    color: var(--rp-muted);
    font-size: .62rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .rp-waste-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
  }

  .rp-waste-row {
    display: grid;
    grid-template-columns: 10px minmax(0, 1fr) 100px 42px;
    align-items: center;
    gap: 10px;
  }

  .rp-waste-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .rp-waste-name {
    color: var(--rp-ink);
    font-size: .84rem;
    font-weight: 800;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .rp-waste-bar-track {
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: #eceef4;
  }

  .rp-waste-bar-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 999px;
  }

  .rp-waste-pct {
    color: var(--rp-ink);
    font-size: .78rem;
    font-weight: 900;
    text-align: right;
  }

  .rp-table-wrap {
    width: 100%;
    overflow-x: auto;
  }

  .rp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: .84rem;
  }

  .rp-table th {
    padding: 12px 14px;
    background: #f8f8fb;
    color: var(--rp-muted);
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .rp-table td {
    padding: 13px 14px;
    border-top: 1px solid #f2f3f7;
    color: var(--rp-ink);
    vertical-align: middle;
  }

  .rp-table tbody tr:hover td {
    background: #fbfcfd;
  }

  .rp-fullness-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 900;
  }

  .rp-fullness-mini {
    width: 62px;
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: #eceef4;
  }

  .rp-fullness-mini-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--rp-blue), var(--rp-teal));
  }

  .rp-attention-badge {
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

  .rp-badge-warn {
    background: var(--rp-amber-soft);
    color: #8a5a0a;
  }

  .rp-badge-ok {
    background: var(--rp-teal-soft);
    color: var(--rp-teal-dark);
  }

  .rp-empty {
    padding: 24px;
    color: var(--rp-muted);
    font-size: .86rem;
    font-weight: 800;
    text-align: center;
  }

  @media(max-width: 980px) {
    .rp-root {
      padding: 16px;
    }

    .rp-kpi-grid,
    .rp-params-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
  }

  @media(max-width: 700px) {
    .rp-header {
      align-items: stretch;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .rp-header h1 {
      font-size: 1.45rem;
    }

    .rp-header p {
      font-size: .82rem;
    }

    .rp-header-btns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .rp-header-btns .rp-btn:last-child {
      grid-column: 1 / -1;
    }

    .rp-btn {
      width: 100%;
      min-height: 38px;
      padding: 0 10px;
      font-size: .78rem;
    }

    .rp-card {
      padding: 14px;
      border-radius: 16px;
    }

    .rp-params-grid,
    .rp-kpi-grid {
      grid-template-columns: 1fr;
    }

    .rp-chart-yaxis {
      display: none;
    }

    .rp-chart-row {
      align-items: stretch;
      flex-direction: column;
      gap: 6px;
      padding: 10px;
      border: 1px solid rgba(231,231,239,.72);
      border-radius: 14px;
      background: #f8f8fb;
    }

    .rp-chart-dept,
    .rp-chart-pct {
      width: auto;
      flex: none;
      text-align: left;
    }

    .rp-donut-wrap {
      align-items: stretch;
      flex-direction: column;
      gap: 18px;
    }

    .rp-donut {
      align-self: center;
    }

    .rp-waste-row {
      grid-template-columns: 10px minmax(0, 1fr) 42px;
    }

    .rp-waste-bar-track {
      grid-column: 2 / -1;
      width: 100%;
    }

    .rp-table,
    .rp-table tbody,
    .rp-table tr,
    .rp-table td {
      display: block;
      width: 100%;
    }

    .rp-table thead {
      display: none;
    }

    .rp-table tr {
      margin: 10px 0;
      overflow: hidden;
      border: 1px solid var(--rp-line);
      border-radius: 14px;
      background: #fff;
    }

    .rp-table td {
      padding: 10px 12px;
      border-top: 1px solid #f3f4f8;
    }

    .rp-table td:first-child {
      border-top: 0;
    }

    .rp-table td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 5px;
      color: #6b7280;
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .05em;
      text-transform: uppercase;
    }
  }
`;

function Reports() {
  const [reportType, setReportType]   = useState("overview");
  const [aggregation, setAggregation] = useState("month");
  const [period, setPeriod]           = useState("");
  const [overview, setOverview]       = useState(emptyOverview);
  const [departments, setDepartments] = useState([]);
  const [barData, setBarData]         = useState([]);
  const [wasteTypes, setWasteTypes]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  const params = useMemo(() => ({
    reportType,
    type: reportType,
    aggregation,
    period,
  }), [reportType, aggregation, period]);

  const normalizeOverview = (data) => {
    const kpis = data?.kpis || {};
    const source = data?.overview || {};

    return {
      totalContainers: Number(source.totalContainers ?? kpis.totalContainers ?? 0),
      avgFullness: Number(source.avgFullness ?? kpis.averageFullness ?? 0),
      needAttention: Number(source.needAttention ?? kpis.needsAttention ?? 0),
      totalWeight: Number(source.totalWeight ?? kpis.totalWeight ?? 0),
    };
  };

  const normalizeDepartments = (data) => (
    Array.isArray(data?.departments)
      ? data.departments.map((dept) => ({
          ...dept,
          bins: Number(dept.bins ?? 0),
          avgFullness: Number(dept.avgFullness ?? 0),
          totalWeight: Number(dept.totalWeight ?? 0),
          needsAttention: Number(dept.needsAttention ?? 0),
        }))
      : []
  );

  const normalizeWasteTypes = (data, totalContainers) => {
    const source = Array.isArray(data?.wasteTypes)
      ? data.wasteTypes
      : Array.isArray(data?.wasteTypeDistribution)
        ? data.wasteTypeDistribution
        : [];

    return source.map((item, index) => {
      const count = Number(item.count ?? 0);
      const pct = Number(item.pct ?? (totalContainers ? Math.round((count / totalContainers) * 100) : 0));

      return {
        ...item,
        name: item.name || `Type ${item.type || index + 1}`,
        count,
        pct,
        color: item.color || wasteTypeColors[index % wasteTypeColors.length],
      };
    });
  };

  const buildBarData = (data, nextDepartments, nextWasteTypes, nextOverview) => {
    if (Array.isArray(data?.barData) && data.barData.length) {
      return data.barData.map((item) => ({
        ...item,
        fullness: Number(item.fullness ?? 0),
        count: Number(item.count ?? 0),
        countPct: Number(item.countPct ?? 0),
        weight: Number(item.weight ?? 0),
      }));
    }

    if (nextWasteTypes.length) {
      return nextWasteTypes.map((item) => ({
        label: item.name,
        fullness: item.pct,
        count: Math.round((item.pct / 100) * Math.max(nextOverview.totalContainers, 1)),
        countPct: item.pct,
        weight: 0,
      }));
    }

    const maxContainers = Math.max(1, ...nextDepartments.map((dept) => dept.bins));
    const maxWeight = Math.max(1, ...nextDepartments.map((dept) => dept.totalWeight));

    return nextDepartments.map((dept) => ({
      label: dept.name,
      fullness: dept.avgFullness,
      count: dept.bins,
      countPct: Math.round((dept.bins / maxContainers) * 100),
      weight: Math.round((dept.totalWeight / maxWeight) * 100),
    }));
  };

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getReports(params);
      const data = res.data || {};
      const nextOverview = normalizeOverview(data);
      const nextDepartments = normalizeDepartments(data);
      const nextWasteTypes = normalizeWasteTypes(data, nextOverview.totalContainers);
      const nextBarData = buildBarData(data, nextDepartments, nextWasteTypes, nextOverview);

      setOverview(nextOverview);
      setDepartments(nextDepartments);
      setWasteTypes(nextWasteTypes);
      setBarData(nextBarData);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to load reports");
      setOverview(emptyOverview);
      setDepartments([]);
      setBarData([]);
      setWasteTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setError("");
    try {
      const csvRows = [];
      const headers = ["Department", "Containers", "Avg Fullness", "Weight", "Attention"];
      csvRows.push(headers.join(","));

      departments.forEach((dept) => {
        csvRows.push([
          dept.name,
          dept.bins,
          dept.avgFullness,
          dept.totalWeight,
          dept.needsAttention,
        ].join(","));
      });

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("hidden", "");
      link.setAttribute("href", url);
      link.setAttribute("download", `report_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to export report");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const donutBackground = useMemo(() => {
    if (!wasteTypes.length) return "conic-gradient(#e4e9f0 0deg 360deg)";

    let current = 0;
    const stops = wasteTypes.map((w) => {
      const start = current;
      current += (Number(w.pct) || 0) * 3.6;
      return `${w.color} ${start}deg ${current}deg`;
    });
    if (current < 360) stops.push(`#e4e9f0 ${current}deg 360deg`);
    return `conic-gradient(${stops.join(", ")})`;
  }, [wasteTypes]);

  const primaryWaste = wasteTypes[0] || { name: "No Data", pct: 0 };
  const kpis = [
    { label: "Total Containers", val: overview.totalContainers, sub: "Active in the system", icon: Boxes },
    { label: "Average Fullness", val: `${overview.avgFullness}%`, sub: "Average fill level", icon: Gauge },
    { label: "Need Attention", val: overview.needAttention, sub: "Containers requiring action", icon: AlertTriangle },
    { label: "Total Weight", val: `${overview.totalWeight.toFixed(1)} kg`, sub: "Total waste weight", icon: Scale },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="rp-root">
        <div className="rp-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Data analysis and statistics for the waste management system</p>
          </div>
          <div className="rp-header-btns">
            <button className="rp-btn" onClick={handlePrint} disabled={loading} type="button">
              <Printer size={15} strokeWidth={2.35} aria-hidden="true" />
              Print
            </button>
            <button className="rp-btn" onClick={handleExport} disabled={loading} type="button">
              <Download size={15} strokeWidth={2.35} aria-hidden="true" />
              Export
            </button>
            <button className="rp-btn rp-btn-blue" onClick={() => saveOfficialReport(overview, departments)} disabled={loading} type="button">
              <FileText size={15} strokeWidth={2.35} aria-hidden="true" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="rp-card">
          <div className="rp-card-title">
            <Settings2 size={18} strokeWidth={2.35} aria-hidden="true" />
            Report Parameters
          </div>
          <div className="rp-params-grid">
            <div className="rp-field">
              <label>
                <CalendarDays size={13} strokeWidth={2.35} aria-hidden="true" />
                Period
              </label>
              <input type="text" placeholder="e.g. Feb 2026" value={period} onChange={e => setPeriod(e.target.value)} />
            </div>
            <div className="rp-field">
              <label>
                <FileBarChart size={13} strokeWidth={2.35} aria-hidden="true" />
                Report type
              </label>
              <div className="rp-field-input">
                <select value={reportType} onChange={e => setReportType(e.target.value)}>
                  <option value="overview">General overview</option>
                  <option value="dept">By department</option>
                  <option value="type">By waste type</option>
                  <option value="alerts">Alerts</option>
                </select>
                <ChevronDown className="rp-select-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
              </div>
            </div>
            <div className="rp-field">
              <label>
                <BarChart3 size={13} strokeWidth={2.35} aria-hidden="true" />
                Time aggregation
              </label>
              <div className="rp-field-input">
                <select value={aggregation} onChange={e => setAggregation(e.target.value)}>
                  <option value="day">By day</option>
                  <option value="week">By week</option>
                  <option value="month">By month</option>
                </select>
                <ChevronDown className="rp-select-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
              </div>
            </div>
            <div className="rp-field" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button className="rp-btn rp-btn-blue" style={{ width: "100%", justifyContent: "center" }} onClick={loadReports} disabled={loading} type="button">
                {loading ? (
                  <>
                    <Loader2 size={15} strokeWidth={2.35} aria-hidden="true" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
                    Refresh Data
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="rp-error">
              <AlertTriangle size={15} strokeWidth={2.35} aria-hidden="true" />
              {error}
            </div>
          )}
        </div>

        <div className="rp-kpi-grid">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div className="rp-kpi-card" key={k.label}>
                <div>
                  <div className="rp-kpi-label">{k.label}</div>
                  <div className="rp-kpi-val">{k.val}</div>
                  <div className="rp-kpi-sub">{k.sub}</div>
                </div>
                <span className="rp-kpi-icon">
                  <Icon size={20} strokeWidth={2.35} aria-hidden="true" />
                </span>
              </div>
            );
          })}
        </div>

        <div className="rp-card">
          <div className="rp-card-title">
            <BarChart3 size={18} strokeWidth={2.35} aria-hidden="true" />
            Fullness by Department
          </div>
          <div className="rp-chart-yaxis">
            {[0, 20, 40, 60, 80, 100].map(v => <span key={v}>{v}</span>)}
          </div>
          <div className="rp-chart-wrap">
            {barData.length === 0 ? (
              <div className="rp-empty">
                {loading ? "Loading report data..." : "No department data available."}
              </div>
            ) : barData.map((d) => (
              <div className="rp-chart-row" key={d.label}>
                <div className="rp-chart-dept">{d.label}</div>
                <div className="rp-chart-bars">
                  <div className="rp-chart-track">
                    <div className="rp-chart-fill" style={{ width: `${d.fullness}%`, background: "linear-gradient(90deg,#4f96ce,#149d80)" }} />
                  </div>
                  <div className="rp-chart-track">
                    <div className="rp-chart-fill" style={{ width: `${d.countPct ?? 0}%`, background: "#8b7bd8" }} />
                  </div>
                  <div className="rp-chart-track">
                    <div className="rp-chart-fill" style={{ width: `${d.weight}%`, background: "#f4a62a" }} />
                  </div>
                </div>
                <div className="rp-chart-pct">{d.fullness}%</div>
              </div>
            ))}
          </div>
          <div className="rp-chart-legend">
            <div className="rp-legend-item"><div className="rp-legend-dot" style={{ background: "#4f96ce" }} /> Avg. fullness</div>
            <div className="rp-legend-item"><div className="rp-legend-dot" style={{ background: "#8b7bd8" }} /> Container count</div>
            <div className="rp-legend-item"><div className="rp-legend-dot" style={{ background: "#f4a62a" }} /> Total weight</div>
          </div>
        </div>

        <div className="rp-card">
          <div className="rp-card-title">
            <Gauge size={18} strokeWidth={2.35} aria-hidden="true" />
            Waste Type Distribution
          </div>
          <div className="rp-donut-wrap">
            <div className="rp-donut" style={{ background: donutBackground }}>
              <div className="rp-donut-inner">
                <div className="rp-donut-pct">{primaryWaste.pct}%</div>
                <div className="rp-donut-sub">{primaryWaste.name.split(" ")[0]}</div>
              </div>
            </div>
            <div className="rp-waste-list">
              {wasteTypes.length === 0 ? (
                <div className="rp-empty" style={{ padding: 0, textAlign: "left" }}>
                  {loading ? "Loading waste type data..." : "No waste type data available."}
                </div>
              ) : wasteTypes.map((w) => (
                <div className="rp-waste-row" key={w.name}>
                  <div className="rp-waste-dot" style={{ background: w.color }} />
                  <span className="rp-waste-name">{w.name} ({w.pct}%)</span>
                  <div className="rp-waste-bar-track">
                    <div className="rp-waste-bar-fill" style={{ width: `${w.pct}%`, background: w.color }} />
                  </div>
                  <span className="rp-waste-pct">{w.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rp-card">
          <div className="rp-card-title">
            <FileBarChart size={18} strokeWidth={2.35} aria-hidden="true" />
            Department Statistics
          </div>
          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Containers</th>
                  <th>Avg. Fullness</th>
                  <th>Total Weight (kg)</th>
                  <th>Need Attention</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="rp-empty">
                      {loading ? "Loading department statistics..." : "No department statistics available."}
                    </td>
                  </tr>
                ) : departments.map((dep) => (
                  <tr key={dep.name}>
                    <td data-label="Department" style={{ fontWeight: 900 }}>{dep.name}</td>
                    <td data-label="Containers">{dep.bins}</td>
                    <td data-label="Avg. Fullness">
                      <div className="rp-fullness-cell">
                        <div className="rp-fullness-mini">
                          <div className="rp-fullness-mini-fill" style={{ width: `${dep.avgFullness}%` }} />
                        </div>
                        {dep.avgFullness}%
                      </div>
                    </td>
                    <td data-label="Total Weight (kg)">{dep.totalWeight.toFixed(1)}</td>
                    <td data-label="Need Attention">
                      <span className={`rp-attention-badge ${dep.needsAttention > 0 ? "rp-badge-warn" : "rp-badge-ok"}`}>
                        {dep.needsAttention > 0 ? (
                          <>
                            <AlertTriangle size={13} strokeWidth={2.45} aria-hidden="true" />
                            {dep.needsAttention}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} strokeWidth={2.45} aria-hidden="true" />
                            All clear
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const saveOfficialReport = (overview, departments) => {
  const now = new Date();
  const fileName = `Report_Form_IV_${now.toISOString().split("T")[0]}.html`;
  const safeDepartments = Array.isArray(departments) ? departments : [];

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Form IV - ${now.getFullYear()}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.5; padding: 40px; color: #000; }
        .tbl { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .tbl th, .tbl td { border: 1px solid #000; padding: 8px; font-size: 13px; text-align: left; }
        .header { text-align: center; font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 20px; }
        .footer { margin-top: 50px; display: flex; justify-content: space-between; }
        @media print { .no-save { display: none; } }
      </style>
    </head>
    <body>
      <div style="text-align:right">No.IMG/MED/${now.getFullYear()}/${Math.floor(Math.random() * 10000)}</div>
      <div class="header">Form - IV <br> (See rule 13) <br> ANNUAL REPORT</div>

      <table class="tbl">
        <thead>
          <tr><th>SI No.</th><th>Particulars</th><th>Details</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td><b>Authorised Person</b></td><td>Dilara Galimkyzy</td></tr>
          <tr><td>2</td><td><b>Facility Name</b></td><td>MedVault KTM.0810</td></tr>
          <tr><td>3</td><td><b>Address & GPS</b></td><td>Astana, Kazakhstan (9.6814, 76.6439)</td></tr>
          <tr><td>4</td><td><b>Logistics & Collection Log</b></td>
            <td>
              <table class="tbl" style="margin:0; width: 100%;">
                <tr><th>Department</th><th>Driver</th><th>Vehicle</th><th>Fullness</th></tr>
                ${safeDepartments.map((dept) => `
                  <tr>
                    <td>${dept.name || ""}</td>
                    <td>${dept.driver || ""}</td>
                    <td>${dept.plate || ""}</td>
                    <td>${Number(dept.avgFullness || 0)}%</td>
                  </tr>
                `).join("")}
              </table>
            </td>
          </tr>
          <tr><td>5</td><td><b>Summary Statistics</b></td><td>Total Bins: ${overview.totalContainers} | Avg. Level: ${overview.avgFullness}% | Total Weight: ${overview.totalWeight.toFixed(1)} kg</td></tr>
        </tbody>
      </table>

      <div class="footer">
        <div>Date of issue: ${now.toLocaleDateString()}</div>
        <div style="text-align: center;">
          <br>__________________________<br>
          Authorized Signature
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default Reports;
