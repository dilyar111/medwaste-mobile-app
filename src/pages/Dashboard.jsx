import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
  Bell,
  Boxes,
  Building2,
  ChartColumn,
  CircleAlert,
  CircleCheck,
  Clock,
  Gauge,
  LayoutDashboard,
  MapPin,
  PackageCheck,
  RefreshCw,
  Route,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
} from "lucide-react";
import { getBins, getPredict, getAlerts, getNotifications, markRead } from "../services/api";
import { useSocket } from "../hooks/useSocket";
import ContainerDualView from "../components/ContainerDualView";

const css = `
  .db-root {
    --db-bg: #f4f3f8;
    --db-card: #ffffff;
    --db-ink: #101318;
    --db-muted: #7d8490;
    --db-line: #e7e7ef;
    --db-teal: #149d80;
    --db-teal-dark: #0d8069;
    --db-teal-soft: #e7f6f1;
    --db-blue: #4f96ce;
    --db-blue-soft: #e8f2fb;
    --db-warning: #f4a62a;
    --db-danger: #e05d63;
    --db-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    background: var(--db-bg);
    color: var(--db-ink);
  }

  .db-root,
  .db-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .db-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    min-height: 64px;
    padding: 12px clamp(16px, 3vw, 28px);
    border-bottom: 1px solid rgba(231, 231, 239, .82);
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(16px);
    box-shadow: 0 1px 8px rgba(24, 33, 49, .05);
  }

  .db-brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: var(--db-teal);
    font-size: 1.12rem;
    font-weight: 900;
    letter-spacing: .03em;
    white-space: nowrap;
  }

  .db-brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--db-teal);
    color: #fff;
    box-shadow: 0 10px 24px rgba(20,157,128,.20);
  }

  .db-nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .db-user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 100%;
    padding: 6px 10px 6px 6px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 999px;
    background: #fff;
    color: var(--db-ink);
    box-shadow: 0 8px 22px rgba(24, 33, 49, .05);
    font-size: .82rem;
    font-weight: 800;
  }

  .db-user-pill span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .db-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
    border-radius: 50%;
    background: var(--db-teal-soft);
    color: var(--db-teal-dark);
    font-weight: 900;
    font-size: .78rem;
  }

  .db-role-badge {
    flex: 0 0 auto;
    padding: 3px 8px;
    border-radius: 999px;
    background: #f7f8fb;
    color: var(--db-muted);
    font-size: .68rem;
    font-weight: 900;
  }

  .db-main {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: clamp(16px, 3vw, 28px);
  }

  .db-notification-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 16px;
    padding: 14px 16px;
    border: 1px solid rgba(20,157,128,.22);
    border-radius: 18px;
    background: #ecfdf7;
    color: var(--db-teal-dark);
    box-shadow: 0 6px 18px rgba(20,157,128,.06);
  }

  .db-notification-banner strong {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: .9rem;
    line-height: 1.25;
  }

  .db-notification-banner p {
    margin: 5px 0 0;
    color: #315d53;
    font-size: .82rem;
    line-height: 1.42;
  }

  .db-icon-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border: 0;
    border-radius: 50%;
    background: rgba(255,255,255,.74);
    color: var(--db-teal-dark);
    cursor: pointer;
    transition: background .2s ease, transform .2s ease;
  }

  .db-icon-close:hover {
    background: #fff;
    transform: translateY(-1px);
  }

  .db-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .db-page-kicker {
    margin: 0 0 5px;
    color: var(--db-teal);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .db-page-header h1 {
    margin: 0;
    color: var(--db-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .db-page-header p {
    margin: 6px 0 0;
    color: var(--db-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .db-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  .db-toolbar-left,
  .db-toolbar-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .db-status-badge,
  .db-autorefresh {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 36px;
    padding: 7px 11px;
    border: 1px solid rgba(231,231,239,.9);
    border-radius: 999px;
    background: #fff;
    color: var(--db-muted);
    font-size: .78rem;
    font-weight: 800;
    box-shadow: 0 8px 22px rgba(24, 33, 49, .05);
  }

  .db-status-badge {
    border-color: rgba(20,157,128,.18);
    background: var(--db-teal-soft);
    color: var(--db-teal-dark);
  }

  .db-online-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: var(--db-teal);
    box-shadow: 0 0 0 0 rgba(20,157,128,.48);
    animation: dbPulse 1.8s infinite;
  }

  @keyframes dbPulse {
    70% { box-shadow: 0 0 0 9px rgba(20,157,128,0); }
    100% { box-shadow: 0 0 0 0 rgba(20,157,128,0); }
  }

  .db-period-tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid rgba(231,231,239,.9);
    border-radius: 999px;
    background: rgba(255,255,255,.74);
  }

  .db-period-tabs button {
    min-height: 30px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--db-muted);
    cursor: pointer;
    font: inherit;
    font-size: .78rem;
    font-weight: 900;
    transition: color .2s ease, background .2s ease, box-shadow .2s ease;
  }

  .db-period-tabs button.active {
    background: #fff;
    color: var(--db-teal-dark);
    box-shadow: 0 8px 18px rgba(24, 33, 49, .08);
  }

  .db-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 13px;
    border: 0;
    border-radius: 14px;
    cursor: pointer;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .db-btn-ghost {
    border: 1px solid rgba(231,231,239,.92);
    background: #fff;
    color: var(--db-teal-dark);
    box-shadow: 0 8px 22px rgba(24, 33, 49, .05);
  }

  .db-btn-ghost:hover,
  .db-action-btn:hover,
  .db-pred-btn:hover {
    transform: translateY(-1px);
  }

  .db-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }

  .db-stat-card,
  .db-card,
  .db-pred-card,
  .db-action-btn {
    border: 1px solid rgba(231,231,239,.92);
    background: rgba(255,255,255,.94);
    box-shadow: var(--db-shadow);
  }

  .db-stat-card {
    position: relative;
    overflow: hidden;
    min-height: 122px;
    padding: 16px 18px;
    border-radius: 18px;
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .db-stat-card:hover,
  .db-pred-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(24, 33, 49, .08);
  }

  .db-stat-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }

  .db-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 12px;
    background: var(--db-teal-soft);
    color: var(--db-teal);
  }

  .db-stat-label {
    margin: 0;
    color: var(--db-muted);
    font-size: .74rem;
    font-weight: 900;
    line-height: 1.25;
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  .db-stat-value {
    margin: 0 0 8px;
    color: var(--db-ink);
    font-size: clamp(1.35rem, 5vw, 1.7rem);
    font-weight: 900;
    line-height: 1;
  }

  .db-stat-delta,
  .db-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    width: fit-content;
    max-width: 100%;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .db-delta-up,
  .db-badge-green { background: var(--db-teal-soft); color: var(--db-teal-dark); }
  .db-delta-down { background: #fff1f2; color: #b42335; }
  .db-delta-neu,
  .db-badge-blue { background: var(--db-blue-soft); color: #286b9d; }

  .db-stat-sub {
    margin-top: 8px;
    color: var(--db-muted);
    font-size: .78rem;
    line-height: 1.35;
  }

  .db-stat-forecast {
    margin-top: 7px;
    color: var(--db-teal-dark);
    font-size: .76rem;
    font-weight: 800;
    line-height: 1.35;
  }

  .db-two-col {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 16px;
    align-items: start;
    margin-bottom: 20px;
  }

  .db-card {
    padding: 18px 20px;
    border-radius: 18px;
    margin-bottom: 16px;
    transition: box-shadow .2s ease, border-color .2s ease;
  }

  .db-two-col > .db-card {
    margin-bottom: 0;
    height: 100%;
  }

  .db-card:hover {
    border-color: rgba(214, 218, 228, .95);
    box-shadow: 0 10px 26px rgba(24, 33, 49, .07);
  }

  .db-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .db-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--db-ink);
    font-size: .98rem;
    font-weight: 800;
    line-height: 1.25;
  }

  .db-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    border-radius: 10px;
    background: #f3f7f6;
    color: var(--db-teal);
  }

  .db-card-link {
    color: var(--db-teal-dark);
    text-decoration: none;
    font-size: .8rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .db-analytics-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
    border: 1px solid var(--db-line);
    border-radius: 12px;
    background: #f8f8fb;
  }

  .db-analytics-item {
    padding: 12px 10px;
    border-right: 1px solid var(--db-line);
    text-align: center;
  }

  .db-analytics-item:last-child { border-right: 0; }

  .db-analytics-val {
    color: var(--db-ink);
    font-size: 1.2rem;
    font-weight: 900;
    line-height: 1;
  }

  .db-analytics-label {
    margin-top: 6px;
    color: var(--db-muted);
    font-size: .72rem;
    line-height: 1.25;
  }

  .db-chart-area {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    height: 132px;
    margin-top: 14px;
    padding: 10px;
    overflow: hidden;
    border: 1px solid var(--db-line);
    border-radius: 12px;
    background: #fbfcfd;
  }

  .db-bar {
    flex: 1;
    min-width: 3px;
    border-radius: 999px 999px 2px 2px;
    background: linear-gradient(180deg, var(--db-blue), var(--db-teal));
    opacity: .76;
    transition: opacity .2s ease, transform .2s ease;
  }

  .db-bar:hover {
    opacity: 1;
    transform: scaleY(1.02);
  }

  .db-chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
  }

  .db-legend-item,
  .db-waste-label {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--db-muted);
    font-size: .76rem;
  }

  .db-legend-dot,
  .db-waste-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
  }

  .db-donut-wrap {
    display: grid;
    justify-items: center;
    gap: 14px;
  }

  .db-donut {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 104px;
    height: 104px;
    border-radius: 50%;
  }

  .db-donut-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 74px;
    height: 74px;
    border-radius: 50%;
    background: #fff;
    box-shadow: inset 0 0 0 1px rgba(231,231,239,.9);
  }

  .db-donut-pct {
    color: var(--db-ink);
    font-size: 1.08rem;
    font-weight: 900;
    line-height: 1;
  }

  .db-donut-sub {
    max-width: 58px;
    margin-top: 4px;
    overflow: hidden;
    color: var(--db-muted);
    font-size: .62rem;
    line-height: 1.15;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .db-waste-types {
    width: 100%;
  }

  .db-waste-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 7px;
  }

  .db-waste-label span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .db-waste-bar-wrap,
  .db-pred-conf-bar {
    overflow: hidden;
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: #eef0f5;
  }

  .db-waste-bar-fill,
  .db-pred-conf-fill {
    height: 100%;
    border-radius: 999px;
  }

  .db-waste-pct {
    color: var(--db-ink);
    font-size: .76rem;
    font-weight: 900;
  }

  .db-predictions-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .db-pred-card {
    padding: 14px;
    border-radius: 16px;
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .db-pred-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .db-pred-head .db-badge {
    flex: 0 0 auto;
    align-self: center;
    white-space: nowrap;
  }

  .db-pred-head .db-badge svg {
    flex: 0 0 auto;
  }

  .db-pred-id {
    overflow-wrap: anywhere;
    color: var(--db-ink);
    font-size: .92rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .db-pred-meta {
    margin-top: 3px;
    overflow-wrap: anywhere;
    color: var(--db-muted);
    font-size: .74rem;
    line-height: 1.35;
  }

  .db-pred-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
    font-size: .78rem;
    line-height: 1.35;
  }

  .db-pred-row-label {
    flex: 0 0 auto;
    color: var(--db-muted);
  }

  .db-pred-row-val {
    color: var(--db-ink);
    font-weight: 800;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .db-pred-note {
    display: flex;
    gap: 6px;
    margin: 8px 0;
    color: #9a650b;
    font-size: .72rem;
    line-height: 1.35;
  }

  .db-pred-confidence {
    margin-top: 10px;
  }

  .db-pred-conf-fill {
    background: linear-gradient(90deg, var(--db-blue), var(--db-teal));
  }

  .db-pred-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    min-height: 38px;
    margin-top: 12px;
    border: 1px solid rgba(20,157,128,.28);
    border-radius: 12px;
    background: #fff;
    color: var(--db-teal-dark);
    cursor: pointer;
    font: inherit;
    font-size: .8rem;
    font-weight: 900;
    text-decoration: none;
    transition: transform .2s ease, background .2s ease, color .2s ease;
  }

  .db-pred-btn:hover {
    background: var(--db-teal);
    color: #fff;
  }

  .db-attention-empty {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 22px 18px;
    color: var(--db-muted);
    text-align: center;
    font-size: .85rem;
  }

  .db-attention-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--db-teal-soft);
    color: var(--db-teal);
  }

  .db-alert-list,
  .db-notification-list,
  .db-settings-list {
    display: grid;
    gap: 10px;
  }

  .db-alert-item,
  .db-notification-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid var(--db-line);
    background: #fff;
  }

  .db-alert-item.critical {
    border-color: rgba(224,93,99,.22);
    background: #fff1f2;
    color: #991b1b;
  }

  .db-alert-item.warning {
    border-color: rgba(244,166,42,.24);
    background: #fff8e8;
    color: #8a5a0a;
  }

  .db-alert-title,
  .db-notification-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: .84rem;
    font-weight: 900;
    line-height: 1.3;
  }

  .db-alert-message,
  .db-notification-message {
    margin-top: 4px;
    color: #667085;
    font-size: .75rem;
    line-height: 1.35;
  }

  .db-alert-time {
    margin-top: 5px;
    color: rgba(16,19,24,.52);
    font-size: .68rem;
  }

  .db-actions-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .db-action-link {
    color: inherit;
    text-decoration: none;
  }

  .db-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 86px;
    padding: 10px 8px;
    border-radius: 14px;
    color: var(--db-ink);
    text-align: center;
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .db-action-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: #f3f7f6;
    color: var(--db-teal);
  }

  .db-action-label {
    font-size: .76rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .db-settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(231,231,239,.72);
  }

  .db-settings-row:last-child {
    border-bottom: 0;
  }

  .db-settings-name {
    color: var(--db-ink);
    font-size: .84rem;
    font-weight: 900;
    line-height: 1.3;
  }

  .db-settings-sub {
    margin-top: 3px;
    color: var(--db-muted);
    font-size: .74rem;
  }

  .db-toggle {
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    display: inline-flex;
    width: 51px;
    height: 31px;
    flex: 0 0 51px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    transition: background-color .2s ease;
  }

  .db-toggle.on { background: var(--db-teal); }
  .db-toggle.off { background: #d8dbe3; }

  .db-toggle::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(24,33,49,.22);
    transition: transform .2s ease;
  }

  .db-toggle.on::after {
    transform: translateX(20px);
  }

  .db-notifications-title {
    margin: 16px 0 9px;
    padding-top: 14px;
    border-top: 1px solid rgba(231,231,239,.82);
    color: var(--db-muted);
    font-size: .74rem;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .db-skeleton {
    border-radius: 14px;
    background: linear-gradient(90deg, #f4f5f8 25%, #e9ebf1 50%, #f4f5f8 75%);
    background-size: 200% 100%;
    animation: dbShimmer 1.4s infinite;
  }

  @keyframes dbShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media(max-width: 1100px) {
    .db-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .db-two-col { grid-template-columns: 1fr; }
    .db-predictions-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .db-actions-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  @media(max-width: 640px) {
    .db-topbar { padding: 10px 14px; }
    .db-brand { font-size: 1rem; }
    .db-main { padding: 14px; }
    .db-page-header,
    .db-toolbar,
    .db-toolbar-left,
    .db-toolbar-actions {
      align-items: stretch;
      flex-direction: column;
    }
    .db-period-tabs,
    .db-toolbar-actions,
    .db-btn {
      width: 100%;
    }
    .db-period-tabs button { flex: 1; }
    .db-stats-grid,
    .db-predictions-grid {
      grid-template-columns: 1fr;
    }
    .db-analytics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .db-analytics-item {
      border-right: 0;
      border-bottom: 1px solid var(--db-line);
    }
    .db-analytics-item:nth-child(odd) { border-right: 1px solid var(--db-line); }
    .db-analytics-item:nth-child(n+3) { border-bottom: 0; }
    .db-actions-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .db-card,
    .db-stat-card {
      border-radius: 16px;
      padding: 14px;
    }
    .db-chart-area { height: 118px; padding: 10px; gap: 3px; }
    .db-card-header {
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }
`;

