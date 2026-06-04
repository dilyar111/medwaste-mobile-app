import React, { useEffect, useState } from "react";
import {
  Building2,
  CircleCheck,
  Crown,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { createCompany, getCompanies, updateCompany } from "../services/api";

const css = `
  .org-root {
    --org-bg: #f4f3f8;
    --org-card: #ffffff;
    --org-ink: #101318;
    --org-muted: #7d8490;
    --org-line: #e7e7ef;
    --org-teal: #149d80;
    --org-teal-dark: #0d8069;
    --org-teal-soft: #e7f6f1;
    --org-purple: #8b7bd8;
    --org-purple-soft: #f2efff;
    --org-shadow: 0 8px 24px rgba(24, 33, 49, .06);
    min-height: 100vh;
    padding: 28px 32px;
    background: var(--org-bg);
    color: var(--org-ink);
  }

  .org-root, .org-root * { box-sizing: border-box; min-width: 0; }

  .org-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
  }

  .org-header h1 {
    margin: 0 0 4px;
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    font-weight: 900;
  }

  .org-header p { margin: 0; color: var(--org-muted); font-size: .88rem; }

  .org-create-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 16px;
    border: 0;
    border-radius: 14px;
    background: var(--org-teal);
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-size: .86rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .org-create-btn:hover { background: var(--org-teal-dark); }

  .org-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  .org-stat {
    padding: 16px 18px;
    border: 1px solid rgba(231, 231, 239, .92);
    border-radius: 18px;
    background: rgba(255,255,255,.94);
    box-shadow: var(--org-shadow);
  }

  .org-stat-label {
    margin-bottom: 6px;
    color: var(--org-muted);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .org-stat-val { font-size: 1.6rem; font-weight: 900; line-height: 1; }

  .org-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .org-search-wrap { position: relative; flex: 1; min-width: 220px; }

  .org-search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    color: #a2a8b1;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .org-search {
    width: 100%;
    min-height: 40px;
    padding: 9px 14px 9px 40px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 14px;
    background: #fff;
    font: inherit;
    font-size: .86rem;
    outline: none;
  }

  .org-card {
    overflow: hidden;
    border: 1px solid rgba(231, 231, 239, .92);
    border-radius: 18px;
    background: rgba(255,255,255,.94);
    box-shadow: var(--org-shadow);
  }

  .org-table { width: 100%; border-collapse: collapse; font-size: .84rem; }

  .org-table th {
    padding: 12px 16px;
    background: #f8f8fb;
    color: var(--org-muted);
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .org-table td {
    padding: 13px 16px;
    border-top: 1px solid #f2f3f7;
    vertical-align: middle;
  }

  .org-table tr:hover td { background: #fbfcfd; }

  .org-name-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 900;
  }

  .org-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: var(--org-teal-soft);
    color: var(--org-teal-dark);
  }

  .org-plan-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
  }

  .org-plan-free { background: #f3f4f8; color: #5b6472; }
  .org-plan-premium { background: var(--org-purple-soft); color: #6d58c8; }

  .org-select {
    min-height: 36px;
    padding: 0 10px;
    border: 1px solid rgba(231,231,239,.92);
    border-radius: 12px;
    background: #f8f8fb;
    font: inherit;
    font-size: .82rem;
    font-weight: 800;
    cursor: pointer;
  }

  .org-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 12px;
    border: 0;
    border-radius: 12px;
    background: var(--org-teal);
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-size: .8rem;
    font-weight: 900;
  }

  .org-save-btn:disabled { opacity: .55; cursor: not-allowed; }

  .org-limit {
    color: var(--org-muted);
    font-size: .78rem;
    font-weight: 700;
  }

  .org-limit.over { color: #c0392b; }

  .org-empty, .org-loading {
    padding: 44px 20px;
    color: var(--org-muted);
    text-align: center;
  }

  .org-overlay {
    position: fixed;
    inset: 0;
    z-index: 10002;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(16, 19, 24, 0.42);
  }

  .org-modal {
    width: min(100%, 460px);
    padding: 22px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 18px 48px rgba(16, 19, 24, 0.18);
  }

  .org-modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .org-modal-head h3 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 800; }
  .org-modal-head p { margin: 0; color: var(--org-muted); font-size: .82rem; }

  .org-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 10px;
    background: #f4f3f8;
    color: var(--org-muted);
    cursor: pointer;
  }

  .org-field { margin-bottom: 14px; }

  .org-field label {
    display: block;
    margin-bottom: 6px;
    color: var(--org-muted);
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .org-field input,
  .org-field select {
    width: 100%;
    min-height: 42px;
    padding: 0 12px;
    border: 1px solid #e7e9f1;
    border-radius: 12px;
    font: inherit;
    font-size: .88rem;
  }

  .org-plan-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .org-plan-option {
    min-height: 44px;
    border: 1px solid #e7e9f1;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    font: inherit;
    font-size: .84rem;
    font-weight: 800;
  }

  .org-plan-option.active {
    border-color: rgba(20, 157, 128, 0.35);
    background: var(--org-teal-soft);
    color: var(--org-teal-dark);
  }

  .org-plan-option.premium.active {
    border-color: rgba(139, 123, 216, 0.35);
    background: var(--org-purple-soft);
    color: #6d58c8;
  }

  .org-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
  }

  .org-modal-actions button {
    flex: 1;
    min-height: 42px;
    border-radius: 12px;
    cursor: pointer;
    font: inherit;
    font-size: .85rem;
    font-weight: 800;
  }

  .org-cancel {
    border: 1px solid #e7e9f1;
    background: #fff;
    color: var(--org-muted);
  }

  .org-submit {
    border: 0;
    background: var(--org-teal);
    color: #fff;
  }

  .org-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 10003;
    padding: 12px 18px;
    border-radius: 14px;
    background: #101318;
    color: #fff;
    font-size: .85rem;
    font-weight: 700;
  }

  @media (max-width: 800px) {
    .org-root { padding: 16px; }
    .org-stats { grid-template-columns: 1fr; }
    .org-header { flex-direction: column; }
  }
`;

const EMPTY_FORM = { name: "", subscriptionPlan: "free", paymentStatus: "active" };

export default function AdminOrganizations() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [pendingPlan, setPendingPlan] = useState({});
  const [savingPlan, setSavingPlan] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await getCompanies();
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const filtered = companies.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalUsers = companies.reduce((sum, c) => sum + (c.userCount || 0), 0);
  const premiumCount = companies.filter((c) => c.subscriptionPlan === "premium").length;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    try {
      await createCompany(form);
      showToast("Organization created");
      setShowCreate(false);
      setForm(EMPTY_FORM);
      fetchCompanies();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to create organization");
    } finally {
      setCreating(false);
    }
  };

  const handlePlanSave = async (companyId) => {
    const plan = pendingPlan[companyId];
    if (!plan) return;

    setSavingPlan((s) => ({ ...s, [companyId]: true }));
    try {
      const res = await updateCompany(companyId, { subscriptionPlan: plan });
      setCompanies((prev) => prev.map((c) => (c.id === companyId ? res.data : c)));
      setPendingPlan((p) => {
        const copy = { ...p };
        delete copy[companyId];
        return copy;
      });
      showToast("Plan updated");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update plan");
    } finally {
      setSavingPlan((s) => ({ ...s, [companyId]: false }));
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="org-root">
        <div className="org-header">
          <div>
            <h1>B2B Organizations</h1>
            <p>Manage platform clients, subscription plans, and user limits</p>
          </div>
          <button className="org-create-btn" type="button" onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            New organization
          </button>
        </div>

        <div className="org-stats">
          <div className="org-stat">
            <div className="org-stat-label">Organizations</div>
            <div className="org-stat-val">{companies.length}</div>
          </div>
          <div className="org-stat">
            <div className="org-stat-label">Premium clients</div>
            <div className="org-stat-val">{premiumCount}</div>
          </div>
          <div className="org-stat">
            <div className="org-stat-label">Total users</div>
            <div className="org-stat-val">{totalUsers}</div>
          </div>
        </div>

        <div className="org-toolbar">
          <div className="org-search-wrap">
            <Search className="org-search-icon" size={17} />
            <input
              className="org-search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="org-create-btn" type="button" onClick={fetchCompanies} style={{ background: "#fff", color: "#101318", border: "1px solid #e7e7ef" }}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="org-card">
          {loading ? (
            <div className="org-loading"><Loader2 size={24} className="org-spin" /> Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="org-empty">No organizations found</div>
          ) : (
            <table className="org-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Users</th>
                  <th>Billing</th>
                  <th>Change plan</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => {
                  const currentPlan = company.subscriptionPlan || "free";
                  const selectedPlan = pendingPlan[company.id] ?? currentPlan;
                  const changed = pendingPlan[company.id] && pendingPlan[company.id] !== currentPlan;
                  const overLimit = company.maxUsers != null && company.userCount > company.maxUsers;

                  return (
                    <tr key={company.id}>
                      <td>
                        <div className="org-name-cell">
                          <span className="org-icon"><Building2 size={16} /></span>
                          {company.name}
                        </div>
                      </td>
                      <td>
                        <span className={`org-plan-badge org-plan-${currentPlan}`}>
                          {currentPlan === "premium" ? <Crown size={12} /> : null}
                          {currentPlan === "premium" ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td>
                        <span className={`org-limit ${overLimit ? "over" : ""}`}>
                          <Users size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                          {company.userCount ?? 0}
                          {company.maxUsers != null ? ` / ${company.maxUsers}` : " / ∞"}
                        </span>
                      </td>
                      <td>{company.paymentStatus || "active"}</td>
                      <td>
                        <select
                          className="org-select"
                          value={selectedPlan}
                          onChange={(e) => setPendingPlan((p) => ({ ...p, [company.id]: e.target.value }))}
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="org-save-btn"
                          type="button"
                          disabled={!changed || savingPlan[company.id]}
                          onClick={() => handlePlanSave(company.id)}
                        >
                          {savingPlan[company.id] ? "..." : (
                            <>
                              <CircleCheck size={14} />
                              Save
                            </>
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

      {showCreate && (
        <div className="org-overlay" onClick={() => setShowCreate(false)}>
          <form className="org-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
            <div className="org-modal-head">
              <div>
                <h3>New organization</h3>
                <p>The B2B client will receive an isolated tenant in the system</p>
              </div>
              <button className="org-close" type="button" onClick={() => setShowCreate(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="org-field">
              <label htmlFor="org-name">Name</label>
              <input
                id="org-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="City Hospital Group"
                required
              />
            </div>

            <div className="org-field">
              <label>Subscription plan</label>
              <div className="org-plan-toggle">
                <button
                  type="button"
                  className={`org-plan-option ${form.subscriptionPlan === "free" ? "active" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, subscriptionPlan: "free" }))}
                >
                  Free · up to 10 users
                </button>
                <button
                  type="button"
                  className={`org-plan-option premium ${form.subscriptionPlan === "premium" ? "active" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, subscriptionPlan: "premium" }))}
                >
                  Premium · unlimited
                </button>
              </div>
            </div>

            <div className="org-field">
              <label htmlFor="org-payment">Payment status</label>
              <select
                id="org-payment"
                value={form.paymentStatus}
                onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}
              >
                <option value="active">active</option>
                <option value="trial">trial</option>
                <option value="past_due">past_due</option>
                <option value="suspended">suspended</option>
              </select>
            </div>

            <div className="org-modal-actions">
              <button className="org-cancel" type="button" onClick={() => setShowCreate(false)} disabled={creating}>
                Cancel
              </button>
              <button className="org-submit" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="org-toast">{toast}</div>}
    </>
  );
}
