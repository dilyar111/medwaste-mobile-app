import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Building2,
  Grid3X3,
  LogOut,
  Mail,
  Menu,
  Recycle,
  Route,
  ShieldCheck,
  Trash2,
  Truck,
  User,
  Users,
} from "lucide-react";

const SIDEBAR_W = 286;
const DESKTOP_COLLAPSED_W = 60;
const DESKTOP_EXPANDED_W = 240;

const css = `
  .sb-shell {
    width:${DESKTOP_COLLAPSED_W}px;
    min-width:${DESKTOP_COLLAPSED_W}px;
    height:100vh;
    position:sticky;
    top:0;
    z-index:200;
    pointer-events:auto;
    transition:width .25s cubic-bezier(.22,1,.36,1),min-width .25s cubic-bezier(.22,1,.36,1);
  }
  .sb-shell.open {
    width:${DESKTOP_EXPANDED_W}px;
    min-width:${DESKTOP_EXPANDED_W}px;
  }

  .sb-menu-button {
    display: none;
  }

  .sb-menu-icon {
    width: 21px;
    height: 21px;
  }

  .sb-backdrop {
    display: none;
  }
  
  .sb-root {
    width:${DESKTOP_COLLAPSED_W}px; min-width:${DESKTOP_COLLAPSED_W}px; height:100vh; position:sticky; top:0;
    background:#ffffff; display:flex; flex-direction:column;
    font-family:'Geist',sans-serif; border-right:1px solid rgba(15, 22, 35, .08);
    box-shadow: 10px 0 30px rgba(15, 22, 35, .05);
    overflow:hidden; z-index:200; pointer-events:auto;
    transition:width .25s cubic-bezier(.22,1,.36,1),min-width .25s cubic-bezier(.22,1,.36,1);
  }
  .sb-shell.open .sb-root{width:${DESKTOP_EXPANDED_W}px;min-width:${DESKTOP_EXPANDED_W}px;}
  .mobile-shell .sb-root {
    width:${DESKTOP_COLLAPSED_W}px !important;
    min-width:${DESKTOP_COLLAPSED_W}px !important;
    max-width:none !important;
    padding:0 !important;
  }
  .mobile-shell .sb-shell.open .sb-root {
    width:${DESKTOP_EXPANDED_W}px !important;
    min-width:${DESKTOP_EXPANDED_W}px !important;
  }
  .sb-logo{padding:16px 0;height:64px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;
    display:flex;align-items:center;padding-left:18px;overflow:hidden;white-space:nowrap;}
  .sb-logo-icon{width:26px;height:26px;flex-shrink:0;background:linear-gradient(135deg,#1A6EFF,#00D68F);
    border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:800;color:#fff;}
  .sb-logo-text{margin-left:11px;font-size:1.1rem;font-weight:800;letter-spacing:-.03em;
    color:#111827;opacity:0;transition:opacity .2s .05s;white-space:nowrap;}
  .sb-shell.open .sb-logo-text{opacity:1;}
  .sb-nav{flex:1;overflow-y:auto;overflow-x:hidden;padding:8px 0;display:flex;flex-direction:column;}
  .sb-nav::-webkit-scrollbar{display:none;}
  .sb-section-label{font-size:.6rem;font-weight:700;color:#9ca3af;text-transform:uppercase;
    letter-spacing:.1em;padding:10px 0 3px 20px;white-space:nowrap;overflow:hidden;
    opacity:0;max-height:0;transition:opacity .2s,max-height .2s;}
  .sb-shell.open .sb-section-label{opacity:1;max-height:30px;}
  .sb-link{display:flex;align-items:center;height:42px;text-decoration:none;font-size:.85rem;
    font-weight:500;color:#6b7280;transition:background .18s,color .18s;
    position:relative;overflow:hidden;white-space:nowrap;}
  .sb-link:hover{background:rgba(20,157,128,.08);color:#111827;}
  .sb-link.active{background:rgba(20,157,128,.12);color:#111827;}
  .sb-link.active::before{content:'';position:absolute;left:0;top:7px;bottom:7px;
    width:3px;background:#149d80;border-radius:0 3px 3px 0;}
  .sb-icon-wrap{width:${DESKTOP_COLLAPSED_W}px;min-width:${DESKTOP_COLLAPSED_W}px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .sb-icon{width:18px;height:18px;transition:color .18s;}
  .sb-link.active .sb-icon{color:#149d80;}
  .sb-link:hover .sb-icon{color:#149d80;}
  .sb-link-label{flex:1;font-size:.85rem;opacity:0;transition:opacity .15s;overflow:hidden;}
  .sb-shell.open .sb-link-label{opacity:1;transition:opacity .2s .08s;}
  .sb-badge{background:#149d80;color:#fff;font-size:.58rem;font-weight:700;padding:1px 5px;
    border-radius:999px;margin-right:12px;opacity:0;transition:opacity .15s;flex-shrink:0;}
  .sb-shell.open .sb-badge{opacity:1;transition:opacity .2s .1s;}
  .sb-link .sb-tooltip{position:absolute;left:${DESKTOP_COLLAPSED_W+8}px;background:#111827;color:#fff;
    font-size:.78rem;font-weight:600;padding:5px 10px;border-radius:6px;pointer-events:none;
    opacity:0;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.3);transition:opacity .15s;z-index:999;}
  .sb-link .sb-tooltip::before{content:'';position:absolute;left:-4px;top:50%;transform:translateY(-50%);
    border:4px solid transparent;border-right-color:#111827;border-left:0;}
  .sb-shell:not(.open) .sb-link:hover .sb-tooltip{opacity:1;}
  .sb-divider{height:1px;background:rgba(15,22,35,.08);margin:4px 0;flex-shrink:0;}
  .sb-user{padding:10px 0;border-top:1px solid rgba(15,22,35,.08);flex-shrink:0;overflow:hidden;}
  .sb-user-row{display:flex;align-items:center;height:44px;cursor:default;}
  .sb-user-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#1A6EFF,#00D68F);
    display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;color:#fff;
    flex-shrink:0;margin-left:15px;}
  .sb-user-info{margin-left:10px;overflow:hidden;opacity:0;transition:opacity .2s .05s;white-space:nowrap;}
  .sb-shell.open .sb-user-info{opacity:1;}
  .sb-user-name{font-size:.8rem;font-weight:600;color:#111827;}
  .sb-user-role{font-size:.62rem;color:#6b7280;text-transform:capitalize;}
  .sb-logout-row{display:flex;align-items:center;height:38px;cursor:pointer;
    transition:background .18s;margin:0 8px;border-radius:8px;}
  .sb-logout-row:hover{background:rgba(239,68,68,.08);}
  .sb-logout-icon-wrap{width:44px;min-width:44px;display:flex;align-items:center;justify-content:center;}
  .sb-logout-icon{width:16px;height:16px;color:#f87171;}
  .sb-logout-label{font-size:.82rem;font-weight:600;color:#f87171;opacity:0;transition:opacity .15s;}
  .sb-shell.open .sb-logout-label{opacity:1;transition:opacity .2s .08s;}

  @media (max-width: 767px) {
    .sb-shell,
    .sb-shell.open {
      position: fixed;
      inset: 0;
      width: 100vw;
      min-width: 0;
      height: 100dvh;
      z-index: 900;
      pointer-events: none;
      transition: none;
    }

    .sb-menu-button {
      position: static;
      width: var(--mobile-nav-size, 42px);
      height: var(--mobile-nav-size, 42px);
      border: 1px solid rgba(15, 22, 35, .12);
      border-radius: 8px;
      background: rgba(255,255,255,.92);
      color: #0f1623;
      box-shadow: 0 8px 24px rgba(11,15,26,.14);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      transition: background .18s, transform .18s, box-shadow .18s, opacity .18s;
    }
    .sb-menu-button:hover {
      background: #fff;
      transform: translateY(-1px);
      box-shadow: 0 12px 30px rgba(11,15,26,.18);
    }
    .sb-menu-button.open {
      opacity: 0;
      pointer-events: none;
    }

    .sb-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 18, .52);
      opacity: 0;
      pointer-events: none;
      transition: opacity .24s ease;
    }
    .sb-shell.open .sb-backdrop {
      opacity: 1;
      pointer-events: auto;
    }

    .sb-root,
    .sb-shell.open .sb-root,
    .mobile-shell .sb-root,
    .mobile-shell .sb-shell.open .sb-root {
      width:min(${SIDEBAR_W}px, 86vw) !important;
      min-width:0 !important;
      max-width:86vw !important;
      height:100dvh;
      position:fixed;
      top:0;
      left:0;
      padding:0 !important;
      z-index:910;
      transform:translateX(-100%);
      box-shadow:22px 0 50px rgba(0,0,0,.24);
      transition:transform .25s cubic-bezier(.22,1,.36,1);
    }
    .sb-shell.open .sb-root,
    .mobile-shell .sb-shell.open .sb-root {
      transform:translateX(0);
    }

    .sb-logo-text,
    .sb-shell.open .sb-logo-text,
    .sb-section-label,
    .sb-shell.open .sb-section-label,
    .sb-link-label,
    .sb-shell.open .sb-link-label,
    .sb-badge,
    .sb-shell.open .sb-badge,
    .sb-user-info,
    .sb-shell.open .sb-user-info,
    .sb-logout-label,
    .sb-shell.open .sb-logout-label {
      opacity: 1;
    }

    .sb-section-label,
    .sb-shell.open .sb-section-label {
      max-height:30px;
    }

    .sb-logo { border-bottom: 1px solid rgba(15,22,35,.08); }

    .sb-icon-wrap {
      width:56px;
      min-width:56px;
    }

    .sb-tooltip {
      display:none;
    }
  }
`;

