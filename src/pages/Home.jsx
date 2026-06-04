import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarClock,
  ChartColumn,
  Check,
  ChevronRight,
  ClipboardCheck,
  Ellipsis,
  FileChartColumn,
  Grid3x3,
  HeartPulse,
  Hospital,
  House,
  LogIn,
  MapPin,
  PackageCheck,
  Radio,
  Route,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Crown,
  Zap,
} from 'lucide-react';
import { submitContactInquiry } from '../services/api';
import { isApiConfigured } from '../config/api';

const serviceCards = [
  {
    icon: CalendarClock,
    title: 'Collection schedule',
    text: 'Plan pickups and stay ahead of capacity.',
    tone: 'blue',
  },
  {
    icon: Radio,
    title: 'Live container data',
    text: 'Track fill level, location, and safety signals.',
    tone: 'teal',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance overview',
    text: 'Keep handling steps traceable and audit-ready.',
    tone: 'green',
  },
];

const quickActions = [
  { icon: Hospital, title: 'Facility overview', to: '/dashboard' },
  { icon: PackageCheck, title: 'Containers', to: '/dashboard/containers' },
  { icon: MapPin, title: 'Live map', to: '/dashboard/map' },
  { icon: Bell, title: 'Alerts', to: '/dashboard/alerts' },
  { icon: FileChartColumn, title: 'Reports', to: '/dashboard/reports' },
  { icon: Route, title: 'Route history', to: '/dashboard/routes-history' },
];

const stats = [
  { label: 'Tracked containers', value: '128' },
  { label: 'Safe collections', value: '94%' },
  { label: 'Active routes', value: '12' },
];

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'per organization / month',
    description: 'For smaller clinics starting digital waste tracking.',
    icon: ShieldCheck,
    highlighted: false,
    features: [
      'Up to 10 team members',
      'Container monitoring & alerts',
      'Map and list dashboard views',
      'Basic reports and route history',
      'Email support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'Custom',
    period: 'tailored B2B billing',
    description: 'For hospital networks and multi-site operators.',
    icon: Crown,
    highlighted: true,
    features: [
      'Unlimited users per organization',
      'Manual dispatch & shift management',
      'Inbound logistics for utilizers',
      'Advanced analytics & exports',
      'Priority onboarding & support',
    ],
  },
];

const bottomTabs = [
  { icon: House, label: 'Main', href: '#top', active: true },
  { icon: ClipboardCheck, label: 'About', href: '#about' },
  { icon: Star, label: 'Features', href: '#features' },
  { icon: Crown, label: 'Plans', href: '#subscriptions' },
  { icon: Ellipsis, label: 'Contact', href: '#contact' },
];

