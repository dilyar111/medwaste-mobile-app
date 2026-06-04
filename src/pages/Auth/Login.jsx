import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, ArrowRight, CircleAlert, Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import { login } from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectForRole = (role) => {
    const routes = {
      admin: "/dashboard/admin/organizations",
      utilizer: "/dashboard/utilizer/inbound",
      driver: "/dashboard/routes-history",
      personnel: "/dashboard",
    };
    navigate(routes[role] || "/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      const { token, email: userEmail, role, fullName, username } = res.data;

      sessionStorage.setItem("mw_logged_in", "true");
      sessionStorage.setItem("mw_user", userEmail);
      sessionStorage.setItem("mw_token", token);
      sessionStorage.setItem("mw_role", role);
      sessionStorage.setItem("mw_name", fullName || userEmail.split("@")[0]);
      if (username) sessionStorage.setItem("mw_username", username);

      redirectForRole(role);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-redesign">
      <style>{`
        .login-redesign {
          --login-bg: #f4f3f8;
          --login-card: #ffffff;
          --login-ink: #101318;
          --login-muted: #7d8490;
          --login-line: #e7e7ef;
          --login-teal: #149d80;
          --login-teal-dark: #0d8069;
          --login-teal-soft: #e7f6f1;
          --login-blue: #4f96ce;
          position: relative;
          isolation: isolate;
          min-height: 100%;
          overflow-x: hidden;
          padding: clamp(16px, 5vw, 28px);
          background:
            radial-gradient(circle at 18% 4%, rgba(20,157,128,.16), transparent 30%),
            radial-gradient(circle at 88% 12%, rgba(79,150,206,.14), transparent 26%),
            var(--login-bg);
        }

        .login-redesign::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 190px;
          z-index: -2;
          background:
            linear-gradient(135deg, rgba(20,157,128,.18), rgba(79,150,206,.12)),
            #ffffff;
          border-radius: 0 0 34px 34px;
        }

        .login-redesign * {
          min-width: 0;
          box-sizing: border-box;
        }

        .login-redesign .auth-container {
          width: min(100%, 392px);
          max-width: 100%;
          padding: 20px;
          border-radius: 28px;
          border: 1px solid rgba(231, 231, 239, .92);
          background: rgba(255,255,255,.94);
          box-shadow: 0 22px 54px rgba(24, 33, 49, .10);
          animation: loginCardEnter .72s var(--ease-out) both;
        }

        @keyframes loginCardEnter {
          from { opacity: 0; transform: translateY(18px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-redesign .auth-header {
          margin-bottom: 22px;
        }

        .login-redesign .login-brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-bottom: 18px;
          color: var(--login-teal);
          font-size: 1.28rem;
          font-weight: 900;
          letter-spacing: .04em;
          line-height: 1;
        }

        .login-redesign .brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--login-teal);
          color: #fff;
          box-shadow: 0 10px 24px rgba(20,157,128,.20);
        }

        .login-redesign .auth-header h1 {
          margin-bottom: 7px;
          color: var(--login-ink) !important;
          font-size: clamp(1.35rem, 6vw, 1.65rem) !important;
          line-height: 1.15;
          font-weight: 900 !important;
        }

        .login-redesign .auth-header p {
          max-width: 320px;
          margin: 0 auto;
          color: var(--login-muted);
          font-size: .88rem;
          line-height: 1.48;
        }

        .login-redesign .auth-form {
          gap: 14px;
        }

        .login-redesign .form-group {
          position: relative;
        }

        .login-redesign .form-group label {
          margin-bottom: 7px;
          color: #4b5565;
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: none;
        }

        .login-redesign .input-wrap {
          position: relative;
        }

        .login-redesign .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          z-index: 1;
          color: #a2a8b1;
          transform: translateY(-50%);
          transition: color .22s ease, transform .22s var(--ease-out);
        }

        .login-redesign .auth-form input[type="email"],
        .login-redesign .auth-form input[type="password"] {
          width: 100%;
          min-height: 50px;
          padding: 14px 16px 14px 46px;
          border: 1px solid var(--login-line);
          border-radius: 16px;
          background: #f8f8fb;
          color: var(--login-ink);
          box-shadow: none;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .login-redesign .auth-form input::placeholder {
          color: #a8adb6;
        }

        .login-redesign .auth-form input:focus {
          border-color: rgba(20,157,128,.72);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(20,157,128,.12);
        }

        .login-redesign .input-wrap:focus-within .input-icon {
          color: var(--login-teal);
          transform: translateY(-50%) scale(1.04);
        }

        .login-redesign .login-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          width: 100%;
          margin: 0;
          padding: 11px 12px;
          border: 1px solid rgba(224, 93, 99, .24);
          border-radius: 14px;
          background: #fff1f2;
          color: #b42335;
          font-size: .82rem;
          line-height: 1.45;
          text-align: left;
          animation: loginErrorIn .28s ease both;
        }

        @keyframes loginErrorIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-redesign .login-error svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: #e05d63;
        }

        .login-redesign .btn-full-width {
          min-height: 52px;
          margin-top: 2px;
          border-radius: 16px;
          gap: 9px;
          border: 0;
          background: var(--login-teal);
          color: #fff;
          font-size: .95rem !important;
          font-weight: 900;
          box-shadow: 0 16px 32px rgba(20,157,128,.22);
          transition: transform .2s var(--ease-out), box-shadow .2s ease, background .2s ease;
        }

        .login-redesign .btn-full-width:hover:not(:disabled) {
          background: var(--login-teal-dark);
          transform: translateY(-1px);
          box-shadow: 0 18px 38px rgba(20,157,128,.26);
        }

        .login-redesign .btn-full-width:disabled {
          cursor: not-allowed;
          transform: none;
          opacity: .72;
        }

        .login-redesign .btn-full-width svg {
          flex: 0 0 auto;
          transition: transform .24s var(--ease-out);
        }

        .login-redesign .btn-full-width:hover:not(:disabled) svg {
          transform: translateX(3px);
        }

        .login-redesign .forgot-password {
          margin-top: 2px;
          color: var(--login-muted);
          font-size: .86rem;
          font-weight: 700;
        }

        .login-redesign .forgot-password:hover {
          color: var(--login-teal);
        }

        .login-redesign .auth-footer {
          margin-top: 22px;
          color: var(--login-muted);
          font-size: .88rem;
        }

        .login-redesign .auth-footer a {
          color: var(--login-teal-dark);
          font-weight: 800;
        }

        .login-redesign .auth-footer a:hover {
          color: var(--login-blue);
        }

        .login-redesign .login-security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 14px;
          color: var(--login-muted);
          font-size: .76rem;
          line-height: 1.35;
        }

        .login-redesign .login-security-note svg {
          color: var(--login-teal);
          flex: 0 0 auto;
        }

        .mobile-shell .login-redesign {
          min-height: 100%;
          padding: 16px;
        }

        .mobile-shell .login-redesign .auth-container {
          width: 100%;
          padding: 20px;
          border-radius: 22px;
        }

        .mobile-shell .login-redesign .auth-header {
          margin-bottom: 24px;
        }

        .mobile-shell .login-redesign .auth-header h1 {
          font-size: 1.45rem !important;
        }

        .mobile-shell .login-redesign .auth-header p,
        .mobile-shell .login-redesign .auth-footer {
          font-size: .9rem;
        }

        @media (max-width: 420px) {
          .login-redesign {
            padding: 14px;
          }

          .login-redesign .auth-container {
            padding: 18px;
            border-radius: 22px;
          }

          .login-redesign .auth-form input[type="email"],
          .login-redesign .auth-form input[type="password"],
          .login-redesign .btn-full-width {
            min-height: 50px;
          }
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-header">
          <div className="login-brand-row" aria-label="MedWaste">
            <span className="brand-mark">
              <Activity size={20} strokeWidth={2.5} />
            </span>
            MEDWASTE
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to continue monitoring your medical waste operations.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrap">
              <span className="input-icon">
                <Mail size={19} strokeWidth={2.2} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              <CircleAlert size={18} strokeWidth={2.3} />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full-width"
            disabled={loading}
          >
            <LogIn size={18} strokeWidth={2.4} />
            {loading ? "Signing in..." : "Log In"}
            {!loading && <ArrowRight size={17} strokeWidth={2.4} />}
          </button>
          <a href="#" className="forgot-password">
            Forgot your password?
          </a>
          <p className="login-security-note">
            <ShieldCheck size={15} strokeWidth={2.3} />
            Protected clinical operations access
          </p>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