function statIconFor(title) {
  if (title.includes("Total")) return Boxes;
  if (title.includes("Average")) return Gauge;
  if (title.includes("Attention")) return CircleAlert;
  return Activity;
}

function StatCard({ title, value, delta, deltaType = "neu", subtitle, forecast, loading }) {
  const Icon = statIconFor(title);
  const DeltaIcon = deltaType === "down" ? CircleAlert : deltaType === "up" ? ChartColumn : Clock;

  return (
    <div className="db-stat-card">
      <div className="db-stat-head">
        <div>
          <p className="db-stat-label">{title}</p>
        </div>
        <span className="db-stat-icon">
          <Icon size={21} strokeWidth={2.25} aria-hidden="true" />
        </span>
      </div>
      {loading ? (
        <div className="db-skeleton" style={{ height: 32, marginBottom: 10 }} />
      ) : (
        <div className="db-stat-value">{value}</div>
      )}
      <span className={`db-stat-delta db-delta-${deltaType}`}>
        <DeltaIcon size={13} strokeWidth={2.5} aria-hidden="true" />
        {delta}
      </span>
      <div className="db-stat-sub">{subtitle}</div>
      {forecast && <div className="db-stat-forecast">{forecast}</div>}
    </div>
  );
}

function PredCard({ bin, pred, scheduleTo }) {
  const binId = bin.qrCode || bin._id;
  const formatTs = (ts) => ts ? new Date(ts * 1000).toLocaleString() : "-";
  return (
    <div className="db-pred-card">
      <div className="db-pred-head">
        <div>
          <div className="db-pred-id">{binId}</div>
          <div className="db-pred-meta">{bin.locationName || "-"} / {bin.wasteType || "-"}</div>
        </div>
        <span className="db-badge db-badge-green">
          <Activity size={12} strokeWidth={2.5} aria-hidden="true" />
          Live
        </span>
      </div>
      <div className="db-pred-row">
        <span className="db-pred-row-label">Full at</span>
        <span className="db-pred-row-val">{formatTs(pred?.target_timestamp)}</span>
      </div>
      <div className="db-pred-row">
        <span className="db-pred-row-label">Hours until full</span>
        <span className="db-pred-row-val">
          {pred?.hours_until_full ?? pred?.predictedHoursToFull ?? "-"}
          {(pred?.hours_until_full ?? pred?.predictedHoursToFull) != null ? "h" : ""}
        </span>
      </div>
      {pred?.note && (
        <div className="db-pred-note">
          <CircleAlert size={14} strokeWidth={2.4} aria-hidden="true" />
          {pred.note}
        </div>
      )}
      <div className="db-pred-confidence">
        <div className="db-pred-row">
          <span className="db-pred-row-label">Confidence</span>
          <span className="db-pred-row-val" style={{ color: "#0d8069" }}>{pred?.confidence ?? "-"}{pred?.confidence != null ? "%" : ""}</span>
        </div>
        <div className="db-pred-conf-bar">
          <div className="db-pred-conf-fill" style={{ width: `${pred?.confidence ?? 0}%` }} />
        </div>
      </div>
      <Link
        className="db-pred-btn"
        to={scheduleTo}
        state={{ containerId: binId }}
        title="Open dispatch to assign this pickup"
      >
        <Truck size={16} strokeWidth={2.35} aria-hidden="true" />
        Schedule Pickup
      </Link>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      className={`db-toggle ${on ? "on" : "off"}`}
      onClick={onToggle}
      type="button"
      aria-pressed={on}
    />
  );
}

