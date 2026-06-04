import React, { useEffect, useState } from "react";
import {
  Activity,
  BadgeCheck,
  CircleCheck,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  User,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import { createAdminUser, getCompanies, getUsers, updateUserRole } from "../services/api";

const css = `
  .au-root {
    --au-bg: #f4f3f8;
    --au-card: #ffffff;
    --au-ink: #101318;
    --au-muted: #7d8490;
    --au-line: #e7e7ef;
    --au-teal: #149d80;
    --au-teal-dark: #0d8069;
    --au-teal-soft: #e7f6f1;
    --au-blue: #4f96ce;
    --au-blue-soft: #e8f2fb;
    --au-warning: #f4a62a;
    --au-purple: #8b7bd8;
    --au-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    overflow-x: hidden;
    padding: 28px 32px;
    background: var(--au-bg);
    color: var(--au-ink);
  }

  .au-root,
  .au-root * {
    box-sizing: border-box;
    min-width: 0;
  }

  .au-header {
    margin-bottom: 22px;
  }

  .au-header h1 {
    margin: 0 0 4px;
    color: var(--au-ink);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
    line-height: 1.12;
  }

  .au-header p {
    margin: 0;
    color: var(--au-muted);
    font-size: .88rem;
    line-height: 1.45;
  }

  .au-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  .au-stat,
  .au-card {
    border: 1px solid rgba(231, 231, 239, .92);
    background: rgba(255,255,255,.94);
    box-shadow: var(--au-shadow);
  }

  .au-stat {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 18px;
  }

  .au-stat::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
  }

  .au-stat.admin::before { background: var(--au-purple); }
  .au-stat.personnel::before { background: var(--au-blue); }
  .au-stat.driver::before { background: var(--au-teal); }
  .au-stat.utilizer::before { background: var(--au-warning); }

  .au-stat-label {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    color: var(--au-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .au-stat-val {
    color: var(--au-ink);
    font-size: clamp(1.35rem, 5vw, 1.7rem);
    font-weight: 900;
    line-height: 1;
  }

  .au-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 12px;
    background: #f3f7f6;
    color: var(--au-teal);
  }

  .au-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .au-search-wrap {
    position: relative;
    flex: 1;
    min-width: 220px;
  }

  .au-search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    color: #a2a8b1;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .au-search {
    width: 100%;
    min-height: 40px;
    padding: 9px 14px 9px 40px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 14px;
    background: #fff;
    color: var(--au-ink);
    outline: none;
    font: inherit;
    font-size: .86rem;
    transition: border-color .2s ease, box-shadow .2s ease;
  }

  .au-search:focus {
    border-color: rgba(20,157,128,.72);
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .au-filter-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 999px;
    background: #fff;
    color: var(--au-muted);
    cursor: pointer;
    font: inherit;
    font-size: .8rem;
    font-weight: 900;
    white-space: nowrap;
    transition: all .2s;
  }

  .au-filter-btn:hover {
    background: #f8f8fb;
    transform: translateY(-1px);
  }

  .au-filter-btn.active {
    border-color: rgba(20,157,128,.18);
    background: var(--au-teal-soft);
    color: var(--au-teal-dark);
  }

  .au-card {
    overflow: hidden;
    border-radius: 18px;
  }

  .au-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(231,231,239,.8);
  }

  .au-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--au-ink);
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .au-card-count {
    color: var(--au-muted);
    font-size: .78rem;
    font-weight: 800;
  }

  .au-table {
    width: 100%;
    border-collapse: collapse;
    font-size: .84rem;
  }

  .au-table th {
    padding: 12px 16px;
    background: #f8f8fb;
    color: var(--au-muted);
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .au-table td {
    padding: 13px 16px;
    border-top: 1px solid #f2f3f7;
    vertical-align: middle;
  }

  .au-table tr:hover td {
    background: #fbfcfd;
  }

  .au-user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .au-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 50%;
    background: var(--au-teal);
    color: #fff;
    font-size: .82rem;
    font-weight: 900;
  }

  .au-user-name {
    color: var(--au-ink);
    font-size: .88rem;
    font-weight: 900;
    line-height: 1.25;
  }

  .au-user-email {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
    color: var(--au-muted);
    font-size: .72rem;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .au-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .au-role-admin { background: #f2efff; color: #6d58c8; }
  .au-role-personnel { background: var(--au-blue-soft); color: #286b9d; }
  .au-role-driver { background: var(--au-teal-soft); color: var(--au-teal-dark); }
  .au-role-utilizer { background: #fff8e8; color: #8a5a0a; }

  .au-role-select {
    min-height: 36px;
    padding: 0 10px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    color: var(--au-ink);
    cursor: pointer;
    outline: none;
    font: inherit;
    font-size: .82rem;
    font-weight: 800;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .au-role-select:focus {
    border-color: rgba(20,157,128,.72);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20,157,128,.12);
  }

  .au-save-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 12px;
    border: 0;
    border-radius: 12px;
    background: var(--au-teal);
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-size: .8rem;
    font-weight: 900;
    transition: all .2s;
  }

  .au-save-btn:hover {
    background: var(--au-teal-dark);
    transform: translateY(-1px);
  }

  .au-save-btn:disabled {
    cursor: not-allowed;
    opacity: .7;
    transform: none;
  }

  .au-save-btn.saved {
    background: var(--au-teal-soft);
    color: var(--au-teal-dark);
  }

  .au-empty,
  .au-loading {
    padding: 44px 20px;
    color: var(--au-muted);
    font-size: .88rem;
    text-align: center;
  }

  .au-create-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 16px;
    border: 0;
    border-radius: 14px;
    background: var(--au-teal);
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-size: .86rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .au-create-panel {
    margin-bottom: 16px;
    padding: 18px 20px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 18px;
    background: rgba(255,255,255,.94);
    box-shadow: var(--au-shadow);
  }

  .au-create-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 12px;
  }

  .au-create-grid label {
    display: block;
    margin-bottom: 6px;
    color: var(--au-muted);
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .au-create-grid input,
  .au-create-grid select {
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    font: inherit;
    font-size: .84rem;
  }

  .au-company-tag {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 999px;
    background: #f3f4f8;
    color: #5b6472;
    font-size: .7rem;
    font-weight: 800;
  }

  .au-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 9999;
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

  .au-avail {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--au-ink);
    font-size: .82rem;
    font-weight: 800;
  }

  .au-avail-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .au-avail-yes { background: var(--au-teal); }
  .au-avail-no { background: #d8dbe3; }

  @media(max-width: 800px) {
    .au-root { padding: 16px; }
    .au-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media(max-width: 700px) {
    .au-header h1 { font-size: 1.45rem; }
    .au-header p { font-size: .82rem; }

    .au-stats {
      gap: 10px;
      margin-bottom: 14px;
    }

    .au-stat {
      padding: 12px;
      border-radius: 16px;
    }

    .au-stat-val {
      font-size: 1.45rem;
    }

    .au-toolbar {
      gap: 8px;
    }

    .au-search-wrap {
      min-width: 100%;
      width: 100%;
    }

    .au-filter-btn {
      min-height: 36px;
      padding: 0 10px;
      font-size: .76rem;
    }

    .au-card-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: 12px 14px;
    }

    .au-table,
    .au-table tbody,
    .au-table tr,
    .au-table td {
      display: block;
      width: 100%;
    }

    .au-table thead {
      display: none;
    }

    .au-table tr {
      margin: 10px;
      overflow: hidden;
      border: 1px solid var(--au-line);
      border-radius: 14px;
      background: #fff;
    }

    .au-table td {
      padding: 10px 12px;
      border-top: 1px solid #f3f4f8;
    }

    .au-table td:first-child {
      border-top: none;
    }

    .au-table td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 4px;
      color: #6b7280;
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .au-user-cell {
      align-items: flex-start;
    }

    .au-role-select,
    .au-save-btn {
      width: 100%;
      min-height: 38px;
    }

    .au-toast {
      left: 12px;
      right: 12px;
      bottom: 94px;
      padding: 10px 12px;
      font-size: .8rem;
    }
  }
`;

const ROLES = ["admin", "personnel", "driver", "utilizer"];

const ROLE_META = {
  admin: { icon: ShieldCheck, label: "Admin" },
  personnel: { icon: User, label: "Personnel" },
  driver: { icon: UserCog, label: "Driver" },
  utilizer: { icon: Activity, label: "Utilizer" },
};

function RoleIcon({ role, size = 14 }) {
  const Icon = ROLE_META[role]?.icon || User;
  return <Icon size={size} strokeWidth={2.35} aria-hidden="true" />;
}

const EMPTY_USER = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  role: "personnel",
  companyId: "",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [pendingRole, setPendingRole] = useState({});
  const [pendingCompany, setPendingCompany] = useState({});
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_USER);
  const [creating, setCreating] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      showToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await getCompanies();
      const list = Array.isArray(res.data) ? res.data : [];
      setCompanies(list);
      if (list.length > 0) {
        setCreateForm((f) => (f.companyId ? f : { ...f, companyId: list[0].id }));
      }
    } catch {
      showToast("Failed to load organizations");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setPendingRole(p => ({ ...p, [userId]: newRole }));
  };

  const handleCompanyChange = (userId, companyId) => {
    setPendingCompany(p => ({ ...p, [userId]: companyId }));
  };

  const handleSave = async (userId) => {
    const newRole = pendingRole[userId];
    const newCompanyId = pendingCompany[userId];
    const user = users.find(u => u.id === userId);
    const roleChanged = newRole && newRole !== user?.role;
    const companyChanged = newCompanyId && newCompanyId !== user?.companyId;

    if (!roleChanged && !companyChanged) return;

    setSaving(s => ({ ...s, [userId]: true }));
    try {
      const payload = {};
      if (roleChanged) payload.role = newRole;
      if (companyChanged) payload.companyId = newCompanyId;
      await updateUserRole(userId, payload);
      setUsers(prev => prev.map(u => {
        if (u.id !== userId) return u;
        const company = companies.find(c => c.id === (newCompanyId || u.companyId));
        return {
          ...u,
          role: roleChanged ? newRole : u.role,
          companyId: companyChanged ? newCompanyId : u.companyId,
          company: company ? { id: company.id, name: company.name, subscriptionPlan: company.subscriptionPlan } : u.company,
        };
      }));
      setPendingRole(p => { const copy = { ...p }; delete copy[userId]; return copy; });
      setPendingCompany(p => { const copy = { ...p }; delete copy[userId]; return copy; });
      showToast("User updated");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to save changes");
    } finally {
      setSaving(s => ({ ...s, [userId]: false }));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createAdminUser(createForm);
      setUsers(prev => [res.data, ...prev]);
      setCreateForm({ ...EMPTY_USER, companyId: companies[0]?.id || "" });
      setShowCreate(false);
      showToast("User created");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  return (
    <>
      <style>{css}</style>
      <div className="au-root">
        <div className="au-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1>Users & Roles</h1>
            <p>Create accounts linked to an organization with a fixed role</p>
          </div>
          <button className="au-create-btn" type="button" onClick={() => setShowCreate(s => !s)}>
            <UserPlus size={18} />
            {showCreate ? "Hide form" : "Create user"}
          </button>
        </div>

        {showCreate && (
          <form className="au-create-panel" onSubmit={handleCreateUser}>
            <div className="au-create-grid">
              <div>
                <label htmlFor="cu-name">Full name</label>
                <input id="cu-name" required value={createForm.fullName} onChange={e => setCreateForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="cu-username">Username</label>
                <input id="cu-username" required value={createForm.username} onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="cu-email">Email</label>
                <input id="cu-email" type="email" required value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="cu-password">Password</label>
                <input id="cu-password" type="password" required minLength={6} value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="cu-role">Role</label>
                <select id="cu-role" required value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => (
                    <option key={r} value={r}>{ROLE_META[r].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cu-company">Organization</label>
                <select id="cu-company" required value={createForm.companyId} onChange={e => setCreateForm(f => ({ ...f, companyId: e.target.value }))}>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.subscriptionPlan})</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="au-create-btn" type="submit" disabled={creating || companies.length === 0}>
              <Plus size={16} />
              {creating ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        <div className="au-stats">
          {ROLES.map(r => (
            <div key={r} className={`au-stat ${r}`}>
              <div>
                <div className="au-stat-label">
                  <RoleIcon role={r} />
                  {r}
                </div>
                <div className="au-stat-val">{counts[r] ?? 0}</div>
              </div>
              <span className="au-stat-icon">
                <RoleIcon role={r} size={20} />
              </span>
            </div>
          ))}
        </div>

        <div className="au-toolbar">
          <div className="au-search-wrap">
            <Search className="au-search-icon" size={17} strokeWidth={2.35} aria-hidden="true" />
            <input
              className="au-search"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className={`au-filter-btn ${roleFilter === "all" ? "active" : ""}`}
            onClick={() => setRoleFilter("all")} type="button">
            <Users size={15} strokeWidth={2.35} aria-hidden="true" />
            All
          </button>
          {ROLES.map(r => (
            <button key={r}
              className={`au-filter-btn ${roleFilter === r ? "active" : ""}`}
              onClick={() => setRoleFilter(r)}
              type="button">
              <RoleIcon role={r} />
              {ROLE_META[r].label}
            </button>
          ))}
          <button className="au-filter-btn" onClick={fetchUsers} type="button">
            <RefreshCw size={15} strokeWidth={2.35} aria-hidden="true" />
            Refresh
          </button>
        </div>

        <div className="au-card">
          <div className="au-card-head">
            <span className="au-card-title">
              <Users size={18} strokeWidth={2.35} aria-hidden="true" />
              All Users
            </span>
            <span className="au-card-count">Showing {filtered.length} of {users.length}</span>
          </div>

          {loading ? (
            <div className="au-loading">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="au-empty">No users found</div>
          ) : (
            <table className="au-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Organization</th>
                  <th>Current Role</th>
                  <th>Available</th>
                  <th>Joined</th>
                  <th>Change Role</th>
                  <th>Company</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const currentRole = u.role;
                  const selectedRole = pendingRole[u.id] ?? currentRole;
                  const selectedCompany = pendingCompany[u.id] ?? u.companyId ?? "";
                  const roleChanged = pendingRole[u.id] && pendingRole[u.id] !== currentRole;
                  const companyChanged = pendingCompany[u.id] && pendingCompany[u.id] !== u.companyId;
                  const changed = roleChanged || companyChanged;

                  return (
                    <tr key={u.id}>
                      <td data-label="User">
                        <div className="au-user-cell">
                          <div className="au-avatar">
                            {(u.fullName || u.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="au-user-name">{u.fullName || "-"}</div>
                            <div className="au-user-email">
                              <Mail size={12} strokeWidth={2.3} aria-hidden="true" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td data-label="Organization">
                        <span className="au-company-tag">{u.company?.name || "—"}</span>
                      </td>

                      <td data-label="Current Role">
                        <span className={`au-role-badge au-role-${currentRole}`}>
                          <RoleIcon role={currentRole} />
                          {currentRole}
                        </span>
                      </td>

                      <td data-label="Available">
                        <span className="au-avail">
                          <span className={`au-avail-dot ${u.isAvailable ? "au-avail-yes" : "au-avail-no"}`} />
                          {u.isAvailable ? "Yes" : "No"}
                        </span>
                      </td>

                      <td data-label="Joined" style={{ color: "#7d8490", fontSize: ".78rem" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                      </td>

                      <td data-label="Change Role">
                        <select
                          className="au-role-select"
                          value={selectedRole}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td data-label="Company">
                        <select
                          className="au-role-select"
                          value={selectedCompany}
                          onChange={e => handleCompanyChange(u.id, e.target.value)}
                        >
                          {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>

                      <td data-label="Save">
                        <button
                          className={`au-save-btn ${!changed ? "saved" : ""}`}
                          disabled={!changed || saving[u.id]}
                          onClick={() => handleSave(u.id)}
                          type="button"
                        >
                          {saving[u.id] ? (
                            "Saving..."
                          ) : changed ? (
                            <>
                              <Settings size={14} strokeWidth={2.35} aria-hidden="true" />
                              Save
                            </>
                          ) : (
                            <CircleCheck size={16} strokeWidth={2.5} aria-hidden="true" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {toast && <div className="au-toast">{toast}</div>}
    </>
  );
}