// Role → nav sections
const NAV = {
  admin: [
    { section: "Main", items: [
      { to: "/dashboard",            label: "Dashboard",  icon: "grid" },
      { to: "/dashboard/containers", label: "Containers", icon: "trash", badge: "5" },
      { to: "/dashboard/alerts",     label: "Alerts",     icon: "bell" },
    ]},
    { section: "Management", items: [
      { to: "/dashboard/reports",        label: "Reports",       icon: "chart" },
      { to: "/dashboard/routes-history", label: "Route History", icon: "route" },
    ]},
    { section: "Administration", items: [
      { to: "/dashboard/admin/organizations", label: "Organizations",   icon: "building" },
      { to: "/dashboard/admin/inquiries",    label: "Inquiries",       icon: "mail" },
      { to: "/dashboard/approvals",          label: "Approvals",       icon: "shield" },
      { to: "/dashboard/admin/users",        label: "Users & Roles",   icon: "users"  },
    ]},
    { section: "Account", items: [
      { to: "/dashboard/profile", label: "Profile", icon: "user" },
    ]},
  ],

  personnel: [
    { section: "Main", items: [
      { to: "/dashboard",            label: "Dashboard",  icon: "grid"  },
      { to: "/dashboard/containers", label: "Containers", icon: "trash" },
      { to: "/dashboard/alerts",     label: "Alerts",     icon: "bell"  },
    ]},
    { section: "Management", items: [
      { to: "/dashboard/reports",             label: "Reports",        icon: "chart" },
      { to: "/dashboard/routes-history",      label: "Route History",  icon: "route" },
      { to: "/dashboard/driver-registration", label: "Become a Driver",icon: "users" },
      { to: "/dashboard/utilizer-registration", label: "Become a Utilizer", icon: "recycle" },
    ]},
    { section: "Account", items: [
      { to: "/dashboard/profile", label: "Profile", icon: "user" },
    ]},
  ],

  driver: [
    { section: "Driver", items: [
      { to: "/dashboard",                     label: "Dashboard",    icon: "grid"  },
      { to: "/dashboard/routes-history",      label: "My Routes",    icon: "route" },
      { to: "/dashboard/driver-registration", label: "Registration", icon: "users" },
      { to: "/dashboard/driver-dashboard", label: "My Tasks", icon: "truck" },
    ]},
    { section: "Account", items: [
      { to: "/dashboard/profile", label: "Profile", icon: "user" },
    ]},
  ],

  utilizer: [
    { section: "Utilizer", items: [
      { to: "/dashboard/utilizer/inbound", label: "Inbound Logistics", icon: "truck" },
      { to: "/dashboard/utilizer", label: "Disposal Archive", icon: "grid" },
    ]},
    { section: "Account", items: [
      { to: "/dashboard/profile", label: "Profile", icon: "user" },
    ]},
  ],
};