const Home = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactFeedback, setContactFeedback] = useState(null);

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (!isApiConfigured) {
      setContactFeedback({ type: 'error', text: 'API is not configured. Set VITE_API_URL and rebuild.' });
      return;
    }

    setContactSubmitting(true);
    setContactFeedback(null);
    try {
      const res = await submitContactInquiry(contactForm);
      setContactFeedback({
        type: 'success',
        text: res.data?.message || 'Thank you. We will get back to you soon.',
      });
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      setContactFeedback({
        type: 'error',
        text: err.response?.data?.error || err.message || 'Failed to send message. Try again later.',
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div id="top" className="landing-page home-dumamed">
      <style>{`
        .home-dumamed {
          --dm-bg: #f4f3f8;
          --dm-card: #ffffff;
          --dm-card-soft: #fbfcfd;
          --dm-ink: #101318;
          --dm-muted: #7d8490;
          --dm-line: #e8e7ee;
          --dm-teal: #149d80;
          --dm-teal-dark: #0d8069;
          --dm-teal-soft: #e6f6f1;
          --dm-blue: #4f96ce;
          --dm-blue-soft: #e8f2fb;
          --dm-yellow-soft: #fff7df;
          --dm-shadow: 0 18px 46px rgba(24, 33, 49, .08);
          min-height: 100%;
          overflow-x: hidden;
          background: var(--dm-bg);
          color: var(--dm-ink);
        }

        .home-dumamed,
        .home-dumamed * {
          box-sizing: border-box;
          min-width: 0;
        }

        .home-dumamed a {
          color: inherit;
          text-decoration: none;
        }

        .home-dumamed .dm-shell {
          width: 100%;
          max-width: 100%;
          min-height: 100%;
          padding: 18px 16px 104px;
        }

        .home-dumamed .dm-topbar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(22px, 11vw, 54px);
          width: min(100%, 392px);
          max-width: 100%;
          min-height: 56px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 20px;
          padding: 8px 12px;
          border-radius: 18px;
          background: rgba(255, 255, 255, .74);
          box-shadow: 0 10px 30px rgba(24, 33, 49, .06);
        }

        .home-dumamed .dm-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border: 0;
          color: var(--dm-ink);
        }

        .home-dumamed .dm-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          flex: 0 1 auto;
          color: var(--dm-teal);
          font-size: 1.375rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: .04em;
          white-space: nowrap;
        }

        .home-dumamed .dm-brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--dm-teal);
          color: #fff;
        }

        .home-dumamed .dm-top-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .home-dumamed .dm-icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: rgba(255,255,255,.72);
        }

        .home-dumamed .dm-alert-dot {
          position: absolute;
          right: 7px;
          bottom: 8px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e05d63;
          box-shadow: 0 0 0 2px var(--dm-bg);
        }

        .home-dumamed .dm-signin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 12px;
          border-radius: 999px;
          background: #fff;
          color: var(--dm-teal-dark);
          font-size: .86rem;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(20, 157, 128, .12);
        }

        .home-dumamed .dm-section {
          margin-top: 24px;
        }

        .home-dumamed .dm-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .home-dumamed .dm-section-kicker {
          margin: 0 0 4px;
          color: var(--dm-teal);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .08em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .home-dumamed h1,
        .home-dumamed h2,
        .home-dumamed h3,
        .home-dumamed p {
          margin: 0;
        }

        .home-dumamed .dm-title {
          color: var(--dm-ink);
          font-size: clamp(1.28rem, 5.4vw, 1.45rem);
          font-weight: 900;
          line-height: 1.12;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .home-dumamed .dm-copy {
          color: var(--dm-muted);
          font-size: .92rem;
          line-height: 1.55;
        }

        .home-dumamed .dm-hero {
          display: grid;
          gap: 16px;
          padding: 20px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 84% 16%, rgba(255,255,255,.22), transparent 24%),
            linear-gradient(135deg, #169d82, #4fa7bc);
          color: #fff;
          box-shadow: 0 20px 44px rgba(20, 157, 128, .22);
        }

        .home-dumamed .dm-hero-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .home-dumamed .dm-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          max-width: 100%;
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.18);
          color: rgba(255,255,255,.9);
          font-size: .76rem;
          font-weight: 800;
        }

        .home-dumamed .dm-hero h1 {
          max-width: 15ch;
          font-size: clamp(2rem, 11vw, 3.05rem);
          font-weight: 900;
          line-height: 1.02;
        }

        .home-dumamed .dm-hero p {
          max-width: 34rem;
          color: rgba(255,255,255,.82);
          font-size: .96rem;
          line-height: 1.55;
        }

        .home-dumamed .dm-hero-actions {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
        }

        .home-dumamed .dm-primary-btn,
        .home-dumamed .dm-secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          padding: 0 16px;
          border-radius: 16px;
          font-weight: 900;
          line-height: 1;
        }

        .home-dumamed .dm-primary-btn {
          background: #fff;
          color: var(--dm-teal-dark);
        }

        .home-dumamed .dm-secondary-btn {
          border: 1px solid rgba(255,255,255,.32);
          color: #fff;
        }

        .home-dumamed .dm-service-grid,
        .home-dumamed .dm-action-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .home-dumamed .dm-service-card,
        .home-dumamed .dm-action-card,
        .home-dumamed .dm-panel,
        .home-dumamed .dm-contact-card {
          border: 1px solid rgba(232, 231, 238, .9);
          background: var(--dm-card);
          box-shadow: var(--dm-shadow);
        }

        .home-dumamed .dm-service-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 136px;
          padding: 16px;
          border-radius: 22px;
          overflow: hidden;
        }

        .home-dumamed .dm-service-card:nth-child(3) {
          grid-column: 1 / -1;
          min-height: 112px;
        }

        .home-dumamed .dm-service-card.dm-blue {
          background: linear-gradient(135deg, #4f96ce, #63b5bf);
          color: #fff;
        }

        .home-dumamed .dm-service-card.dm-teal {
          background: linear-gradient(135deg, #54aaa9, #169d82);
          color: #fff;
        }

        .home-dumamed .dm-service-card.dm-green {
          background: #fff;
          color: var(--dm-ink);
        }

        .home-dumamed .dm-service-icon {
          align-self: flex-end;
          color: currentColor;
          opacity: .86;
        }

        .home-dumamed .dm-service-card h3 {
          max-width: 13ch;
          font-size: 1.04rem;
          font-weight: 900;
          line-height: 1.24;
        }

        .home-dumamed .dm-service-card p {
          margin-top: 7px;
          color: currentColor;
          font-size: .78rem;
          line-height: 1.42;
          opacity: .78;
        }

        .home-dumamed .dm-action-card {
          display: flex;
          min-height: 136px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 16px 12px;
          border-radius: 22px;
          text-align: center;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .home-dumamed .dm-action-card:active {
          transform: scale(.985);
        }

        .home-dumamed .dm-action-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: var(--dm-teal-soft);
          color: var(--dm-teal);
        }

        .home-dumamed .dm-action-card span {
          color: var(--dm-ink);
          font-size: 1.04rem;
          font-weight: 800;
          line-height: 1.22;
        }

        .home-dumamed .dm-panel {
          padding: 18px;
          border-radius: 24px;
        }

        .home-dumamed .dm-panel-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .home-dumamed .dm-panel-title {
          display: flex;
          align-items: center;
          gap: 11px;
          font-weight: 900;
          line-height: 1.25;
        }

        .home-dumamed .dm-panel-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          border-radius: 50%;
          background: var(--dm-blue-soft);
          color: var(--dm-blue);
        }

        .home-dumamed .dm-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .home-dumamed .dm-stat {
          padding: 12px 10px;
          border-radius: 18px;
          background: #f7f8fb;
          text-align: center;
        }

        .home-dumamed .dm-stat strong {
          display: block;
          color: var(--dm-ink);
          font-size: 1.18rem;
          line-height: 1;
        }

        .home-dumamed .dm-stat span {
          display: block;
          margin-top: 7px;
          color: var(--dm-muted);
          font-size: .68rem;
          line-height: 1.2;
        }

        .home-dumamed .dm-workflow {
          display: grid;
          gap: 10px;
        }

        .home-dumamed .dm-workflow-item {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 14px;
          border: 1px solid var(--dm-line);
          border-radius: 18px;
          background: #fff;
        }

        .home-dumamed .dm-workflow-step {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--dm-teal-soft);
          color: var(--dm-teal-dark);
          font-size: .82rem;
          font-weight: 900;
        }

        .home-dumamed .dm-workflow-item h3 {
          color: var(--dm-ink);
          font-size: .95rem;
          font-weight: 900;
          line-height: 1.2;
        }

        .home-dumamed .dm-workflow-item p {
          margin-top: 3px;
          color: var(--dm-muted);
          font-size: .78rem;
          line-height: 1.35;
        }

        .home-dumamed .dm-pricing-grid {
          display: grid;
          gap: 14px;
        }

        .home-dumamed .dm-plan-card {
          display: grid;
          gap: 14px;
          padding: 20px;
          border: 1px solid rgba(232, 231, 238, .9);
          border-radius: 24px;
          background: var(--dm-card);
          box-shadow: var(--dm-shadow);
        }

        .home-dumamed .dm-plan-card.highlighted {
          border-color: rgba(20, 157, 128, .28);
          background:
            linear-gradient(180deg, rgba(230, 246, 241, .72), #fff 38%);
        }

        .home-dumamed .dm-plan-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .home-dumamed .dm-plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          background: var(--dm-teal-soft);
          color: var(--dm-teal-dark);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .home-dumamed .dm-plan-card.highlighted .dm-plan-badge {
          background: #f2efff;
          color: #6d58c8;
        }

        .home-dumamed .dm-plan-price {
          color: var(--dm-ink);
          font-size: clamp(1.8rem, 8vw, 2.2rem);
          font-weight: 900;
          line-height: 1;
        }

        .home-dumamed .dm-plan-period {
          margin-top: 4px;
          color: var(--dm-muted);
          font-size: .76rem;
          font-weight: 700;
        }

        .home-dumamed .dm-plan-desc {
          color: var(--dm-muted);
          font-size: .86rem;
          line-height: 1.5;
        }

        .home-dumamed .dm-plan-features {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .home-dumamed .dm-plan-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: var(--dm-ink);
          font-size: .82rem;
          line-height: 1.4;
        }

        .home-dumamed .dm-plan-features svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: var(--dm-teal);
        }

        .home-dumamed .dm-plan-card.highlighted .dm-plan-features svg {
          color: #6d58c8;
        }

        .home-dumamed .dm-plan-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 48px;
          border-radius: 16px;
          font-weight: 900;
        }

        .home-dumamed .dm-plan-cta.primary {
          background: var(--dm-teal);
          color: #fff;
        }

        .home-dumamed .dm-plan-cta.secondary {
          border: 1px solid var(--dm-line);
          background: #fff;
          color: var(--dm-ink);
        }

        .home-dumamed .dm-plan-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 18px;
          background: var(--dm-yellow-soft);
          color: #7a5d08;
          font-size: .8rem;
          line-height: 1.45;
        }

        .home-dumamed .dm-contact-card {
          display: grid;
          gap: 16px;
          padding: 20px;
          border-radius: 26px;
        }

        .home-dumamed .dm-contact-card form {
          display: grid;
          gap: 10px;
          max-width: none;
          margin: 0;
        }

        .home-dumamed .dm-contact-card input,
        .home-dumamed .dm-contact-card textarea {
          width: 100%;
          border: 1px solid var(--dm-line);
          border-radius: 16px;
          background: #f8f8fb;
          color: var(--dm-ink);
          font: inherit;
          padding: 13px 14px;
          outline: 0;
        }

        .home-dumamed .dm-contact-card textarea {
          resize: vertical;
          min-height: 108px;
        }

        .home-dumamed .dm-contact-card input:focus,
        .home-dumamed .dm-contact-card textarea:focus {
          border-color: rgba(20, 157, 128, .55);
          box-shadow: 0 0 0 4px rgba(20, 157, 128, .12);
          background: #fff;
        }

        .home-dumamed .dm-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 52px;
          border: 0;
          border-radius: 16px;
          background: var(--dm-teal);
          color: #fff;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .home-dumamed .dm-submit:disabled {
    opacity: .65;
    cursor: not-allowed;
  }

  .home-dumamed .dm-form-note {
    margin-top: 10px;
    font-size: .82rem;
    line-height: 1.45;
  }

  .home-dumamed .dm-form-note.success { color: #0d8069; font-weight: 700; }
  .home-dumamed .dm-form-note.error { color: #c0392b; font-weight: 700; }

  .home-dumamed .dm-bottom-tabs {
          position: sticky;
          z-index: 20;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 4px;
          width: 100%;
          margin: 28px 0 -104px;
          padding: 10px 10px max(10px, env(safe-area-inset-bottom));
          border-top: 1px solid rgba(200, 202, 210, .65);
          border-radius: 22px 22px 0 0;
          background: rgba(255,255,255,.92);
          backdrop-filter: blur(14px);
        }

        .home-dumamed .dm-tab {
          display: inline-flex;
          min-height: 56px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border-radius: 14px;
          color: #8a8d93;
          font-size: .72rem;
          font-weight: 800;
          line-height: 1;
        }

        .home-dumamed .dm-tab svg {
          width: 25px;
          height: 25px;
        }

        .home-dumamed .dm-tab.active {
          color: var(--dm-ink);
        }

        @media (max-width: 360px) {
          .home-dumamed .dm-shell {
            padding-left: 12px;
            padding-right: 12px;
          }

          .home-dumamed .dm-brand {
            font-size: 1.25rem;
          }

          .home-dumamed .dm-brand-mark {
            width: 31px;
            height: 31px;
          }

          .home-dumamed .dm-top-actions {
            gap: 5px;
          }

          .home-dumamed .dm-signin span {
            display: none;
          }

          .home-dumamed .dm-signin {
            width: 40px;
            padding: 0;
          }

          .home-dumamed .dm-hero-actions,
          .home-dumamed .dm-service-grid,
          .home-dumamed .dm-action-grid,
          .home-dumamed .dm-stat-grid {
            grid-template-columns: 1fr;
          }

          .home-dumamed .dm-service-card:nth-child(3) {
            grid-column: auto;
          }
        }

        @media (min-width: 700px) {
          .home-dumamed .dm-shell {
            max-width: 680px;
            margin: 0 auto;
            padding-top: 28px;
          }

          .home-dumamed .dm-contact-card {
            grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
            align-items: start;
          }

          .home-dumamed .dm-pricing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <main className="dm-shell">
        <header className="dm-topbar" aria-label="Home">
          <div className="dm-brand" aria-label="MedWaste">
            <span className="dm-brand-mark"><Activity size={21} strokeWidth={2.5} /></span>
            MEDWASTE
          </div>
          <div className="dm-top-actions">
            <Link className="dm-signin" to="/login" aria-label="Sign in">
              <LogIn size={18} strokeWidth={2.4} />
              <span>Sign in</span>
            </Link>
          </div>
        </header>

        <section className="dm-hero" aria-labelledby="home-hero-title">
          <div className="dm-hero-top">
            <span className="dm-hero-badge">
              <HeartPulse size={16} strokeWidth={2.4} />
              Clinical waste intelligence
            </span>
            <span className="dm-icon-btn" aria-hidden="true">
              <ShieldCheck size={23} strokeWidth={2.3} />
              <span className="dm-alert-dot" />
            </span>
          </div>
          <h1 id="home-hero-title">Medical waste made visible.</h1>
          <p>Monitor containers, routes, alerts, and facility performance from one clean healthcare dashboard.</p>
          <div className="dm-hero-actions">
            <Link to="/login" className="dm-primary-btn">
              Get started
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <Link to="/register" className="dm-secondary-btn">Register</Link>
          </div>
        </section>

        <section className="dm-section" aria-labelledby="services-title">
          <div className="dm-section-head">
            <div>
              <p className="dm-section-kicker">Services</p>
              <h2 id="services-title" className="dm-title">Fast actions</h2>
            </div>
            <Grid3x3 color="#149d80" size={24} strokeWidth={2.4} aria-hidden="true" />
          </div>
          <div className="dm-service-grid">
            {serviceCards.map(({ icon: Icon, title, text, tone }) => (
              <article className={`dm-service-card dm-${tone}`} key={title}>
                <Icon className="dm-service-icon" size={38} strokeWidth={2.1} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="dm-section" aria-labelledby="features-title">
          <div className="dm-section-head">
            <div>
              <p className="dm-section-kicker">Dashboard</p>
              <h2 id="features-title" className="dm-title">Core modules</h2>
            </div>
            <Link to="/login" className="dm-copy">Open</Link>
          </div>
          <div className="dm-action-grid">
            {quickActions.map(({ icon: Icon, title, to }) => (
              <Link className="dm-action-card" to={to} key={title}>
                <span className="dm-action-icon">
                  <Icon size={28} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <span>{title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="dm-section" aria-labelledby="about-title">
          <div className="dm-panel">
            <div className="dm-panel-row">
              <div className="dm-panel-title">
                <span className="dm-panel-icon">
                  <ChartColumn size={24} strokeWidth={2.35} aria-hidden="true" />
                </span>
                <div>
                  <p className="dm-section-kicker">Overview</p>
                  <h2 id="about-title" className="dm-title">Operational health</h2>
                </div>
              </div>
              <ChevronRight color="#c4c8cf" size={28} aria-hidden="true" />
            </div>
            <div className="dm-stat-grid">
              {stats.map(({ label, value }) => (
                <div className="dm-stat" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="subscriptions" className="dm-section" aria-labelledby="subscriptions-title">
          <div className="dm-section-head">
            <div>
              <p className="dm-section-kicker">B2B SaaS</p>
              <h2 id="subscriptions-title" className="dm-title">Subscription plans</h2>
            </div>
            <Users color="#149d80" size={24} strokeWidth={2.4} aria-hidden="true" />
          </div>
          <p className="dm-copy" style={{ marginBottom: 14 }}>
            Each healthcare organization gets an isolated tenant with its own users, containers, and dispatch workflows.
          </p>
          <div className="dm-pricing-grid">
            {subscriptionPlans.map((plan) => {
              const PlanIcon = plan.icon;
              return (
                <article
                  key={plan.id}
                  className={`dm-plan-card${plan.highlighted ? ' highlighted' : ''}`}
                >
                  <div className="dm-plan-top">
                    <span className="dm-plan-badge">
                      <PlanIcon size={14} strokeWidth={2.4} aria-hidden="true" />
                      {plan.name}
                    </span>
                    {plan.highlighted && (
                      <span className="dm-plan-badge" style={{ background: '#fff7df', color: '#8a5a0a' }}>
                        <Zap size={14} strokeWidth={2.4} aria-hidden="true" />
                        Popular
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="dm-plan-price">{plan.price}</div>
                    <div className="dm-plan-period">{plan.period}</div>
                  </div>
                  <p className="dm-plan-desc">{plan.description}</p>
                  <ul className="dm-plan-features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={`dm-plan-cta ${plan.highlighted ? 'primary' : 'secondary'}`}
                  >
                    {plan.id === 'premium' ? 'Contact sales' : 'Start free'}
                    <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="dm-plan-note" style={{ marginTop: 14 }}>
            <ShieldCheck size={18} strokeWidth={2.3} aria-hidden="true" />
            <span>
              Platform admins manage organizations, subscription limits, and user accounts.
              Dispatch teams work inside their company tenant on the personnel dashboard.
            </span>
          </div>
        </section>

        <section id="workflow" className="dm-section" aria-labelledby="workflow-title">
          <div className="dm-section-head">
            <div>
              <p className="dm-section-kicker">Workflow</p>
              <h2 id="workflow-title" className="dm-title">Designed for safe handling</h2>
            </div>
          </div>
          <div className="dm-workflow">
            <article className="dm-workflow-item">
              <span className="dm-workflow-step">1</span>
              <div>
                <h3>Scan and identify</h3>
                <p>Use container records to keep every unit traceable.</p>
              </div>
              <Check color="#149d80" size={22} strokeWidth={2.5} aria-hidden="true" />
            </article>
            <article className="dm-workflow-item">
              <span className="dm-workflow-step">2</span>
              <div>
                <h3>Monitor status</h3>
                <p>Review fill levels, alerts, and location updates.</p>
              </div>
              <Check color="#149d80" size={22} strokeWidth={2.5} aria-hidden="true" />
            </article>
            <article className="dm-workflow-item">
              <span className="dm-workflow-step">3</span>
              <div>
                <h3>Dispatch collection</h3>
                <p>Coordinate driver tasks and route history.</p>
              </div>
              <Truck color="#149d80" size={23} strokeWidth={2.3} aria-hidden="true" />
            </article>
          </div>
        </section>

        <section id="contact" className="dm-section" aria-labelledby="contact-title">
          <div className="dm-contact-card">
            <div>
              <p className="dm-section-kicker">Contact</p>
              <h2 id="contact-title" className="dm-title">Ready to modernize your facility?</h2>
              <p className="dm-copy">Send a message and keep the existing workflow intact while improving visibility.</p>
            </div>
            <form onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Your name"
                required
                minLength={2}
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                type="email"
                placeholder="Your email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
              />
              <textarea
                placeholder="Your message"
                rows="4"
                required
                minLength={10}
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
              />
              <button type="submit" className="dm-submit" disabled={contactSubmitting}>
                {contactSubmitting ? 'Sending...' : 'Send message'}
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
              {contactFeedback && (
                <p className={`dm-form-note ${contactFeedback.type}`} role="status">
                  {contactFeedback.text}
                </p>
              )}
            </form>
          </div>
        </section>

        <nav className="dm-bottom-tabs" aria-label="Home sections">
          {bottomTabs.map(({ icon: Icon, label, href, active }) => (
            <a className={`dm-tab${active ? ' active' : ''}`} href={href} key={label}>
              <Icon strokeWidth={active ? 2.6 : 2.1} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Home;
