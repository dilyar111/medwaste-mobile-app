import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Factory,
  FileCheck2,
  Flame,
  Info,
  MapPin,
  Phone,
  Recycle,
  Scale,
  ShieldCheck,
  User,
} from "lucide-react";
import api from "../services/api";

const css = `
  .ur-root,
  .ur-root * {
    box-sizing: border-box;
  }

  .ur-root {
    min-height: 100vh;
    overflow-x: hidden;
    padding: clamp(16px, 4vw, 32px);
    background:
      radial-gradient(circle at 12% 0%, rgba(20, 157, 128, 0.14), transparent 30rem),
      radial-gradient(circle at 90% 8%, rgba(79, 150, 206, 0.12), transparent 24rem),
      linear-gradient(180deg, #f7f8fb 0%, #f2f3f8 100%);
    color: #101318;
    font-family: Inter, "Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .ur-wrap {
    width: min(920px, 100%);
    margin: 0 auto;
  }

  .ur-page-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 18px;
    margin-bottom: 18px;
  }

  .ur-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    width: fit-content;
    margin-bottom: 9px;
    padding: 6px 10px;
    border: 1px solid rgba(20, 157, 128, 0.2);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    color: #0f8f75;
    font-size: 0.74rem;
    font-weight: 850;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    box-shadow: 0 8px 24px rgba(24, 33, 49, 0.05);
  }

  .ur-page-header h1 {
    margin: 0;
    color: #101318;
    font-size: clamp(1.45rem, 4.8vw, 1.9rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.08;
  }

  .ur-page-header p {
    max-width: 560px;
    margin: 8px 0 0;
    color: #6f7684;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .ur-progress-card {
    display: grid;
    gap: 3px;
    min-width: 178px;
    padding: 12px 14px;
    border: 1px solid #e7e9f1;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.86);
    box-shadow: 0 12px 30px rgba(24, 33, 49, 0.07);
  }

  .ur-progress-card span {
    color: #7b8493;
    font-size: 0.73rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .ur-progress-card strong {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #0f8f75;
    font-size: 0.9rem;
  }

  .ur-card,
  .ur-submit-card,
  .ur-state-card,
  .ur-pending-banner {
    border: 1px solid #e5e8ef;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 12px 28px rgba(24, 33, 49, 0.07);
  }

  .ur-card {
    overflow: hidden;
    margin-bottom: 14px;
  }

  .ur-section-head {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 16px 18px;
    border-bottom: 1px solid #eef0f5;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
  }

  .ur-section-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 14px;
    background: #eef8f6;
    color: #149d80;
    flex: 0 0 auto;
  }

  .ur-section-icon svg,
  .ur-kicker svg,
  .ur-progress-card svg,
  .ur-note svg,
  .ur-submit-btn svg,
  .ur-status-btn svg,
  .ur-field-hint svg,
  .ur-choice-icon svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  .ur-section-title {
    display: block;
    color: #101318;
    font-size: 0.98rem;
    font-weight: 900;
    letter-spacing: -0.015em;
  }

  .ur-section-copy {
    display: block;
    margin-top: 2px;
    color: #7b8493;
    font-size: 0.78rem;
    font-weight: 650;
  }

  .ur-section-body {
    padding: 18px;
  }

  .ur-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .ur-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .ur-col-2 {
    grid-column: span 2;
  }

  .ur-field {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 7px;
  }

  .ur-field label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #4b5563;
    font-size: 0.77rem;
    font-weight: 850;
  }

  .ur-field label svg {
    width: 15px;
    height: 15px;
    color: #149d80;
  }

  .ur-field label span {
    color: #e6535d;
    margin-left: -2px;
  }

  .ur-field input,
  .ur-field select {
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border: 1px solid #dfe4ec;
    border-radius: 14px;
    outline: none;
    background: #f9fafc;
    color: #101318;
    font: inherit;
    font-size: 0.88rem;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  }

  .ur-field select {
    cursor: pointer;
  }

  .ur-field input::placeholder {
    color: #a0a7b2;
  }

  .ur-field input:hover,
  .ur-field select:hover {
    border-color: #ccd5df;
  }

  .ur-field input:focus,
  .ur-field select:focus {
    border-color: #149d80;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(20, 157, 128, 0.12);
  }

  .ur-field input.ur-error-input {
    border-color: #e6535d;
    background: #fff7f7;
  }

  .ur-field-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8b93a1;
    font-size: 0.75rem;
    line-height: 1.35;
  }

  .ur-field-hint.error {
    color: #b42335;
    font-weight: 750;
  }

  .ur-waste-types {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    padding-top: 2px;
  }

  .ur-waste-type-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: 100%;
    min-height: 38px;
    padding: 8px 12px;
    border: 1px solid #dfe4ec;
    border-radius: 999px;
    background: #ffffff;
    color: #596272;
    cursor: pointer;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 800;
    transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
  }

  .ur-waste-type-btn:hover {
    transform: translateY(-1px);
    border-color: rgba(20, 157, 128, 0.32);
    background: #f4fbf9;
  }

  .ur-waste-type-btn.selected {
    border-color: #149d80;
    background: #149d80;
    color: #ffffff;
    box-shadow: 0 10px 22px rgba(20, 157, 128, 0.2);
  }

  .ur-choice-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ur-submit-card {
    display: grid;
    gap: 13px;
    padding: 18px;
  }

  .ur-submit-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .ur-submit-btn,
  .ur-status-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    max-width: 100%;
    padding: 11px 16px;
    border: 0;
    border-radius: 15px;
    background: #149d80;
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 900;
    box-shadow: 0 14px 28px rgba(20, 157, 128, 0.22);
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, opacity 0.18s ease;
  }

  .ur-submit-btn:hover:not(:disabled),
  .ur-status-btn:hover {
    transform: translateY(-1px);
    background: #0f8f75;
    box-shadow: 0 16px 32px rgba(20, 157, 128, 0.26);
  }

  .ur-submit-btn:disabled {
    cursor: not-allowed;
    opacity: 0.58;
    transform: none;
    box-shadow: none;
  }

  .ur-warning {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #b8660d;
    font-size: 0.8rem;
    font-weight: 800;
  }

  .ur-warning svg {
    width: 16px;
    height: 16px;
  }

  .ur-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 13px;
    border: 1px solid rgba(79, 150, 206, 0.18);
    border-radius: 16px;
    background: #f0f7fc;
    color: #355b73;
    font-size: 0.81rem;
    line-height: 1.55;
  }

  .ur-note svg {
    margin-top: 2px;
    color: #4f96ce;
  }

  .ur-state-card {
    overflow: hidden;
  }

  .ur-success {
    display: grid;
    justify-items: center;
    padding: clamp(34px, 8vw, 58px) 20px;
    text-align: center;
  }

  .ur-success-icon,
  .ur-pending-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
    margin-bottom: 16px;
    border-radius: 22px;
    background: #eef8f6;
    color: #149d80;
  }

  .ur-pending-icon {
    background: #fff7e8;
    color: #b8660d;
  }

  .ur-success-icon svg,
  .ur-pending-icon svg {
    width: 30px;
    height: 30px;
  }

  .ur-success h2 {
    margin: 0 0 8px;
    color: #101318;
    font-size: 1.32rem;
    font-weight: 900;
    letter-spacing: -0.025em;
  }

  .ur-success p {
    max-width: 430px;
    margin: 0;
    color: #687182;
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .ur-success .ur-status-btn {
    margin-top: 20px;
  }

  .ur-pending-banner {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
  }

  .ur-pending-banner h3 {
    margin: 0 0 5px;
    color: #9a5a0c;
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: -0.015em;
  }

  .ur-pending-banner p {
    margin: 0;
    color: #725017;
    font-size: 0.88rem;
    line-height: 1.55;
  }

  @media (max-width: 720px) {
    .ur-root {
      padding: 16px;
    }

    .ur-page-header {
      grid-template-columns: 1fr;
      align-items: stretch;
      gap: 12px;
    }

    .ur-progress-card {
      min-width: 0;
      width: 100%;
    }

    .ur-grid-2,
    .ur-grid-3 {
      grid-template-columns: 1fr;
    }

    .ur-col-2 {
      grid-column: span 1;
    }

    .ur-section-head,
    .ur-section-body,
    .ur-submit-card {
      padding: 15px;
    }

    .ur-submit-row {
      align-items: stretch;
    }

    .ur-submit-btn {
      width: 100%;
    }

    .ur-pending-banner {
      display: grid;
      justify-items: start;
    }
  }

  @media (max-width: 420px) {
    .ur-root {
      padding: 14px;
    }

    .ur-card,
    .ur-submit-card,
    .ur-state-card,
    .ur-pending-banner {
      border-radius: 20px;
    }

    .ur-section-title {
      font-size: 0.94rem;
    }

    .ur-waste-type-btn {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;

const WASTE_TYPES = [
  { id: "A", label: "Type A - Sharps" },
  { id: "B", label: "Type B - Infectious" },
  { id: "C", label: "Type C - Pharmaceutical" },
  { id: "D", label: "Type D - Chemical" },
];

const METHODS = [
  { value: "incineration", label: "Incineration" },
  { value: "autoclave", label: "Autoclave" },
  { value: "chemical", label: "Chemical treatment" },
  { value: "landfill", label: "Landfill" },
];

export default function UtilizerRegistration() {
  const navigate = useNavigate();
  const [existing, setExisting] = useState(null); // existing application
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateError, setDateError] = useState("");
  const [form, setForm] = useState({
    stationName: "",
    stationAddress: "",
    stationLat: "",
    stationLon: "",
    licenseNumber: "",
    licenseExpiry: "",
    capacity: "",
    method: "incineration",
    contactName: "",
    contactPhone: "",
  });
  const [wasteTypes, setWasteTypes] = useState([]);

  // Check if already applied
  useEffect(() => {
    api.get("/api/utilizers/my-status")
      .then((res) => {
        if (res.data) setExisting(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (field) => (e) => {
    if (field === "licenseExpiry") {
      const expired = new Date(e.target.value) < new Date();
      setDateError(expired ? "License has already expired!" : "");
    }
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const toggleWasteType = (id) => {
    setWasteTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dateError) return;
    try {
      await api.post("/api/utilizers/register", { ...form, wasteTypes });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  if (loading) return null;

  // Already approved
  if (existing?.status === "approved") {
    return (
      <>
        <style>{css}</style>
        <div className="ur-root">
          <div className="ur-wrap">
            <div className="ur-state-card">
              <div className="ur-success">
                <span className="ur-success-icon">
                  <BadgeCheck />
                </span>
                <h2>Station Active</h2>
                <p>
                  Your station <strong>{existing.stationName}</strong> is approved and active in the system.
                </p>
                <button onClick={() => navigate("/dashboard/utilizer/inbound")} className="ur-status-btn">
                  Go to Station Dashboard
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Pending approval
  if (existing?.status === "pending" && !submitted) {
    return (
      <>
        <style>{css}</style>
        <div className="ur-root">
          <div className="ur-wrap">
            <div className="ur-pending-banner">
              <span className="ur-pending-icon">
                <Clock3 />
              </span>
              <div>
                <h3>Application Under Review</h3>
                <p>
                  Your station <strong>{existing.stationName}</strong> is being reviewed by an administrator. You'll receive a notification once it's approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Success after submit
  if (submitted) {
    return (
      <>
        <style>{css}</style>
        <div className="ur-root">
          <div className="ur-wrap">
            <div className="ur-state-card">
              <div className="ur-success">
                <span className="ur-success-icon">
                  <ClipboardCheck />
                </span>
                <h2>Application Submitted!</h2>
                <p>Your station registration is under review. An administrator will verify your license and station details within 24 hours.</p>
                <button onClick={() => navigate("/dashboard")} className="ur-status-btn">
                  Back to Dashboard
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="ur-root">
        <div className="ur-wrap">
          <div className="ur-page-header">
            <div>
              <span className="ur-kicker">
                <Recycle />
                Utilizer onboarding
              </span>
              <h1>Utilizer Registration</h1>
              <p>Register your station for medical waste processing and administrator approval.</p>
            </div>
            <div className="ur-progress-card">
              <span>Application status</span>
              <strong>
                <FileCheck2 />
                New submission
              </strong>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* STATION INFO */}
            <div className="ur-card">
              <div className="ur-section-head">
                <div className="ur-section-icon">
                  <Factory />
                </div>
                <div>
                  <span className="ur-section-title">Station Information</span>
                  <span className="ur-section-copy">Basic facility details and optional map coordinates</span>
                </div>
              </div>
              <div className="ur-section-body">
                <div className="ur-grid-2">
                  <div className="ur-field ur-col-2">
                    <label>
                      <Building2 />
                      Station Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Medical Waste Processing Center"
                      value={form.stationName}
                      onChange={set("stationName")}
                    />
                  </div>
                  <div className="ur-field ur-col-2">
                    <label>
                      <MapPin />
                      Address <span>*</span>
                    </label>
                    <input type="text" required placeholder="Full address" value={form.stationAddress} onChange={set("stationAddress")} />
                  </div>
                  <div className="ur-field">
                    <label>
                      <MapPin />
                      Latitude
                    </label>
                    <input type="number" placeholder="e.g. 51.1694" step="any" value={form.stationLat} onChange={set("stationLat")} />
                    <span className="ur-field-hint">
                      <Info />
                      For map display (optional)
                    </span>
                  </div>
                  <div className="ur-field">
                    <label>
                      <MapPin />
                      Longitude
                    </label>
                    <input type="number" placeholder="e.g. 71.4491" step="any" value={form.stationLon} onChange={set("stationLon")} />
                  </div>
                </div>
              </div>
            </div>

            {/* LICENSE */}
            <div className="ur-card">
              <div className="ur-section-head">
                <div className="ur-section-icon">
                  <ShieldCheck />
                </div>
                <div>
                  <span className="ur-section-title">License & Capabilities</span>
                  <span className="ur-section-copy">Processing capacity, method, and accepted medical waste types</span>
                </div>
              </div>
              <div className="ur-section-body">
                <div className="ur-grid-2">
                  <div className="ur-field">
                    <label>
                      <FileCheck2 />
                      License Number <span>*</span>
                    </label>
                    <input type="text" required placeholder="e.g. UTL-2024-001" value={form.licenseNumber} onChange={set("licenseNumber")} />
                  </div>
                  <div className="ur-field">
                    <label>
                      <CalendarDays />
                      License Expiry <span>*</span>
                    </label>
                    <input
                      type="date"
                      required
                      className={dateError ? "ur-error-input" : ""}
                      value={form.licenseExpiry}
                      onChange={set("licenseExpiry")}
                    />
                    {dateError && (
                      <span className="ur-field-hint error">
                        <AlertTriangle />
                        {dateError}
                      </span>
                    )}
                  </div>
                  <div className="ur-field">
                    <label>
                      <Scale />
                      Daily Capacity (kg)
                    </label>
                    <input type="number" placeholder="e.g. 500" value={form.capacity} onChange={set("capacity")} />
                  </div>
                  <div className="ur-field">
                    <label>
                      <Activity />
                      Processing Method <span>*</span>
                    </label>
                    <select value={form.method} onChange={set("method")}>
                      {METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ur-field ur-col-2">
                    <label>
                      <Recycle />
                      Accepted Waste Types <span>*</span>
                    </label>
                    <div className="ur-waste-types">
                      {WASTE_TYPES.map((t) => (
                        <button
                          type="button"
                          key={t.id}
                          className={`ur-waste-type-btn ${wasteTypes.includes(t.id) ? "selected" : ""}`}
                          onClick={() => toggleWasteType(t.id)}
                        >
                          <span className="ur-choice-icon">
                            {wasteTypes.includes(t.id) ? <CheckCircle2 /> : <Recycle />}
                          </span>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="ur-card">
              <div className="ur-section-head">
                <div className="ur-section-icon">
                  <Phone />
                </div>
                <div>
                  <span className="ur-section-title">Emergency Contact</span>
                  <span className="ur-section-copy">Operational contact for urgent coordination</span>
                </div>
              </div>
              <div className="ur-section-body">
                <div className="ur-grid-2">
                  <div className="ur-field">
                    <label>
                      <User />
                      Contact Name
                    </label>
                    <input type="text" placeholder="e.g. John Smith" value={form.contactName} onChange={set("contactName")} />
                  </div>
                  <div className="ur-field">
                    <label>
                      <Phone />
                      Phone Number
                    </label>
                    <input type="tel" placeholder="+7 705 123 4567" value={form.contactPhone} onChange={set("contactPhone")} />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="ur-submit-card">
              <div className="ur-submit-row">
                <button type="submit" className="ur-submit-btn" disabled={!!dateError || wasteTypes.length === 0}>
                  <Recycle />
                  Submit Station Application
                  <ArrowRight />
                </button>
                {wasteTypes.length === 0 && (
                  <span className="ur-warning">
                    <AlertTriangle />
                    Please select at least one accepted waste type
                  </span>
                )}
              </div>
              <div className="ur-note">
                <Info />
                <span>
                  After submission, an administrator will verify your license and station details. You'll receive a notification once approved. Your role
                  will automatically change to <strong>utilizer</strong>.
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
