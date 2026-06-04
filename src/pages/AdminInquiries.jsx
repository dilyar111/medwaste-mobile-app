import React, { useEffect, useState } from "react";
import { Loader2, Mail, MessageSquare, RefreshCw, User } from "lucide-react";
import { getContactInquiries, updateContactInquiry } from "../services/api";

const css = `
  .ci-root {
    min-height: 100vh;
    padding: 28px 32px;
    background: #f4f3f8;
    color: #101318;
  }

  .ci-root, .ci-root * { box-sizing: border-box; }

  .ci-header { margin-bottom: 20px; }
  .ci-header h1 { margin: 0 0 4px; font-size: 1.8rem; font-weight: 900; }
  .ci-header p { margin: 0; color: #7d8490; font-size: .88rem; }

  .ci-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .ci-filter {
    min-height: 38px;
    padding: 0 12px;
    border: 1px solid #e7e7ef;
    border-radius: 12px;
    background: #fff;
    font: inherit;
    font-size: .84rem;
    font-weight: 700;
  }

  .ci-refresh {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid #e7e7ef;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
  }

  .ci-card {
    overflow: hidden;
    border: 1px solid #e7e7ef;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(24, 33, 49, .06);
  }

  .ci-table { width: 100%; border-collapse: collapse; font-size: .84rem; }

  .ci-table th {
    padding: 12px 16px;
    background: #f8f8fb;
    color: #7d8490;
    font-size: .7rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-align: left;
    text-transform: uppercase;
  }

  .ci-table td {
    padding: 13px 16px;
    border-top: 1px solid #f2f3f7;
    vertical-align: top;
  }

  .ci-msg {
    max-width: 280px;
    color: #5b6472;
    font-size: .8rem;
    line-height: 1.45;
    white-space: pre-wrap;
  }

  .ci-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  .ci-badge.new { background: #e8f2fb; color: #286b9d; }
  .ci-badge.contacted { background: #e7f6f1; color: #0d8069; }
  .ci-badge.closed { background: #f3f4f8; color: #5b6472; }

  .ci-select {
    min-height: 34px;
    padding: 0 8px;
    border: 1px solid #e7e7ef;
    border-radius: 10px;
    font: inherit;
    font-size: .8rem;
    font-weight: 700;
  }

  .ci-empty, .ci-loading {
    padding: 40px 20px;
    color: #7d8490;
    text-align: center;
  }

  @keyframes ci-spin { to { transform: rotate(360deg); } }
  .ci-spin { animation: ci-spin 1s linear infinite; }

  .ci-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 9999;
    padding: 12px 18px;
    border-radius: 14px;
    background: #101318;
    color: #fff;
    font-size: .85rem;
    font-weight: 700;
  }

  @media (max-width: 800px) {
    .ci-root { padding: 16px; }
    .ci-table thead { display: none; }
    .ci-table tr { display: block; margin: 10px; border: 1px solid #e7e7ef; border-radius: 14px; }
    .ci-table td { display: block; border: none; }
  }
`;

const STATUS_OPTIONS = ["new", "contacted", "closed"];

export default function AdminInquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getContactInquiries(filter ? { status: filter } : {});
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      const res = await updateContactInquiry(id, status);
      setItems((prev) => prev.map((item) => (item._id === id ? res.data : item)));
      showToast("Status updated");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update");
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ci-root">
        <div className="ci-header">
          <h1>Contact inquiries</h1>
          <p>Messages from the landing page — follow up and update status</p>
        </div>

        <div className="ci-toolbar">
          <select className="ci-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="ci-refresh" type="button" onClick={fetchItems}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="ci-card">
          {loading ? (
            <div className="ci-loading"><Loader2 size={24} className="ci-spin" /> Loading...</div>
          ) : items.length === 0 ? (
            <div className="ci-empty">No inquiries yet</div>
          ) : (
            <table className="ci-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row._id}>
                    <td>
                      <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
                        <User size={14} /> {row.name}
                      </div>
                      <div style={{ marginTop: 4, color: "#7d8490", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 6 }}>
                        <Mail size={12} />
                        <a href={`mailto:${row.email}`}>{row.email}</a>
                      </div>
                    </td>
                    <td>
                      <div className="ci-msg">
                        <MessageSquare size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                        {row.message}
                      </div>
                    </td>
                    <td style={{ fontSize: ".78rem", color: "#7d8490", whiteSpace: "nowrap" }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                    </td>
                    <td>
                      <span className={`ci-badge ${row.status}`}>{row.status}</span>
                      <div style={{ marginTop: 8 }}>
                        <select
                          className="ci-select"
                          value={row.status}
                          onChange={(e) => handleStatus(row._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {toast && <div className="ci-toast">{toast}</div>}
    </>
  );
}
