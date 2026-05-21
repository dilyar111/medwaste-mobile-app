import React from 'react';
import { Link } from 'react-router-dom';

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const ShieldCheckIcon = () => (
  <svg {...iconProps}>
    <path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.4a1.3 1.3 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ActivityIcon = () => (
  <svg {...iconProps}>
    <path d="M22 12h-4l-3 8L9 4l-3 8H2" />
  </svg>
);

const MapPinIcon = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BellIcon = () => (
  <svg {...iconProps}>
    <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9" />
  </svg>
);

const BarChartIcon = () => (
  <svg {...iconProps}>
    <path d="M3 3v18h18" />
    <path d="M7 16V9" />
    <path d="M12 16V5" />
    <path d="M17 16v-3" />
  </svg>
);

const ContainerIcon = () => (
  <svg {...iconProps}>
    <path d="M7 4h10" />
    <path d="M6 7h12l-1 14H7Z" />
    <path d="M9 7V4h6v3" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg {...iconProps} width="18" height="18">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg {...iconProps} width="18" height="18">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const features = [
  {
    icon: ContainerIcon,
    title: 'Smart Containers',
    text: 'Containers equipped with sensors to track fill level, temperature, and location in real time.',
  },
  {
    icon: ActivityIcon,
    title: 'Real-Time Monitoring',
    text: 'A centralized dashboard to track all container data, generate reports, and receive alerts.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enhanced Safety',
    text: 'Minimize contamination risks and prevent unauthorized access to medical waste.',
  },
];

const keyFeatures = [
  {
    icon: BellIcon,
    title: 'Automated Alerts',
    text: 'Receive instant notifications about critical fill levels or anomalies detected by sensors.',
  },
  {
    icon: MapPinIcon,
    title: 'Location Tracking',
    text: 'Precise real-time location of every container across your facility or fleet.',
  },
  {
    icon: BarChartIcon,
    title: 'Analytics & Reporting',
    text: 'Detailed reports for analyzing and optimizing your waste disposal processes.',
  },
];

const Home = () => {
  return (
    <div className="landing-page home-redesign">
      <style>{`
        .home-redesign {
          min-height: 100%;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 20% 8%, rgba(26,110,255,.10), transparent 28%),
            radial-gradient(circle at 92% 18%, rgba(0,214,143,.11), transparent 24%),
            #ffffff;
          color: var(--ink);
        }

        .home-redesign * {
          min-width: 0;
        }

        .home-redesign header {
          background: rgba(255,255,255,.88);
          border-bottom: 1px solid rgba(214,220,232,.72);
          box-shadow: 0 10px 34px rgba(11,15,26,.06);
        }

        .home-redesign header .container,
        .home-redesign .container {
          width: 100%;
          max-width: 1120px;
        }

        .home-redesign header .container {
          gap: 18px;
        }

        .home-redesign .logo h1 {
          color: #111827 !important;
          font-size: clamp(1.2rem, 4vw, 1.6rem);
          line-height: 1.1;
          white-space: nowrap;
        }

        .home-redesign .logo h1 span {
          color: var(--green);
        }

        .home-redesign nav ul {
          align-items: center;
          gap: clamp(10px, 4vw, 32px);
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .home-redesign nav ul li a {
          color: #566174;
          font-size: .9rem;
        }

        .home-redesign .btn-login {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 9px 16px;
          border: 1px solid rgba(26,110,255,.18);
          border-radius: var(--radius-pill);
          background: rgba(26,110,255,.08);
          color: var(--blue) !important;
          box-shadow: 0 8px 24px rgba(26,110,255,.10);
        }

        .home-redesign .btn-login::after {
          display: none;
        }

        .home-redesign .btn-login:hover {
          background: var(--blue);
          color: #fff !important;
          transform: translateY(-1px);
        }

        .home-redesign .hero-section {
          min-height: auto;
          padding: clamp(56px, 12vw, 116px) 0 clamp(48px, 10vw, 94px);
          background:
            linear-gradient(135deg, rgba(11,15,26,.96), rgba(20,33,55,.96)),
            radial-gradient(circle at 18% 20%, rgba(26,110,255,.34), transparent 28%),
            radial-gradient(circle at 88% 26%, rgba(0,214,143,.25), transparent 28%);
          text-align: left;
        }

        .home-redesign .hero-section::before {
          background:
            linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,.75), transparent);
          animation: homeGridDrift 14s linear infinite;
        }

        .home-redesign .hero-section::after {
          opacity: .28;
        }

        @keyframes homeGridDrift {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(34px,34px,0); }
        }

        .home-redesign .hero-layout {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(280px, .95fr);
          gap: clamp(28px, 6vw, 70px);
          align-items: center;
        }

        .home-redesign .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          max-width: 100%;
          padding: 8px 12px;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: var(--radius-pill);
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.78);
          font-size: .82rem;
          font-weight: 600;
          backdrop-filter: blur(14px);
          animation: heroFadeUp .8s var(--ease-out) both;
        }

        .home-redesign .eyebrow svg {
          color: var(--green);
          flex: 0 0 auto;
        }

        .home-redesign .hero-section h2 {
          max-width: 760px;
          margin-bottom: 22px;
          color: #fff;
          font-size: clamp(2.65rem, 10vw, 5.45rem) !important;
          line-height: .98;
        }

        .home-redesign .hero-section h2 span {
          color: #5ee7c1 !important;
        }

        .home-redesign .hero-section p {
          max-width: 610px;
          margin: 0 0 32px;
          color: rgba(255,255,255,.70);
          font-size: clamp(1rem, 2.4vw, 1.2rem);
          line-height: 1.75;
        }

        .home-redesign .home-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          animation: heroFadeUp .9s .3s var(--ease-out) both;
        }

        .home-redesign .btn {
          justify-content: center;
          min-height: 48px;
          max-width: 100%;
          border: 1px solid transparent;
          font-weight: 700;
          white-space: normal;
        }

        .home-redesign .btn svg {
          flex: 0 0 auto;
          transition: transform .25s var(--ease-out);
        }

        .home-redesign .btn:hover svg {
          transform: translateX(3px);
        }

        .home-redesign .btn-secondary {
          margin-left: 0;
          background: rgba(255,255,255,.08);
          color: #fff;
          border-color: rgba(255,255,255,.18);
          box-shadow: none;
        }

        .home-redesign .btn-secondary:hover {
          background: rgba(255,255,255,.14);
          color: #fff;
        }

        .home-redesign .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 26px;
          color: rgba(255,255,255,.62);
          font-size: .86rem;
          animation: heroFadeUp .9s .42s var(--ease-out) both;
        }

        .home-redesign .hero-trust span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .home-redesign .hero-trust svg {
          color: var(--green);
          flex: 0 0 auto;
        }

        .home-redesign .hero-visual {
          position: relative;
          animation: heroFadeUp .9s .22s var(--ease-out) both;
        }

        .home-redesign .hero-visual::before {
          content: '';
          position: absolute;
          inset: 12% -4% -6% 10%;
          border-radius: 30px;
          background: linear-gradient(135deg, rgba(26,110,255,.28), rgba(0,214,143,.18));
          filter: blur(24px);
        }

        .home-redesign .dashboard-card {
          position: relative;
          overflow: hidden;
          width: 100%;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 28px;
          background: rgba(255,255,255,.10);
          box-shadow: 0 28px 80px rgba(0,0,0,.34);
          backdrop-filter: blur(22px);
        }

        .home-redesign .dashboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }

        .home-redesign .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 11px;
          border-radius: var(--radius-pill);
          background: rgba(0,214,143,.14);
          color: #86f3d4;
          font-size: .78rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .home-redesign .pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 0 0 rgba(0,214,143,.54);
          animation: homePulse 1.9s infinite;
        }

        @keyframes homePulse {
          70% { box-shadow: 0 0 0 9px rgba(0,214,143,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,214,143,0); }
        }

        .home-redesign .dashboard-title {
          color: rgba(255,255,255,.86);
          font-size: .88rem;
          font-weight: 700;
        }

        .home-redesign .dashboard-body {
          padding: 18px;
        }

        .home-redesign .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .home-redesign .metric {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.10);
        }

        .home-redesign .metric strong {
          display: block;
          color: #fff;
          font-size: clamp(1.45rem, 7vw, 2.05rem);
          line-height: 1;
        }

        .home-redesign .metric span {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,.58);
          font-size: .78rem;
          line-height: 1.35;
        }

        .home-redesign .route-card {
          padding: 16px;
          border-radius: 20px;
          background: rgba(255,255,255,.92);
          color: var(--ink);
        }

        .home-redesign .route-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .home-redesign .route-card h3 {
          margin: 0;
          color: var(--ink);
          font-size: 1rem !important;
          line-height: 1.25;
        }

        .home-redesign .route-card p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: .8rem;
          line-height: 1.4;
        }

        .home-redesign .mini-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          border-radius: 12px;
          background: rgba(26,110,255,.10);
          color: var(--blue);
        }

        .home-redesign .fill-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
          color: #334155;
          font-size: .8rem;
          font-weight: 700;
        }

        .home-redesign .fill-bar {
          overflow: hidden;
          height: 8px;
          border-radius: var(--radius-pill);
          background: #e7edf6;
        }

        .home-redesign .fill-bar span {
          display: block;
          width: 76%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--blue), var(--green));
        }

        .home-redesign .section {
          padding: clamp(56px, 11vw, 104px) 0;
          text-align: left;
        }

        .home-redesign .section-header {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1fr);
          gap: 24px;
          align-items: end;
          margin-bottom: 34px;
        }

        .home-redesign .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--blue);
          font-size: .82rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .home-redesign .section h2,
        .home-redesign .section h3 {
          margin-bottom: 0;
          color: #111827;
        }

        .home-redesign .section h2 {
          max-width: 620px;
          font-size: clamp(2rem, 8vw, 3.15rem) !important;
          line-height: 1.08;
        }

        .home-redesign .section p {
          max-width: 650px;
          margin: 0;
          color: #637083;
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .home-redesign .feature-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 0;
        }

        .home-redesign .feature-item {
          min-height: 100%;
          padding: 24px;
          border-radius: 20px;
          border-color: rgba(214,220,232,.78);
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(247,249,252,.96));
          box-shadow: 0 12px 36px rgba(11,15,26,.07);
        }

        .home-redesign .feature-item::before {
          height: 100%;
          width: 4px;
          right: auto;
          transform: scaleY(0);
          transform-origin: bottom;
        }

        .home-redesign .feature-item:hover {
          transform: translateY(-5px);
          border-color: rgba(26,110,255,.16);
          box-shadow: 0 22px 54px rgba(11,15,26,.12);
        }

        .home-redesign .feature-item:hover::before {
          transform: scaleY(1);
        }

        .home-redesign .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          margin-bottom: 18px;
          border-radius: 15px;
          background: linear-gradient(135deg, rgba(26,110,255,.12), rgba(0,214,143,.14));
          color: var(--blue);
        }

        .home-redesign .feature-item h4 {
          margin-bottom: 10px;
          color: #111827;
          font-size: 1.08rem;
        }

        .home-redesign .feature-item p {
          color: #647085;
          font-size: .95rem;
          line-height: 1.68;
        }

        .home-redesign .bg-light {
          background:
            linear-gradient(180deg, rgba(247,249,252,.82), rgba(238,242,249,.72));
        }

        .home-redesign .solution-panel {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          padding: clamp(28px, 7vw, 54px);
          border-radius: 28px;
          background:
            radial-gradient(circle at 12% 24%, rgba(26,110,255,.28), transparent 32%),
            radial-gradient(circle at 92% 16%, rgba(0,214,143,.20), transparent 28%),
            #0b0f1a;
          box-shadow: 0 26px 68px rgba(11,15,26,.22);
        }

        .home-redesign .bg-dark {
          background: transparent;
          color: #fff;
        }

        .home-redesign .solution-panel h3 {
          margin-bottom: 12px;
          color: #fff;
          font-size: clamp(1.8rem, 7vw, 2.55rem) !important;
          line-height: 1.1;
        }

        .home-redesign .solution-panel p {
          max-width: 660px;
          margin-bottom: 0;
          color: rgba(255,255,255,.68);
        }

        .home-redesign .contact-card {
          display: grid;
          grid-template-columns: minmax(0, .82fr) minmax(0, 1fr);
          gap: clamp(24px, 7vw, 56px);
          align-items: start;
          padding: clamp(24px, 6vw, 42px);
          border: 1px solid rgba(214,220,232,.78);
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 20px 62px rgba(11,15,26,.09);
        }

        .home-redesign .contact-points {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .home-redesign .contact-points span {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #475569;
          font-size: .95rem;
          line-height: 1.4;
        }

        .home-redesign .contact-points svg {
          flex: 0 0 auto;
          color: var(--green);
        }

        .home-redesign form {
          width: 100%;
          max-width: none;
          margin: 0;
          gap: 14px;
        }

        .home-redesign form input,
        .home-redesign form textarea {
          width: 100%;
          min-width: 0;
          border-radius: 14px;
          background: #f8fafc;
        }

        .home-redesign form button {
          align-self: flex-start;
        }

        .home-redesign footer {
          background: #0b0f1a;
        }

        @media (max-width: 900px) {
          .home-redesign .hero-layout,
          .home-redesign .section-header,
          .home-redesign .contact-card,
          .home-redesign .solution-panel {
            grid-template-columns: 1fr;
          }

          .home-redesign .hero-section {
            text-align: center;
          }

          .home-redesign .hero-copy,
          .home-redesign .hero-section p,
          .home-redesign .eyebrow {
            margin-left: auto;
            margin-right: auto;
          }

          .home-redesign .home-hero-actions,
          .home-redesign .hero-trust {
            justify-content: center;
          }

          .home-redesign .hero-visual {
            max-width: 560px;
            width: 100%;
            margin: 0 auto;
          }

          .home-redesign .feature-grid {
            grid-template-columns: 1fr;
          }

          .home-redesign .solution-panel .btn {
            width: fit-content;
          }
        }

        @media (max-width: 560px) {
          .home-redesign header .container {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          .home-redesign .logo h1 {
            font-size: 1.05rem;
          }

          .home-redesign nav {
            flex: 1;
            width: auto;
          }

          .home-redesign nav ul {
            width: 100%;
            flex-wrap: nowrap;
            justify-content: flex-end;
            gap: 12px;
          }

          .home-redesign nav ul li a {
            font-size: .74rem;
          }

          .home-redesign .btn-login {
            min-height: 36px;
            padding: 6px 8px;
          }

          .home-redesign .btn-signup {
            min-height: 36px;
            padding: 6px 8px;
          }

          .home-redesign .home-hero-actions,
          .home-redesign .solution-panel .btn,
          .home-redesign form button {
            width: 100%;
          }

          .home-redesign .home-hero-actions .btn {
            width: 100%;
          }

          .home-redesign .metric-grid {
            grid-template-columns: 1fr;
          }

          .home-redesign .dashboard-top,
          .home-redesign .route-card-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .home-redesign .fill-row {
            grid-template-columns: 1fr;
          }

          .home-redesign .section-header {
            margin-bottom: 24px;
          }
        }

        .mobile-shell .home-redesign .section {
          padding: 56px 0;
        }

        .mobile-shell .home-redesign header .container {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .mobile-shell .home-redesign .logo h1 {
          font-size: 1.05rem;
        }

        .mobile-shell .home-redesign nav {
          flex: 1;
          width: auto;
        }

        .mobile-shell .home-redesign nav ul {
          width: 100%;
          flex-wrap: nowrap;
          justify-content: flex-end;
          gap: 12px;
        }

        .mobile-shell .home-redesign nav ul li a {
          font-size: .74rem;
        }

        .mobile-shell .home-redesign .btn-login,
        .mobile-shell .home-redesign .btn-signup {
          min-height: 36px;
          padding: 6px 8px;
        }

        .mobile-shell .home-redesign .hero-section {
          padding: 64px 0 50px;
          text-align: center;
        }

        .mobile-shell .home-redesign .hero-layout,
        .mobile-shell .home-redesign .section-header,
        .mobile-shell .home-redesign .contact-card,
        .mobile-shell .home-redesign .solution-panel {
          grid-template-columns: 1fr;
        }

        .mobile-shell .home-redesign .hero-section h2 {
          font-size: 2.45rem !important;
          line-height: 1.04;
        }

        .mobile-shell .home-redesign .hero-section p {
          font-size: .95rem;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 24px;
        }

        .mobile-shell .home-redesign .eyebrow,
        .mobile-shell .home-redesign .hero-copy {
          margin-left: auto;
          margin-right: auto;
        }

        .mobile-shell .home-redesign .home-hero-actions,
        .mobile-shell .home-redesign .hero-trust {
          justify-content: center;
        }

        .mobile-shell .home-redesign .feature-grid {
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .mobile-shell .home-redesign .section h2 {
          font-size: 1.95rem !important;
        }

        .mobile-shell .home-redesign .section p {
          font-size: .95rem;
        }

        .mobile-shell .home-redesign .feature-item {
          padding: 22px 18px;
        }

        .mobile-shell .home-redesign .solution-panel,
        .mobile-shell .home-redesign .contact-card {
          border-radius: 20px;
          padding: 22px 18px;
        }

        .mobile-shell .home-redesign .solution-panel .btn,
        .mobile-shell .home-redesign form button {
          width: 100%;
        }
      `}</style>

      <header>
        <div className="container">
          <div className="logo">
            <h1>Med<span>Waste</span></h1>
          </div>
          <nav>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><Link to="/login" className="btn-login">Log In</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow">
              <ShieldCheckIcon />
              Smart healthcare waste intelligence
            </div>
            <h2>Medical Waste <span>Monitoring</span></h2>
            <p>An intelligent system with smart containers for safe and efficient waste management.</p>
            <div className="home-hero-actions">
              <Link to="/login" className="btn btn-primary">
                Get Started
                <ArrowRightIcon />
              </Link>
              <a href="#about" className="btn btn-secondary">Learn More</a>
            </div>
            <div className="hero-trust" aria-label="Platform benefits">
              <span><CheckIcon /> Safer handling</span>
              <span><CheckIcon /> Live container status</span>
              <span><CheckIcon /> Facility-ready reports</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="dashboard-card">
              <div className="dashboard-top">
                <div>
                  <div className="dashboard-title">Facility Overview</div>
                </div>
                <div className="status-pill"><span className="pulse" /> Live</div>
              </div>
              <div className="dashboard-body">
                <div className="metric-grid">
                  <div className="metric">
                    <strong>128</strong>
                    <span>Tracked containers</span>
                  </div>
                  <div className="metric">
                    <strong>94%</strong>
                    <span>Collection accuracy</span>
                  </div>
                  <div className="metric">
                    <strong>12</strong>
                    <span>Active routes</span>
                  </div>
                  <div className="metric">
                    <strong>24/7</strong>
                    <span>Safety monitoring</span>
                  </div>
                </div>
                <div className="route-card">
                  <div className="route-card-head">
                    <div>
                      <h3>Container MW-42</h3>
                      <p>Temperature stable, pickup recommended soon.</p>
                    </div>
                    <span className="mini-icon"><ContainerIcon /></span>
                  </div>
                  <div className="fill-row">
                    <span>Fill level</span>
                    <div className="fill-bar"><span /></div>
                    <span>76%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-kicker">About Our System</div>
              <h2>Built to make medical waste operations safer and clearer.</h2>
            </div>
            <p>Our system is designed to revolutionize medical waste management, ensuring safety, regulatory compliance, and streamlined operations.</p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <div className="feature-item" key={title}>
                <span className="feature-icon"><Icon /></span>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-kicker">Key Features</div>
              <h2>Everything teams need to monitor waste in real time.</h2>
            </div>
            <p>Connect containers, teams, routes, and compliance reporting in one clean operational view.</p>
          </div>
          <div className="feature-grid">
            {keyFeatures.map(({ icon: Icon, title, text }) => (
              <div className="feature-item" key={title}>
                <span className="feature-icon"><Icon /></span>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="section bg-dark">
        <div className="container">
          <div className="solution-panel">
            <div>
              <h3>A Solution for Your Facility</h3>
              <p>We offer a comprehensive solution that integrates seamlessly into existing medical facility infrastructure.</p>
            </div>
            <a href="#contact" className="btn btn-primary">
              Request a Demo
              <ArrowRightIcon />
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <div className="contact-card">
            <div>
              <div className="section-kicker">Get in Touch</div>
              <h2>Ready to modernize your waste workflow?</h2>
              <p>Have questions? We're ready to help!</p>
              <div className="contact-points">
                <span><CheckIcon /> Keep existing workflows intact</span>
                <span><CheckIcon /> Monitor containers and alerts centrally</span>
                <span><CheckIcon /> Support safer facility operations</span>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                required
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                required
              ></textarea>
              <button type="submit" className="btn btn-primary">
                Send Message
                <ArrowRightIcon />
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2026 MedWaste. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