function SbIcon({ name, className = "sb-icon" }) {
  const icons = {
    grid: Grid3X3,
    trash: Trash2,
    bell: Bell,
    chart: BarChart3,
    route: Route,
    truck: Truck,
    users: Users,
    user: User,
    shield: ShieldCheck,
    building: Building2,
    mail: Mail,
    logout: LogOut,
    recycle: Recycle,
    menu: Menu,
  };
  const Icon = icons[name] || Grid3X3;
  return (
    <Icon className={className} strokeWidth={1.9} aria-hidden="true" />
  );
}

export default function Sidebar({ open: controlledOpen, setOpen: setControlledOpen, showMenuButton = true }) {
  const location = useLocation();
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = setControlledOpen ?? setLocalOpen;

  const role     = sessionStorage.getItem("mw_role")  || "personnel";
  const name     = sessionStorage.getItem("mw_name")  || "User";
  const email    = sessionStorage.getItem("mw_user")  || "";

  const navItems = NAV[role] || NAV.personnel;

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle("sb-drawer-open", open);
    return () => document.body.classList.remove("sb-drawer-open");
  }, [open]);

  const isActive = (to) =>
    to === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(to);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <style>{css}</style>
      {showMenuButton && (
        <button
          type="button"
          className={`sb-menu-button ${open ? "open" : ""}`}
          aria-label="Open navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <SbIcon name="menu" className="sb-menu-icon" />
        </button>
      )}

      <div className={`sb-shell ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sb-backdrop" onClick={() => setOpen(false)} />
        <aside
          className="sb-root"
          aria-label="Main navigation"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >

        <div className="sb-logo">
          <div className="sb-logo-icon">M</div>
          <span className="sb-logo-text">MedWaste</span>
        </div>

        <nav className="sb-nav">
          {navItems.map((section, si) => (
            <React.Fragment key={section.section}>
              {si > 0 && <div className="sb-divider" />}
              <div className="sb-section-label">{section.section}</div>
              {section.items.map((item) => (
                <Link key={item.to} to={item.to}
                  className={`sb-link ${isActive(item.to) ? "active" : ""}`}
                  onClick={() => setOpen(false)}>
                  <span className="sb-icon-wrap"><SbIcon name={item.icon} /></span>
                  <span className="sb-link-label">{item.label}</span>
                  {item.badge && <span className="sb-badge">{item.badge}</span>}
                  <span className="sb-tooltip">{item.label}</span>
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sb-user">
          <div className="sb-user-row">
            <div className="sb-user-avatar">{name.charAt(0).toUpperCase()}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{name}</div>
              <div className="sb-user-role">{role}</div>
            </div>
          </div>
          <div className="sb-logout-row" onClick={handleLogout}>
            <div className="sb-logout-icon-wrap">
              <SbIcon name="logout" className="sb-logout-icon" />
            </div>
            <span className="sb-logout-label">Log Out</span>
          </div>
        </div>

        </aside>
      </div>
    </>
  );
}
