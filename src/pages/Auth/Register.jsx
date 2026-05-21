import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { register } from "../../services/api";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || form.fullName).trim(),
      username: String(formData.get("username") || form.username).trim(),
      email: String(formData.get("email") || form.email).trim(),
      password: String(formData.get("password") || form.password),
    };
    const confirmPassword = String(formData.get("confirmPassword") || form.confirmPassword);

    if (payload.password !== confirmPassword) return setError("Passwords do not match.");
    if (payload.password.length < 6) return setError("Password must be at least 6 characters.");
    if (!/^[A-Za-z0-9_-]{3,30}$/.test(payload.username)) {
      return setError("Username must be 3-30 chars and only letters, numbers, underscores, or hyphens.");
    }

    setLoading(true);
    try {
      await register(payload);
      setSuccess("Account created. You can log in now.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page register-redesign">
      <style>{`
        .register-redesign {
          --register-bg: #f4f3f8;
          --register-card: #ffffff;
          --register-ink: #101318;
          --register-muted: #7d8490;
          --register-line: #e7e7ef;
          --register-teal: #149d80;
          --register-teal-dark: #0d8069;
          --register-teal-soft: #e7f6f1;
          --register-blue: #4f96ce;
          position: relative;
          isolation: isolate;
          min-height: 100%;
          overflow-x: hidden;
          padding: clamp(16px, 5vw, 28px);
          background:
            radial-gradient(circle at 18% 4%, rgba(20,157,128,.16), transparent 30%),
            radial-gradient(circle at 88% 12%, rgba(79,150,206,.14), transparent 26%),
            var(--register-bg);
        }

        .register-redesign::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          z-index: -2;
          height: 190px;
          border-radius: 0 0 34px 34px;
          background:
            linear-gradient(135deg, rgba(20,157,128,.18), rgba(79,150,206,.12)),
            #ffffff;
        }

        .register-redesign,
        .register-redesign * {
          box-sizing: border-box;
          min-width: 0;
        }

        .register-redesign .auth-container {
          width: min(100%, 392px);
          max-width: 100%;
          padding: 20px;
          border: 1px solid rgba(231, 231, 239, .92);
          border-radius: 28px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 22px 54px rgba(24, 33, 49, .10);
          animation: registerCardEnter .72s var(--ease-out) both;
        }

        @keyframes registerCardEnter {
          from { opacity: 0; transform: translateY(18px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .register-redesign .auth-header {
          margin-bottom: 18px;
        }

        .register-redesign .register-brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-bottom: 14px;
          color: var(--register-teal);
          font-size: 1.28rem;
          font-weight: 900;
          letter-spacing: .04em;
          line-height: 1;
        }

        .register-redesign .brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--register-teal);
          color: #fff;
          box-shadow: 0 10px 24px rgba(20,157,128,.20);
        }

        .register-redesign .auth-header h1 {
          margin-bottom: 7px;
          color: var(--register-ink) !important;
          font-size: clamp(1.35rem, 6vw, 1.62rem) !important;
          font-weight: 900 !important;
          line-height: 1.15;
        }

        .register-redesign .auth-header p {
          max-width: 320px;
          margin: 0 auto;
          color: var(--register-muted);
          font-size: .88rem;
          line-height: 1.48;
        }

        .register-redesign .register-summary {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 16px;
          padding: 11px 12px;
          border: 1px solid rgba(20,157,128,.14);
          border-radius: 16px;
          background: var(--register-teal-soft);
          color: #315d53;
          font-size: .8rem;
          font-weight: 700;
          line-height: 1.35;
          text-align: left;
        }

        .register-redesign .register-summary svg {
          flex: 0 0 auto;
          color: var(--register-teal);
        }

        .register-redesign .auth-form {
          gap: 13px;
          margin-top: 0;
        }

        .register-redesign .form-group {
          position: relative;
          text-align: left;
        }

        .register-redesign .form-group label {
          margin-bottom: 7px;
          color: #4b5565;
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: none;
        }

        .register-redesign .input-wrap {
          position: relative;
        }

        .register-redesign .input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          z-index: 1;
          color: #a2a8b1;
          transform: translateY(-50%);
          transition: color .22s ease, transform .22s var(--ease-out);
        }

        .register-redesign .auth-form input[type="text"],
        .register-redesign .auth-form input[type="email"],
        .register-redesign .auth-form input[type="password"] {
          width: 100%;
          min-height: 48px;
          padding: 13px 16px 13px 46px;
          border: 1px solid var(--register-line);
          border-radius: 16px;
          background: #f8f8fb;
          color: var(--register-ink);
          box-shadow: none;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .register-redesign .auth-form input::placeholder {
          color: #a8adb6;
        }

        .register-redesign .auth-form input:focus {
          border-color: rgba(20,157,128,.72);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(20,157,128,.12);
        }

        .register-redesign .input-wrap:focus-within .input-icon {
          color: var(--register-teal);
          transform: translateY(-50%) scale(1.04);
        }

        .register-redesign .register-message {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          width: 100%;
          margin: 0;
          padding: 11px 12px;
          border-radius: 14px;
          font-size: .82rem;
          line-height: 1.45;
          text-align: left;
          animation: registerMessageIn .28s ease both;
        }

        @keyframes registerMessageIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .register-redesign .register-message svg {
          flex: 0 0 auto;
          margin-top: 1px;
        }

        .register-redesign .register-message.error {
          border: 1px solid rgba(224, 93, 99, .24);
          background: #fff1f2;
          color: #b42335;
        }

        .register-redesign .register-message.error svg {
          color: #e05d63;
        }

        .register-redesign .register-message.success {
          border: 1px solid rgba(20,157,128,.22);
          background: #ecfdf7;
          color: #0d8069;
        }

        .register-redesign .register-message.success svg {
          color: var(--register-teal);
        }

        .register-redesign .btn-full-width {
          min-height: 52px;
          margin-top: 2px;
          gap: 9px;
          border: 0;
          border-radius: 16px;
          background: var(--register-teal);
          color: #fff;
          font-size: .95rem !important;
          font-weight: 900;
          box-shadow: 0 16px 32px rgba(20,157,128,.22);
          transition: transform .2s var(--ease-out), box-shadow .2s ease, background .2s ease, opacity .2s ease;
        }

        .register-redesign .btn-full-width:hover:not(:disabled) {
          background: var(--register-teal-dark);
          transform: translateY(-1px);
          box-shadow: 0 18px 38px rgba(20,157,128,.26);
        }

        .register-redesign .btn-full-width:disabled {
          cursor: not-allowed;
          transform: none;
          opacity: .7;
        }

        .register-redesign .btn-full-width svg {
          flex: 0 0 auto;
          transition: transform .24s var(--ease-out);
        }

        .register-redesign .btn-full-width:hover:not(:disabled) svg:last-child {
          transform: translateX(3px);
        }

        .register-redesign .auth-footer {
          margin-top: 20px;
          color: var(--register-muted);
          font-size: .88rem;
        }

        .register-redesign .auth-footer a {
          color: var(--register-teal-dark);
          font-weight: 800;
        }

        .register-redesign .auth-footer a:hover {
          color: var(--register-blue);
        }

        .mobile-shell .register-redesign {
          min-height: 100%;
          padding: 16px;
        }

        .mobile-shell .register-redesign .auth-container {
          width: 100%;
          padding: 18px;
          border-radius: 22px;
        }

        .mobile-shell .register-redesign .auth-header {
          margin-bottom: 16px;
        }

        .mobile-shell .register-redesign .auth-header h1 {
          font-size: 1.45rem !important;
        }

        .mobile-shell .register-redesign .auth-header p,
        .mobile-shell .register-redesign .auth-footer {
          font-size: .88rem;
        }

        @media (max-width: 420px) {
          .register-redesign {
            padding: 14px;
          }

          .register-redesign .auth-container {
            padding: 16px;
            border-radius: 22px;
          }

          .register-redesign .register-brand-row {
            margin-bottom: 12px;
            font-size: 1.18rem;
          }

          .register-redesign .auth-form input[type="text"],
          .register-redesign .auth-form input[type="email"],
          .register-redesign .auth-form input[type="password"],
          .register-redesign .btn-full-width {
            min-height: 48px;
          }
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-header">
          <div className="register-brand-row" aria-label="MedWaste">
            <span className="brand-mark">
              <Activity size={20} strokeWidth={2.5} />
            </span>
            MEDWASTE
          </div>
          <h1>Create account</h1>
          <p>Register to access medical waste monitoring and operations tools.</p>
        </div>

        <p className="register-summary">
          <ShieldCheck size={17} strokeWidth={2.3} />
          Protected access for healthcare waste teams.
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrap">
              <span className="input-icon">
                <User size={19} strokeWidth={2.2} />
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Dr. Jane Smith"
                required
                value={form.fullName}
                onChange={setField("fullName")}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrap">
              <span className="input-icon">
                <BadgeCheck size={19} strokeWidth={2.2} />
              </span>
              <input
                type="text"
                name="username"
                placeholder="your_username"
                required
                value={form.username}
                onChange={setField("username")}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrap">
              <span className="input-icon">
                <Mail size={19} strokeWidth={2.2} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={setField("email")}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">
                <Lock size={19} strokeWidth={2.2} />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                required
                value={form.password}
                onChange={setField("password")}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrap">
              <span className="input-icon">
                <Lock size={19} strokeWidth={2.2} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
              />
            </div>
          </div>

          {error && (
            <p className="register-message error" role="alert">
              <CircleAlert size={18} strokeWidth={2.3} />
              {error}
            </p>
          )}

          {success && (
            <p className="register-message success" role="status">
              <CircleCheck size={18} strokeWidth={2.3} />
              {success}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full-width"
            disabled={loading}
          >
            <UserPlus size={18} strokeWidth={2.4} />
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={17} strokeWidth={2.4} />}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
