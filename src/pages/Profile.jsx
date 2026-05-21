import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  IdCard,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../services/api";

const css = `
  .pf-root {
    --pf-bg: #f4f3f8;
    --pf-card: #ffffff;
    --pf-ink: #101318;
    --pf-muted: #7d8490;
    --pf-line: #e7e7ef;
    --pf-teal: #149d80;
    --pf-teal-dark: #0d8069;
    --pf-teal-soft: #e7f6f1;
    --pf-blue: #4f96ce;
    --pf-blue-dark: #286b9d;
    --pf-blue-soft: #e8f2fb;
    --pf-red: #e6535d;
    --pf-red-soft: #fff0f1;
    --pf-amber: #f4a62a;
    --pf-amber-soft: #fff8e8;
    --pf-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--pf-bg);
    color: var(--pf-ink);
  }

  .pf-root,
  .pf-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .pf-wrap {
    width: min(100%, 780px);
    margin: 0 auto;
  }

  .pf-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .pf-page-header h1 {
    margin: 0 0 5px;
    color: var(--pf-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .pf-page-header p {
    margin: 0;
    color: var(--pf-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .pf-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border: 1px solid rgba(20,157,128,.18);
    border-radius: 16px;
    background: var(--pf-teal-soft);
    color: var(--pf-teal-dark);
    box-shadow: var(--pf-shadow);
  }

  .pf-card {
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 18px;
    background: rgba(255,255,255,.96);
    box-shadow: var(--pf-shadow);
  }

  .pf-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .pf-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 13px;
    background: var(--pf-teal-soft);
    color: var(--pf-teal-dark);
  }

  .pf-card-title {
    color: var(--pf-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .pf-card-sub {
    margin-top: 2px;
    color: var(--pf-muted);
    font-size: .78rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .pf-card-body {
    padding: 18px 20px;
  }

  .pf-avatar-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 1px solid #f1f2f6;
  }

  .pf-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 66px;
    flex: 0 0 66px;
    border-radius: 22px;
    background: linear-gradient(135deg, var(--pf-teal), var(--pf-blue));
    color: #fff;
    font-size: 1.45rem;
    font-weight: 900;
    box-shadow: 0 12px 24px rgba(20,157,128,.18);
  }

  .pf-avatar-info h2 {
    margin: 0 0 7px;
    color: var(--pf-ink);
    font-size: 1.02rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .pf-avatar-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .pf-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: .7rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .pf-badge-blue { background: var(--pf-blue-soft); color: var(--pf-blue-dark); }
  .pf-badge-orange { background: var(--pf-amber-soft); color: #8a5a0a; }
  .pf-badge-green { background: var(--pf-teal-soft); color: var(--pf-teal-dark); }
  .pf-badge-ghost { background: #f4f6f8; color: #5e6673; }

  .pf-stats-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .pf-stat-item {
    padding: 11px 10px;
    border: 1px solid rgba(231,231,239,.72);
    border-radius: 14px;
    background: #f8f8fb;
  }

  .pf-stat-label {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
    color: var(--pf-muted);
    font-size: .68rem;
    font-weight: 900;
    letter-spacing: .05em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .pf-stat-val {
    color: var(--pf-ink);
    font-size: .84rem;
    font-weight: 900;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .pf-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .pf-col-2 {
    grid-column: span 2;
  }

  .pf-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 4px;
  }

  .pf-field label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--pf-muted);
    font-size: .74rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .pf-input-wrap {
    position: relative;
  }

  .pf-field input,
  .pf-field select {
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    color: var(--pf-ink);
    outline: none;
    font: inherit;
    font-size: .84rem;
    font-weight: 800;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .pf-field select {
    padding-right: 36px;
    cursor: pointer;
    appearance: none;
  }

  .pf-field input:focus,
  .pf-field select:focus {
    border-color: rgba(20,157,128,.72);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .pf-field input::placeholder {
    color: #a1a8b3;
  }

  .pf-field input[readonly],
  .pf-readonly {
    background: #f1f3f7 !important;
    color: var(--pf-muted) !important;
    cursor: not-allowed !important;
  }

  .pf-select-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    color: var(--pf-muted);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .pf-field-hint {
    color: var(--pf-muted);
    font-size: .72rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .pf-profile-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .pf-profile-row {
    width: 100%;
  }

  .pf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }

  .pf-btn:hover {
    transform: translateY(-1px);
  }

  .pf-btn:disabled {
    cursor: not-allowed;
    opacity: .6;
    transform: none;
  }

  .pf-btn-primary,
  .pf-btn-green {
    border-color: rgba(20,157,128,.2);
    background: var(--pf-teal);
    color: #fff;
    box-shadow: 0 8px 18px rgba(20,157,128,.16);
  }

  .pf-btn-primary:hover,
  .pf-btn-green:hover {
    background: var(--pf-teal-dark);
  }

  .pf-btn-ghost {
    border-color: rgba(231,231,239,.92);
    background: #fff;
    color: var(--pf-ink);
  }

  .pf-btn-ghost:hover {
    background: #f8f8fb;
  }

  .pf-btn-red {
    border-color: rgba(230,83,93,.28);
    background: var(--pf-red-soft);
    color: var(--pf-red);
  }

  .pf-btn-red:hover {
    background: #ffe3e5;
  }

  .pf-btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .pf-pw-strength {
    margin-top: 6px;
  }

  .pf-pw-bars {
    display: flex;
    gap: 4px;
    margin-bottom: 5px;
  }

  .pf-pw-bar {
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: #e3e6ec;
    transition: background .3s;
  }

  .pf-pw-bar.fill-weak { background: var(--pf-red); }
  .pf-pw-bar.fill-medium { background: var(--pf-amber); }
  .pf-pw-bar.fill-strong { background: var(--pf-teal); }

  .pf-pw-label {
    color: var(--pf-muted);
    font-size: .7rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .pf-phone-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    margin-bottom: 16px;
    font-size: .82rem;
    font-weight: 900;
  }

  .pf-phone-unverified { background: var(--pf-amber-soft); color: #8a5a0a; border: 1px solid rgba(244,166,42,.3); }
  .pf-phone-verified { background: var(--pf-teal-soft); color: var(--pf-teal-dark); border: 1px solid rgba(20,157,128,.25); }

  .pf-phone-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: end;
  }

  .pf-phone-row .pf-field {
    margin-bottom: 0;
  }

  .pf-phone-action {
    margin-bottom: 22px;
  }

  .pf-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
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

  @media(max-width: 700px) {
    .pf-root {
      padding: 16px;
    }

    .pf-page-header {
      align-items: center;
      margin-bottom: 16px;
    }

    .pf-page-header h1 {
      font-size: 1.45rem;
    }

    .pf-page-header p {
      font-size: .82rem;
    }

    .pf-card {
      border-radius: 16px;
    }

    .pf-card-head,
    .pf-card-body {
      padding: 14px;
    }

    .pf-avatar-row {
      align-items: flex-start;
      flex-direction: column;
    }

    .pf-stats-row,
    .pf-grid-2 {
      grid-template-columns: 1fr;
    }

    .pf-col-2 {
      grid-column: span 1;
    }

    .pf-btn-row .pf-btn,
    .pf-phone-action {
      width: 100%;
    }

    .pf-phone-row {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .pf-phone-action {
      margin-bottom: 0;
    }

    .pf-toast {
      left: 12px;
      right: 12px;
      bottom: 94px;
      padding: 10px 12px;
      font-size: .8rem;
    }
  }
`;

function pwStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function Profile() {
  const email = sessionStorage.getItem("mw_user") || "user@example.com";
  const fallbackUsername = (sessionStorage.getItem("mw_name") || email.split("@")[0] || "user").trim();

  const [profile, setProfile] = useState({
    username: fallbackUsername,
    fullName: sessionStorage.getItem("mw_name") || "",
    email,
    department: "",
    role: sessionStorage.getItem("mw_role") || "user",
    phoneNumber: "",
  });
  const [security, setSecurity] = useState({ current: "", newPw: "", confirm: "" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const { data } = await getProfile();
        if (!mounted) return;

        const nextUsername = (data.username || fallbackUsername).trim();
        const nextFullName = (data.fullName || sessionStorage.getItem("mw_name") || "").trim();

        setProfile({
          username: nextUsername,
          fullName: nextFullName,
          email: data.email || email,
          department: data.department || "",
          role: data.role || sessionStorage.getItem("mw_role") || "user",
          phoneNumber: data.phoneNumber || "",
        });

        sessionStorage.setItem("mw_name", nextFullName || nextUsername);
        sessionStorage.setItem("mw_username", nextUsername);
      } catch (err) {
        if (mounted) {
          showToast(`x ${err.response?.data?.error || "Failed to load profile"}`);
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      const { data } = await updateProfile({
        fullName: profile.fullName,
        username: profile.username,
        department: profile.department,
      });

      const updatedUsername = (data.profile?.username || profile.username).trim();
      const updatedFullName = (data.profile?.fullName || profile.fullName).trim();
      setProfile((p) => ({
        ...p,
        username: updatedUsername,
        fullName: updatedFullName,
        department: data.profile?.department || "",
      }));
      sessionStorage.setItem("mw_name", updatedFullName || updatedUsername);
      sessionStorage.setItem("mw_username", updatedUsername);

      showToast("Profile updated successfully");
    } catch (err) {
      showToast(`x ${err.response?.data?.error || "Failed to update profile"}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (security.newPw !== security.confirm) { showToast("x Passwords do not match"); return; }
    if (security.newPw.length < 8) { showToast("x Password must be at least 8 characters"); return; }

    try {
      setSavingPassword(true);
      await changePassword(security.current, security.newPw, security.confirm);
      showToast("Password changed successfully");
      setSecurity({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      showToast(`x ${err.response?.data?.error || "Failed to change password"}`);
    } finally {
      setSavingPassword(false);
    }
  };

  const strength      = pwStrength(security.newPw);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "fill-weak", "fill-medium", "fill-medium", "fill-strong"][strength];

  return (
    <>
      <style>{css}</style>
      <div className="pf-root">
        <div className="pf-wrap">
          <div className="pf-page-header">
            <div>
              <h1>My Profile</h1>
              <p>Update your personal information</p>
            </div>
            <span className="pf-header-icon">
              <UserRound size={22} strokeWidth={2.35} aria-hidden="true" />
            </span>
          </div>

          <div className="pf-card">
            <div className="pf-card-body">
              <div className="pf-avatar-row">
                <div className="pf-avatar">{(profile.fullName || profile.username || fallbackUsername).charAt(0).toUpperCase()}</div>
                <div className="pf-avatar-info">
                  <h2>{profile.fullName || profile.username || fallbackUsername}</h2>
                  <div className="pf-avatar-badges">
                    <span className="pf-badge pf-badge-blue">
                      <ShieldCheck size={12} strokeWidth={2.35} aria-hidden="true" />
                      Role: {profile.role || "user"}
                    </span>
                    {profile.username && (
                      <span className="pf-badge pf-badge-ghost">
                        <User size={12} strokeWidth={2.35} aria-hidden="true" />
                        @{profile.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pf-stats-row">
                {[
                  { label: "Email", val: profile.email || email, icon: Mail },
                  { label: "Phone", val: profile.phoneNumber || "-", icon: Phone },
                  { label: "Department", val: profile.department || "-", icon: Building2 },
                  { label: "Status", val: "Active", icon: BadgeCheck },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="pf-stat-item" key={s.label}>
                      <div className="pf-stat-label">
                        <Icon size={12} strokeWidth={2.35} aria-hidden="true" />
                        {s.label}
                      </div>
                      <div className="pf-stat-val" style={{ fontSize: s.label === "Email" ? ".72rem" : undefined }}>{s.val}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pf-card">
            <div className="pf-card-head">
              <div className="pf-card-icon">
                <IdCard size={18} strokeWidth={2.35} aria-hidden="true" />
              </div>
              <div>
                <div className="pf-card-title">Profile Information</div>
                <div className="pf-card-sub">Update your personal details</div>
              </div>
            </div>
            <div className="pf-card-body">
              <form onSubmit={handleProfileSave}>
                <div className="pf-profile-stack">
                  <div className="pf-field pf-profile-row">
                    <label>
                      <UserRound size={13} strokeWidth={2.35} aria-hidden="true" />
                      Full Name
                    </label>
                    <input
                      type="text" placeholder="John Smith"
                      value={profile.fullName}
                      disabled={loadingProfile || savingProfile}
                      onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    />
                    <span className="pf-field-hint">Your display name (spaces allowed)</span>
                  </div>
                  <div className="pf-field pf-profile-row">
                    <label>
                      <User size={13} strokeWidth={2.35} aria-hidden="true" />
                      Username
                    </label>
                    <input
                      type="text" placeholder="your_username"
                      value={profile.username}
                      disabled={loadingProfile || savingProfile}
                      onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                    />
                    <span className="pf-field-hint">3-30 characters: letters, numbers, underscores, hyphens</span>
                  </div>
                  <div className="pf-field pf-profile-row">
                    <label>
                      <Mail size={13} strokeWidth={2.35} aria-hidden="true" />
                      Email
                    </label>
                    <input type="email" value={profile.email} readOnly className="pf-readonly" />
                  </div>
                  <div className="pf-field pf-profile-row">
                    <label>
                      <Phone size={13} strokeWidth={2.35} aria-hidden="true" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={profile.phoneNumber || ""}
                      disabled={loadingProfile || savingProfile}
                      onChange={e => setProfile(p => ({ ...p, phoneNumber: e.target.value }))}
                    />
                    <span className="pf-field-hint">Your phone number (any format)</span>
                  </div>
                  <div className="pf-field pf-profile-row">
                    <label>
                      <ShieldCheck size={13} strokeWidth={2.35} aria-hidden="true" />
                      Role
                    </label>
                    <input
                      type="text"
                      value={profile.role || "user"}
                      readOnly
                      className="pf-readonly"
                      style={{ textTransform: "capitalize" }}
                    />
                  </div>
                  <div className="pf-field pf-profile-row">
                    <label>
                      <Building2 size={13} strokeWidth={2.35} aria-hidden="true" />
                      Department
                    </label>
                    <div className="pf-input-wrap">
                      <select
                        value={profile.department}
                        disabled={loadingProfile || savingProfile}
                        onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
                      >
                        <option value="">Select department</option>
                        <option value="surgery">Surgery Department</option>
                        <option value="therapy">Therapy Department</option>
                        <option value="pediatrics">Pediatrics Department</option>
                        <option value="obstetrics">Obstetrics Department</option>
                        <option value="infectious">Infectious Disease Department</option>
                        <option value="lab">Laboratory</option>
                        <option value="icu">ICU / Intensive Care</option>
                      </select>
                      <ChevronDown className="pf-select-chevron" size={15} strokeWidth={2.35} aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="pf-btn-row">
                  <button type="submit" className="pf-btn pf-btn-primary" disabled={loadingProfile || savingProfile}>
                    {savingProfile ? (
                      <>
                        <Loader2 size={15} strokeWidth={2.35} aria-hidden="true" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} strokeWidth={2.35} aria-hidden="true" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="pf-card">
            <div className="pf-card-head">
              <div className="pf-card-icon">
                <Lock size={18} strokeWidth={2.35} aria-hidden="true" />
              </div>
              <div>
                <div className="pf-card-title">Security Settings</div>
                <div className="pf-card-sub">Update your password</div>
              </div>
            </div>
            <div className="pf-card-body">
              <form onSubmit={handlePasswordSave}>
                <div className="pf-grid-2">
                  <div className="pf-field pf-col-2">
                    <label>
                      <Lock size={13} strokeWidth={2.35} aria-hidden="true" />
                      Current Password
                    </label>
                    <input type="password" placeholder="Password"
                      value={security.current}
                      disabled={savingPassword}
                      onChange={e => setSecurity(s => ({ ...s, current: e.target.value }))} />
                  </div>
                  <div className="pf-field">
                    <label>
                      <KeyRound size={13} strokeWidth={2.35} aria-hidden="true" />
                      New Password
                    </label>
                    <input type="password" placeholder="New password"
                      value={security.newPw}
                      disabled={savingPassword}
                      onChange={e => setSecurity(s => ({ ...s, newPw: e.target.value }))} />
                    {security.newPw && (
                      <div className="pf-pw-strength">
                        <div className="pf-pw-bars">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`pf-pw-bar ${i <= strength ? strengthColor : ""}`} />
                          ))}
                        </div>
                        <span className="pf-pw-label">{strengthLabel} - min 8 characters including letters and numbers</span>
                      </div>
                    )}
                  </div>
                  <div className="pf-field">
                    <label>
                      <KeyRound size={13} strokeWidth={2.35} aria-hidden="true" />
                      Confirm New Password
                    </label>
                    <input type="password" placeholder="Confirm password"
                      value={security.confirm}
                      disabled={savingPassword}
                      onChange={e => setSecurity(s => ({ ...s, confirm: e.target.value }))}
                      style={security.confirm && security.confirm !== security.newPw
                        ? { borderColor: "#e6535d" } : {}} />
                    {security.confirm && security.confirm !== security.newPw && (
                      <span className="pf-field-hint" style={{ color: "#e6535d" }}>Passwords do not match</span>
                    )}
                  </div>
                </div>
                <div className="pf-btn-row">
                  <button type="submit" className="pf-btn pf-btn-primary" disabled={savingPassword}>
                    {savingPassword ? (
                      <>
                        <Loader2 size={15} strokeWidth={2.35} aria-hidden="true" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} strokeWidth={2.35} aria-hidden="true" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="pf-toast">
          {toast.startsWith("x ") ? (
            <XCircle size={16} strokeWidth={2.35} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} strokeWidth={2.35} aria-hidden="true" />
          )}
          {toast.startsWith("x ") ? toast.slice(2) : toast}
        </div>
      )}
    </>
  );
}

export default Profile;
