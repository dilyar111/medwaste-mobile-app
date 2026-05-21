import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Info,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import api from "../services/api";

const css = `
  .dr-root,
  .dr-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .dr-root {
    min-height: 100vh;
    overflow-x: hidden;
    padding: clamp(16px, 4vw, 32px);
    background:
      radial-gradient(circle at 12% 0%, rgba(20, 157, 128, .14), transparent 30rem),
      radial-gradient(circle at 90% 8%, rgba(79, 150, 206, .12), transparent 24rem),
      linear-gradient(180deg, #f7f8fb 0%, #f2f3f8 100%);
    color: #101318;
    font-family: Inter, "Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .dr-wrap {
    width: min(920px, 100%);
    margin: 0 auto;
  }

  .dr-page-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 18px;
    margin-bottom: 18px;
  }

  .dr-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    width: fit-content;
    margin-bottom: 9px;
    padding: 6px 10px;
    border: 1px solid rgba(20, 157, 128, .2);
    border-radius: 999px;
    background: rgba(255,255,255,.78);
    color: #0f8f75;
    box-shadow: 0 8px 24px rgba(24, 33, 49, .05);
    font-size: .74rem;
    font-weight: 850;
    letter-spacing: .03em;
    text-transform: uppercase;
  }

  .dr-page-header h1 {
    margin: 0;
    color: #101318;
    font-size: clamp(1.45rem, 4.8vw, 1.9rem);
    font-weight: 900;
    letter-spacing: -.04em;
    line-height: 1.08;
  }

  .dr-page-header p {
    max-width: 560px;
    margin: 8px 0 0;
    color: #6f7684;
    font-size: .92rem;
    line-height: 1.55;
  }

  .dr-status-card {
    display: grid;
    gap: 3px;
    min-width: 178px;
    padding: 12px 14px;
    border: 1px solid #e7e9f1;
    border-radius: 18px;
    background: rgba(255,255,255,.86);
    box-shadow: 0 12px 30px rgba(24, 33, 49, .07);
  }

  .dr-status-card span {
    color: #7b8493;
    font-size: .73rem;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .dr-status-card strong {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #0f8f75;
    font-size: .9rem;
  }

  .dr-card,
  .dr-submit-card {
    overflow: hidden;
    margin-bottom: 14px;
    border: 1px solid #e5e8ef;
    border-radius: 24px;
    background: rgba(255,255,255,.92);
    box-shadow: 0 12px 28px rgba(24, 33, 49, .07);
  }

  .dr-section-head {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 16px 18px;
    border-bottom: 1px solid #eef0f5;
    background: linear-gradient(180deg, #fff 0%, #fbfcfd 100%);
  }

  .dr-section-icon {
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

  .dr-section-title {
    display: block;
    color: #101318;
    font-size: .98rem;
    font-weight: 900;
    letter-spacing: -.015em;
  }

  .dr-section-copy {
    display: block;
    margin-top: 2px;
    color: #7b8493;
    font-size: .78rem;
    font-weight: 650;
  }

  .dr-section-body {
    padding: 18px;
  }

  .dr-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .dr-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .dr-col-2 {
    grid-column: span 2;
  }

  .dr-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .dr-field label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #4b5563;
    font-size: .77rem;
    font-weight: 850;
  }

  .dr-field label span {
    color: #e6535d;
    margin-left: -2px;
  }

  .dr-field input,
  .dr-field select {
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border: 1px solid #dfe4ec;
    border-radius: 14px;
    outline: none;
    background: #f9fafc;
    color: #101318;
    font: inherit;
    font-size: .88rem;
    transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .dr-field input::placeholder {
    color: #a0a7b2;
  }

  .dr-field input:hover,
  .dr-field select:hover {
    border-color: #ccd5df;
  }

  .dr-field input:focus,
  .dr-field select:focus {
    border-color: #149d80;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20, 157, 128, .12);
  }

  .dr-field input.dr-error-input {
    border-color: #e6535d;
    background: #fff7f7;
  }

  .dr-field-error {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #b42335;
    font-size: .75rem;
    font-weight: 750;
  }

  .dr-submit-card {
    display: grid;
    gap: 13px;
    padding: 18px;
  }

  .dr-submit-btn,
  .dr-return-btn {
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
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-size: .9rem;
    font-weight: 900;
    box-shadow: 0 14px 28px rgba(20, 157, 128, .22);
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease, opacity .18s ease;
  }

  .dr-submit-btn:hover:not(:disabled),
  .dr-return-btn:hover {
    transform: translateY(-1px);
    background: #0f8f75;
    box-shadow: 0 16px 32px rgba(20, 157, 128, .26);
  }

  .dr-submit-btn:disabled {
    cursor: not-allowed;
    opacity: .58;
    transform: none;
    box-shadow: none;
  }

  .dr-submit-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 13px;
    border: 1px solid rgba(79, 150, 206, .18);
    border-radius: 16px;
    background: #f0f7fc;
    color: #355b73;
    font-size: .81rem;
    line-height: 1.55;
  }

  .dr-submit-note svg {
    margin-top: 2px;
    color: #4f96ce;
  }

  .dr-success {
    display: grid;
    justify-items: center;
    padding: clamp(34px, 8vw, 58px) 20px;
    text-align: center;
  }

  .dr-success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
    margin-bottom: 16px;
    border-radius: 22px;
    background: #fff7e8;
    color: #b8660d;
  }

  .dr-success h2 {
    margin: 0 0 8px;
    color: #101318;
    font-size: 1.32rem;
    font-weight: 900;
    letter-spacing: -.025em;
  }

  .dr-success p {
    max-width: 430px;
    margin: 0;
    color: #687182;
    font-size: .92rem;
    line-height: 1.6;
  }

  .dr-pending-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: 6px;
    padding: 3px 8px;
    border-radius: 999px;
    background: #fff8e8;
    color: #9a5a0c;
    font-size: .78rem;
    font-weight: 900;
    vertical-align: middle;
  }

  .dr-return-btn {
    margin-top: 22px;
  }

  .dr-kicker svg,
  .dr-status-card svg,
  .dr-section-icon svg,
  .dr-field label svg,
  .dr-field-error svg,
  .dr-submit-btn svg,
  .dr-return-btn svg,
  .dr-submit-note svg,
  .dr-pending-pill svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  .dr-success-icon svg {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 720px) {
    .dr-root {
      padding: 16px;
    }

    .dr-page-header {
      grid-template-columns: 1fr;
      align-items: stretch;
      gap: 12px;
    }

    .dr-status-card {
      min-width: 0;
      width: 100%;
    }

    .dr-grid-2,
    .dr-grid-3 {
      grid-template-columns: 1fr;
    }

    .dr-col-2 {
      grid-column: span 1;
    }

    .dr-section-head,
    .dr-section-body,
    .dr-submit-card {
      padding: 15px;
    }

    .dr-submit-btn {
      width: 100%;
    }
  }
`;

function DriverRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    licenseNumber: "",
    licenseExpiry: "",
    company: "",
    plateNumber: "",
    vehicleModel: "",
    vehicleYear: "",
    capacity: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [dateError, setDateError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "licenseExpiry") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError("License has already expired or date is invalid!");
      } else {
        setDateError("");
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = sessionStorage.getItem("mw_user");

    try {
      const response = await api.post("/api/drivers/register", {
        ...form,
        email: userEmail,
      });

      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="dr-root">
        <div className="dr-wrap">
          <div className="dr-page-header">
            <div>
              <span className="dr-kicker">
                <Truck />
                Driver onboarding
              </span>
              <h1>Driver Registration</h1>
              <p>Register as a driver for medical waste collection and administrator approval.</p>
            </div>
            <div className="dr-status-card">
              <span>Application status</span>
              <strong>
                <FileCheck2 />
                New submission
              </strong>
            </div>
          </div>

          {submitted ? (
            <div className="dr-card">
              <div className="dr-success">
                <span className="dr-success-icon">
                  <ClipboardCheck />
                </span>
                <h2>Application under consideration</h2>
                <p>
                  Your data has been successfully submitted. Account status:
                  <span className="dr-pending-pill">
                    <BadgeCheck />
                    PENDING
                  </span>
                </p>
                <p style={{ marginTop: 16 }}>The administrator verifies your license and vehicle information. This usually takes up to 24 hours.</p>
                <button className="dr-return-btn" onClick={() => navigate("/dashboard")} type="button">
                  Return to the control panel
                  <ArrowRight />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="dr-card">
                <div className="dr-section-head">
                  <div className="dr-section-icon">
                    <ShieldCheck />
                  </div>
                  <div>
                    <span className="dr-section-title">Driver's License Information</span>
                    <span className="dr-section-copy">Required credentials for safe medical waste collection</span>
                  </div>
                </div>
                <div className="dr-section-body">
                  <div className="dr-grid-2">
                    <div className="dr-field">
                      <label>
                        <FileCheck2 />
                        License Number <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        required
                        placeholder="e.g. DL-1234567"
                        value={form.licenseNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="dr-field">
                      <label>
                        <CalendarDays />
                        License Expiry Date <span>*</span>
                      </label>
                      <input
                        type="date"
                        name="licenseExpiry"
                        required
                        className={dateError ? "dr-error-input" : ""}
                        value={form.licenseExpiry}
                        onChange={handleChange}
                      />
                      {dateError && (
                        <span className="dr-field-error">
                          <AlertTriangle />
                          {dateError}
                        </span>
                      )}
                    </div>
                    <div className="dr-field dr-col-2">
                      <label>
                        <Building2 />
                        Medical Company <span>*</span>
                      </label>
                      <select name="company" required value={form.company} onChange={handleChange}>
                        <option value="">Select a company</option>
                        <option value="cgb">City General Hospital (License: 1234)</option>
                        <option value="university">University Hospital (License: 12341234)</option>
                        <option value="lab">Medical Laboratory (License: 5678)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dr-card">
                <div className="dr-section-head">
                  <div className="dr-section-icon">
                    <Car />
                  </div>
                  <div>
                    <span className="dr-section-title">Vehicle Information</span>
                    <span className="dr-section-copy">Collection vehicle details and operational capacity</span>
                  </div>
                </div>
                <div className="dr-section-body">
                  <div className="dr-grid-2">
                    <div className="dr-field">
                      <label>
                        <BadgeCheck />
                        License Plate <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="plateNumber"
                        required
                        placeholder="e.g. ABC-1234"
                        value={form.plateNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="dr-field">
                      <label>
                        <Truck />
                        Vehicle Model
                      </label>
                      <input
                        type="text"
                        name="vehicleModel"
                        placeholder="e.g. Mercedes Sprinter"
                        value={form.vehicleModel}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="dr-field">
                      <label>
                        <CalendarDays />
                        Year of Manufacture
                      </label>
                      <input
                        type="number"
                        name="vehicleYear"
                        placeholder="e.g. 2020"
                        min="1990"
                        max="2026"
                        value={form.vehicleYear}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="dr-field">
                      <label>
                        <Gauge />
                        Load Capacity (kg)
                      </label>
                      <input type="number" name="capacity" placeholder="e.g. 1500" value={form.capacity} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="dr-card">
                <div className="dr-section-head">
                  <div className="dr-section-icon">
                    <Phone />
                  </div>
                  <div>
                    <span className="dr-section-title">Emergency Contact</span>
                    <span className="dr-section-copy">Operational contact for urgent route coordination</span>
                  </div>
                </div>
                <div className="dr-section-body">
                  <div className="dr-grid-3">
                    <div className="dr-field">
                      <label>
                        <User />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="emergencyName"
                        placeholder="e.g. John Smith"
                        value={form.emergencyName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="dr-field">
                      <label>
                        <Phone />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        placeholder="+1 234 567 8900"
                        value={form.emergencyPhone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="dr-field">
                      <label>
                        <CheckCircle2 />
                        Relationship
                      </label>
                      <input
                        type="text"
                        name="emergencyRelation"
                        placeholder="e.g. Spouse, Parent"
                        value={form.emergencyRelation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="dr-submit-card">
                <button type="submit" className="dr-submit-btn" disabled={!!dateError}>
                  Submit Application
                  <ArrowRight />
                </button>
                <div className="dr-submit-note">
                  <Info />
                  <span>After submitting, an administrator will review the provided information. You will receive an email notification about the status of your application.</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default DriverRegistration;