function CardTitle({ icon: Icon, children }) {
  return (
    <span className="db-card-title">
      <span className="db-title-icon">
        <Icon size={18} strokeWidth={2.3} aria-hidden="true" />
      </span>
      {children}
    </span>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const username = sessionStorage.getItem("mw_name") || sessionStorage.getItem("mw_user") || "User";
  const role = sessionStorage.getItem("mw_role") || "personnel";

  useEffect(() => {
    if (sessionStorage.getItem("mw_logged_in") !== "true") navigate("/");
  }, [navigate]);

  const [bins, setBins] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifBanner, setNotifBanner] = useState(null);
  const [period, setPeriod] = useState("Month");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    autoRefresh: true, aiPredictions: true, analytics: true, compact: false,
  });

  const totalBins = bins.length;
  const avgFullness = bins.length
    ? Math.round(bins.reduce((s, b) => s + (Number(b.fullness) || 0), 0) / bins.length)
    : 0;
  const critical = bins.filter(b => (Number(b.fullness) || 0) >= 80).length;
  const predictionValues = Object.values(predictions).filter((p) => p?.confidence != null);
  const avgConf = predictionValues.length
    ? Math.round(predictionValues.reduce((s, p) => s + (Number(p.confidence) || 0), 0) / predictionValues.length)
    : 0;
  const wasteTypes = Object.values(bins.reduce((acc, bin) => {
    const key = bin.wasteType || "Unknown";
    acc[key] = acc[key] || { name: key, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {})).map((entry) => ({
    ...entry,
    pct: totalBins ? Math.round((entry.count / totalBins) * 100) : 0,
  }));

  const fetchAll = async () => {
    try {
      const binsRes = await getBins({ period: period.toLowerCase() });
      setBins(binsRes.data);

      const binIds = binsRes.data.map(b => b._id);
      const predResults = await Promise.all(
        binIds.map(id => getPredict(id).then(r => ({ id, data: r.data })).catch(() => ({ id, data: null })))
      );
      const predMap = {};
      predResults.forEach(({ id, data }) => { if (data) predMap[id] = data; });
      setPredictions(predMap);

      const alertsRes = await getAlerts();
      setAlerts(alertsRes.data.filter(a => !a.resolved));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
      const unread = res.data.find(n => !n.read);
      if (unread) setNotifBanner(unread);
    } catch (err) {
      console.error("Notifications error:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchNotifications();
    const dataInterval = setInterval(fetchAll, 10000);
    const notifInterval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(notifInterval);
    };
  }, [period]);

  useSocket({
    "telemetry:update": ({ binId, fullness }) => {
      setBins(prev => {
        const exists = prev.find(b => b._id === binId);
        if (exists) return prev.map(b => b._id === binId ? { ...b, fullness } : b);
        fetchAll();
        return prev;
      });
    },
    "alert:new": (alert) => {
      setAlerts(prev => [alert, ...prev]);
    },
    "notification:new": (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setNotifBanner(notif);
    },
  });

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (notifBanner?._id === id) setNotifBanner(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSetting = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const barHeights = bins.map(b => Number(b.fullness) || 0);
  const wasteTypeColors = ["#149d80", "#4f96ce", "#f4a62a", "#8b7bd8"];
  const wasteDonutBackground = wasteTypes.length
    ? `conic-gradient(${wasteTypes.reduce((parts, waste, index) => {
        const start = wasteTypes.slice(0, index).reduce((sum, item) => sum + item.pct, 0) * 3.6;
        const end = start + waste.pct * 3.6;
        parts.push(`${wasteTypeColors[index % wasteTypeColors.length]} ${start}deg ${end}deg`);
        return parts;
      }, []).join(", ")})`
    : "conic-gradient(#e7e7ef 0deg 360deg)";
  const primaryWaste = wasteTypes[0] || { name: "-", pct: 0 };
  const schedulePickupPath = "/dashboard/alerts";
  const showDualView = role === "personnel";
  const canManualAssign = role === "personnel";

  const quickActions = [
    { icon: Boxes, label: "Bins", link: "/dashboard/containers" },
    { icon: MapPin, label: "Map", link: "/dashboard/map" },
    { icon: CircleAlert, label: "Alerts", link: "/dashboard/alerts" },
    { icon: ChartColumn, label: "Reports", link: "/dashboard/reports" },
    { icon: Route, label: "Routes", link: "/dashboard/routes-history" },
    { icon: User, label: "Profile", link: "/dashboard/profile" },
    ...(role === "admin" ? [
      { icon: Building2, label: "Organizations", link: "/dashboard/admin/organizations" },
      { icon: Users, label: "Users", link: "/dashboard/admin/users" },
      { icon: ShieldCheck, label: "Approvals", link: "/dashboard/approvals" },
    ] : []),
  ];

  return (
    <>
      <style>{css}</style>
      <div className="db-root">
        <div className="db-topbar">
          <div className="db-brand">
            <span className="db-brand-mark">
              <Activity size={20} strokeWidth={2.5} aria-hidden="true" />
            </span>
            MEDWASTE
          </div>
          <div className="db-nav-right">
            <div className="db-user-pill">
              <div className="db-avatar">{username.charAt(0).toUpperCase()}</div>
              <span>{username}</span>
              <span className="db-role-badge">{role}</span>
            </div>
          </div>
        </div>

        <div className="db-main">
          {notifBanner && (
            <div className="db-notification-banner">
              <div>
                <strong>
                  {notifBanner.type === "success" ? (
                    <CircleCheck size={18} strokeWidth={2.4} aria-hidden="true" />
                  ) : (
                    <Bell size={18} strokeWidth={2.4} aria-hidden="true" />
                  )}
                  {notifBanner.title}
                </strong>
                <p>{notifBanner.message}</p>
              </div>
              <button
                className="db-icon-close"
                onClick={() => handleMarkRead(notifBanner._id)}
                type="button"
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          )}

          <div className="db-page-header">
            <div>
              <p className="db-page-kicker">Operations</p>
              <h1>Monitoring Dashboard</h1>
              <p>Medical waste management with AI analytics</p>
            </div>
            <span className="db-status-badge">
              <span className="db-online-dot" />
              Online
            </span>
          </div>

          <div className="db-toolbar">
            <div className="db-toolbar-left">
              <div className="db-autorefresh">
                <RefreshCw size={15} strokeWidth={2.4} aria-hidden="true" />
                Auto-refresh 10s
              </div>
              <div className="db-period-tabs">
                {["Day", "Week", "Month", "Year"].map(p => (
                  <button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)} type="button">{p}</button>
                ))}
              </div>
            </div>
            <div className="db-toolbar-actions">
              <button className="db-btn db-btn-ghost" onClick={fetchAll} type="button">
                <RefreshCw size={16} strokeWidth={2.4} aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>

          <div className="db-stats-grid">
            <StatCard loading={loading} title="Total Bins" value={totalBins} delta="live" deltaType="neu" subtitle="Active in system" />
            <StatCard loading={loading} title="Average Fullness" value={`${avgFullness}%`} delta="live" deltaType={avgFullness > 70 ? "up" : "neu"} subtitle="Current average" />
            <StatCard loading={loading} title="Needs Attention" value={critical} delta={critical > 0 ? "Action" : "OK"} deltaType={critical > 0 ? "down" : "neu"} subtitle="Bins >= 80% full" forecast={critical > 0 ? `${critical} bin(s) need pickup` : "All bins normal"} />
            <StatCard loading={loading} title="AI Confidence" value={`${avgConf}%`} delta="live" deltaType="up" subtitle="Avg prediction accuracy" />
          </div>

          {showDualView && (
            <ContainerDualView
              bins={bins}
              predictions={predictions}
              loading={loading}
              manualAssign={canManualAssign}
            />
          )}

          <div className="db-two-col">
            <div className="db-card">
              <div className="db-card-header">
                <CardTitle icon={Gauge}>Fullness Overview</CardTitle>
                <Link to="/dashboard/containers" className="db-card-link">All containers</Link>
              </div>
              <div className="db-analytics-grid">
                {[
                  { val: totalBins, label: "Total bins" },
                  { val: `${avgFullness}%`, label: "Avg fullness" },
                  { val: critical, label: "Critical (>=80%)" },
                  { val: `${avgConf}%`, label: "AI confidence" },
                ].map(m => (
                  <div className="db-analytics-item" key={m.label}>
                    <div className="db-analytics-val">{loading ? "-" : m.val}</div>
                    <div className="db-analytics-label">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="db-chart-area">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="db-bar"
                    style={{ height: `${Math.max(h, 4)}%` }}
                    title={bins[i] ? `${bins[i]._id}: ${bins[i].fullness}%` : `${h}%`}
                  />
                ))}
              </div>
              <div className="db-chart-legend">
                <div className="db-legend-item"><div className="db-legend-dot" style={{ background: "#149d80" }} /> Fullness %</div>
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-header">
                <CardTitle icon={PackageCheck}>Waste Types</CardTitle>
              </div>
              <div className="db-donut-wrap">
                <div className="db-donut" style={{ background: wasteDonutBackground }}>
                  <div className="db-donut-inner">
                    <div className="db-donut-pct">{primaryWaste.pct}%</div>
                    <div className="db-donut-sub">{primaryWaste.name}</div>
                  </div>
                </div>
                <div className="db-waste-types">
                  {wasteTypes.length === 0 ? (
                    <div style={{ fontSize: "0.78rem", color: "#7d8490" }}>No waste type data</div>
                  ) : wasteTypes.map((waste, index) => (
                    <div key={waste.name}>
                      <div className="db-waste-row">
                        <div className="db-waste-label">
                          <div className="db-waste-dot" style={{ background: wasteTypeColors[index % wasteTypeColors.length] }} />
                          <span>{waste.name}</span>
                        </div>
                        <span className="db-waste-pct">{waste.pct}%</span>
                      </div>
                      <div className="db-waste-bar-wrap">
                        <div className="db-waste-bar-fill" style={{ width: `${waste.pct}%`, background: wasteTypeColors[index % wasteTypeColors.length] }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize: "0.72rem", color: "#7d8490", marginTop: 8 }}>
                    {totalBins} bins / {avgFullness}% avg filled
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="db-card">
            <div className="db-card-header db-predictions-header">
              <div className="db-predictions-title-row">
                <CardTitle icon={Activity}>AI Maintenance Predictions</CardTitle>
                <span className="db-badge db-badge-green">
                  <CircleCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                  Live / {Object.keys(predictions).length} bins
                </span>
              </div>
              <Link to="/dashboard/containers" className="db-card-link">View all</Link>
            </div>
            {loading ? (
              <div className="db-predictions-grid">
                {[1, 2, 3].map(i => <div key={i} className="db-skeleton" style={{ height: 180 }} />)}
              </div>
            ) : bins.length === 0 ? (
              <div style={{ textAlign: "center", padding: 34, color: "#7d8490", fontSize: ".86rem" }}>
                No bin data yet. Start the sensor to see predictions.
              </div>
            ) : (
              <div className="db-predictions-grid">
                {bins.slice(0, 6).map(bin => (
                  <PredCard
                    key={bin._id}
                    bin={bin}
                    pred={predictions[bin._id]}
                    scheduleTo={schedulePickupPath}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="db-card">
            <div className="db-card-header">
              <CardTitle icon={CircleAlert}>Needs Attention</CardTitle>
              <Link to="/dashboard/alerts" className="db-card-link">View all</Link>
            </div>
            {alerts.length === 0 ? (
              <div className="db-attention-empty">
                <div className="db-attention-icon">
                  <CircleCheck size={24} strokeWidth={2.4} aria-hidden="true" />
                </div>
                <p>All bins are normal. No attention needed.</p>
              </div>
            ) : (
              <div className="db-alert-list" style={{ maxHeight: 280, overflowY: "auto" }}>
                {alerts.slice(0, 5).map(alert => (
                  <div key={alert._id} className={`db-alert-item ${alert.severity === "critical" ? "critical" : "warning"}`}>
                    <div>
                      <div className="db-alert-title">
                        <CircleAlert size={17} strokeWidth={2.4} aria-hidden="true" />
                        {alert.title}
                      </div>
                      <div className="db-alert-message">{alert.message}</div>
                      <div className="db-alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="db-two-col">
            <div className="db-card">
              <div className="db-card-header">
                <CardTitle icon={LayoutDashboard}>Quick Actions</CardTitle>
              </div>
              <div className="db-actions-grid">
                {quickActions.map(({ icon: Icon, label, link }) => (
                  <Link to={link} key={label} className="db-action-link">
                    <div className="db-action-btn">
                      <span className="db-action-icon">
                        <Icon size={23} strokeWidth={2.25} aria-hidden="true" />
                      </span>
                      <span className="db-action-label">{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-header">
                <CardTitle icon={Settings}>Dashboard Settings</CardTitle>
              </div>
              <div className="db-settings-list">
                {[
                  { key: "autoRefresh", name: "Auto-refresh", sub: "Every 10 sec" },
                  { key: "aiPredictions", name: "AI Predictions", sub: "Machine learning" },
                  { key: "analytics", name: "Analytics", sub: "Advanced metrics" },
                  { key: "compact", name: "Compact view", sub: "Save space" },
                ].map(s => (
                  <div className="db-settings-row" key={s.key}>
                    <div>
                      <div className="db-settings-name">{s.name}</div>
                      <div className="db-settings-sub">{s.sub}</div>
                    </div>
                    <Toggle on={settings[s.key]} onToggle={() => toggleSetting(s.key)} />
                  </div>
                ))}
              </div>

              {notifications.filter(n => !n.read).length > 0 && (
                <div>
                  <div className="db-notifications-title">Notifications</div>
                  <div className="db-notification-list">
                    {notifications.filter(n => !n.read).map(n => (
                      <div key={n._id} className="db-notification-item">
                        <div>
                          <div className="db-notification-title" style={{ color: n.type === "success" ? "#0d8069" : "#b42335" }}>
                            {n.type === "success" ? (
                              <CircleCheck size={16} strokeWidth={2.4} aria-hidden="true" />
                            ) : (
                              <Bell size={16} strokeWidth={2.4} aria-hidden="true" />
                            )}
                            {n.title}
                          </div>
                          <div className="db-notification-message">{n.message}</div>
                        </div>
                        <button className="db-icon-close" onClick={() => handleMarkRead(n._id)} type="button" aria-label="Dismiss notification">x</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
