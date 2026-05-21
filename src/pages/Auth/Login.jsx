import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/api";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const MailIcon = () => (
  <svg {...iconProps}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg {...iconProps}>
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LogInIcon = () => (
  <svg {...iconProps}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg {...iconProps}>
    <path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.4a1.3 1.3 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectForRole = (role) => {
    const routes = {
      admin: "/dashboard/admin/dispatch",
      utilizer: "/dashboard/utilizer",
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
          position: relative;
          isolation: isolate;
          min-height: 100%;
          overflow-x: hidden;
          padding: clamp(18px, 5vw, 34px);
          background:
            radial-gradient(circle at 18% 12%, rgba(26,110,255,.26), transparent 28%),
            radial-gradient(circle at 84% 14%, rgba(0,214,143,.20), transparent 26%),
            linear-gradient(135deg, #0b0f1a 0%, #121d31 54%, #0b0f1a 100%);
        }

        .login-redesign::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,.76), transparent 78%);
          animation: loginGridDrift 16s linear infinite;
        }

        .login-redesign::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.045'/%3E%3C/svg%3E");
          opacity: .45;
        }

        @keyframes loginGridDrift {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(34px,34px,0); }
        }

        .login-redesign * {
          min-width: 0;
          box-sizing: border-box;
        }

        .login-redesign .auth-container {
          width: min(100%, 460px);
          max-width: 100%;
          padding: clamp(28px, 7vw, 44px);
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,.13);
          background:
            linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.07));
          box-shadow: 0 30px 90px rgba(0,0,0,.42);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: loginCardEnter .72s var(--ease-out) both;
        }

        @keyframes loginCardEnter {
          from { opacity: 0; transform: translateY(18px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-redesign .auth-header {
          margin-bottom: 30px;
        }

        .login-redesign .brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          margin-bottom: 18px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(26,110,255,.24), rgba(0,214,143,.22));
          color: #7df0cf;
          box-shadow: 0 16px 40px rgba(0,214,143,.14);
        }

        .login-redesign .auth-header h1 {
          margin-bottom: 8px;
          color: #f8fafc !important;
          font-size: clamp(2rem, 8vw, 2.6rem);
          line-height: 1.08;
          font-weight: 800 !important;
        }

        .login-redesign .auth-header p {
          max-width: 320px;
          margin: 0 auto;
          color: rgba(248,250,252,.64);
          font-size: .98rem;
          line-height: 1.55;
        }

        .login-redesign .auth-form {
          gap: 18px;
        }

        .login-redesign .form-group {
          position: relative;
        }

        .login-redesign .form-group label {
          margin-bottom: 8px;
          color: rgba(248,250,252,.78);
          font-size: .86rem;
          font-weight: 700;
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
          color: rgba(248,250,252,.42);
          transform: translateY(-50%);
          transition: color .22s ease, transform .22s var(--ease-out);
        }

        .login-redesign .auth-form input[type="email"],
        .login-redesign .auth-form input[type="password"] {
          width: 100%;
          min-height: 50px;
          padding: 14px 16px 14px 46px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 16px;
          background: rgba(255,255,255,.075);
          color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
        }

        .login-redesign .auth-form input::placeholder {
          color: rgba(248,250,252,.36);
        }

        .login-redesign .auth-form input:focus {
          border-color: rgba(26,110,255,.82);
          background: rgba(255,255,255,.10);
          box-shadow:
            0 0 0 4px rgba(26,110,255,.20),
            inset 0 1px 0 rgba(255,255,255,.06);
        }

        .login-redesign .input-wrap:focus-within .input-icon {
          color: #7df0cf;
          transform: translateY(-50%) scale(1.04);
        }

        .login-redesign .login-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          width: 100%;
          margin: 0;
          padding: 12px 14px;
          border: 1px solid rgba(255,77,94,.28);
          border-radius: 14px;
          background: rgba(255,77,94,.10);
          color: #fecdd3;
          font-size: .88rem;
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
          color: #fb7185;
        }

        .login-redesign .btn-full-width {
          min-height: 52px;
          margin-top: 2px;
          border-radius: 16px;
          gap: 9px;
          font-size: 1rem;
          box-shadow: 0 16px 38px rgba(26,110,255,.28);
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
          color: rgba(248,250,252,.56);
          font-weight: 600;
        }

        .login-redesign .forgot-password:hover {
          color: #7df0cf;
        }

        .login-redesign .auth-footer {
          margin-top: 28px;
          color: rgba(248,250,252,.56);
          font-size: .95rem;
        }

        .login-redesign .auth-footer a {
          color: #7db2ff;
          font-weight: 800;
        }

        .login-redesign .auth-footer a:hover {
          color: #7df0cf;
        }

        .mobile-shell .login-redesign {
          min-height: 100%;
          padding: 16px;
        }

        .mobile-shell .login-redesign .auth-container {
          width: 100%;
          padding: 28px 20px;
          border-radius: 22px;
        }

        .mobile-shell .login-redesign .auth-header {
          margin-bottom: 24px;
        }

        .mobile-shell .login-redesign .brand-mark {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          margin-bottom: 14px;
        }

        .mobile-shell .login-redesign .auth-header h1 {
          font-size: 2rem !important;
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
            padding: 26px 18px;
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
          <div className="brand-mark">
            <ShieldCheckIcon />
          </div>
          <h1>MedWaste</h1>
          <p>Sign in to continue to your dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrap">
              <span className="input-icon">
                <MailIcon />
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
                <LockIcon />
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
              <AlertCircleIcon />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full-width"
            disabled={loading}
          >
            <LogInIcon />
            {loading ? "Signing in..." : "Log In"}
          </button>
          <a href="#" className="forgot-password">
            Forgot your password?
          </a>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
