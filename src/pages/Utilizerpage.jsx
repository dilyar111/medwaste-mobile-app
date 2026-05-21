import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Flame,
  History,
  Inbox,
  Loader2,
  Package,
  Scale,
  Settings,
  Truck,
  User,
} from "lucide-react";
import { getIncomingTasks, acceptWaste, completeProcess, getUtilizerHistory } from "../services/api";

const css = `
  .ut-root,
  .ut-root * {
    box-sizing: border-box;
  }

  .ut-root {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(20, 157, 128, 0.1), transparent 32rem),
      linear-gradient(180deg, #f7f8fb 0%, #f2f3f8 100%);
    color: #111827;
    font-family: Inter, "Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: clamp(18px, 4vw, 32px);
  }

  .ut-shell {
    width: min(1120px, 100%);
    margin: 0 auto;
  }

  .ut-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .ut-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    width: fit-content;
    margin-bottom: 8px;
    padding: 6px 10px;
    border: 1px solid rgba(20, 157, 128, 0.2);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    color: #0f8f75;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    box-shadow: 0 8px 24px rgba(24, 33, 49, 0.05);
  }

  .ut-header h1 {
    margin: 0;
    color: #101318;
    font-size: clamp(1.42rem, 4.8vw, 1.9rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.1;
  }

  .ut-header p {
    max-width: 560px;
    margin: 8px 0 0;
    color: #6f7684;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .ut-header-stat {
    flex: 0 0 auto;
    min-width: 142px;
    padding: 12px 14px;
    border: 1px solid #e7e9f1;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 12px 30px rgba(24, 33, 49, 0.07);
  }

  .ut-header-stat span {
    display: block;
    color: #7b8493;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .ut-header-stat strong {
    display: block;
    margin-top: 4px;
    color: #101318;
    font-size: 1.35rem;
    line-height: 1;
  }

  .ut-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .ut-tabs {
    display: inline-flex;
    max-width: 100%;
    gap: 4px;
    padding: 4px;
    border: 1px solid #e4e7ef;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.76);
    box-shadow: 0 8px 24px rgba(24, 33, 49, 0.05);
  }

  .ut-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 8px 13px;
    border: 0;
    border-radius: 14px;
    background: transparent;
    color: #6c7482;
    cursor: pointer;
    font: inherit;
    font-size: 0.84rem;
    font-weight: 800;
    white-space: nowrap;
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  }

  .ut-tab:hover {
    color: #101318;
    background: rgba(20, 157, 128, 0.08);
  }

  .ut-tab.active {
    background: #ffffff;
    color: #0f8f75;
    box-shadow: 0 8px 18px rgba(24, 33, 49, 0.09);
  }

  .ut-tab svg,
  .ut-kicker svg,
  .ut-badge svg,
  .ut-meta-icon,
  .ut-btn svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  .ut-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 999px;
    background: #eef7f5;
    color: #0f8f75;
    font-size: 0.74rem;
    font-weight: 900;
  }

  .ut-helper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #6f7684;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .ut-helper svg {
    width: 15px;
    height: 15px;
    color: #149d80;
  }

  .ut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: 14px;
    align-items: start;
  }

  .ut-card {
    min-width: 0;
    overflow: hidden;
    border: 1px solid #e5e8ef;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 12px 28px rgba(24, 33, 49, 0.07);
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  }

  .ut-card:hover {
    transform: translateY(-2px);
    border-color: rgba(20, 157, 128, 0.22);
    box-shadow: 0 18px 36px rgba(24, 33, 49, 0.09);
  }

  .ut-card-main {
    padding: 17px;
  }

  .ut-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .ut-card-title {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 10px;
  }

  .ut-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 14px;
    background: #eef8f6;
    color: #149d80;
    flex: 0 0 auto;
  }

  .ut-card-icon svg {
    width: 20px;
    height: 20px;
  }

  .ut-card-id {
    display: block;
    overflow: hidden;
    color: #101318;
    font-size: 0.98rem;
    font-weight: 850;
    letter-spacing: -0.02em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ut-card-sub {
    display: block;
    margin-top: 3px;
    color: #8b93a1;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .ut-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    width: fit-content;
    max-width: 100%;
    padding: 6px 9px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 850;
    line-height: 1;
    white-space: nowrap;
  }

  .ut-badge-transit {
    border-color: rgba(79, 150, 206, 0.2);
    background: #edf6fd;
    color: #2777b7;
  }

  .ut-badge-util {
    border-color: rgba(244, 166, 42, 0.22);
    background: #fff7e8;
    color: #b8660d;
  }

  .ut-badge-done {
    border-color: rgba(20, 157, 128, 0.2);
    background: #eaf8f4;
    color: #0f8f75;
  }

  .ut-meta {
    display: grid;
    gap: 8px;
  }

  .ut-meta-row {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 9px;
    color: #687182;
    font-size: 0.84rem;
    line-height: 1.35;
  }

  .ut-meta-icon {
    color: #149d80;
  }

  .ut-meta-row strong {
    color: #202631;
    font-weight: 800;
    overflow-wrap: anywhere;
  }

  .ut-action-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 15px;
    padding-top: 14px;
    border-top: 1px solid #eef0f5;
  }

  .ut-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    max-width: 100%;
    padding: 10px 14px;
    border: 1px solid transparent;
    border-radius: 14px;
    cursor: pointer;
    font: inherit;
    font-size: 0.84rem;
    font-weight: 850;
    line-height: 1;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  }

  .ut-btn:hover {
    transform: translateY(-1px);
  }

  .ut-btn-blue {
    background: #149d80;
    color: #ffffff;
    box-shadow: 0 10px 22px rgba(20, 157, 128, 0.22);
  }

  .ut-btn-blue:hover {
    background: #0f8f75;
  }

  .ut-btn-green {
    width: 100%;
    background: #101318;
    color: #ffffff;
    box-shadow: 0 10px 22px rgba(16, 19, 24, 0.16);
  }

  .ut-btn-green:hover {
    background: #222833;
  }

  .ut-empty {
    display: grid;
    place-items: center;
    min-height: 280px;
    padding: 42px 18px;
    border: 1px dashed #d9dde7;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.74);
    color: #7b8493;
    text-align: center;
    box-shadow: 0 12px 28px rgba(24, 33, 49, 0.05);
  }

  .ut-empty-box {
    display: grid;
    place-items: center;
    gap: 10px;
    max-width: 320px;
  }

  .ut-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 18px;
    background: #eef8f6;
    color: #149d80;
  }

  .ut-empty-icon svg {
    width: 25px;
    height: 25px;
  }

  .ut-empty p {
    margin: 0;
    color: #596272;
    font-size: 0.93rem;
    font-weight: 750;
  }

  .ut-complete-form {
    display: grid;
    gap: 9px;
    margin-top: 15px;
    padding: 14px;
    border: 1px solid #edf0f5;
    border-radius: 18px;
    background: #fafbfc;
  }

  .ut-form-label {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #4b5563;
    font-size: 0.76rem;
    font-weight: 850;
  }

  .ut-form-label svg {
    width: 15px;
    height: 15px;
    color: #149d80;
  }

  .ut-input {
    width: 100%;
    min-height: 42px;
    padding: 10px 12px;
    border: 1px solid #dfe4ec;
    border-radius: 14px;
    outline: none;
    background: #ffffff;
    color: #101318;
    font: inherit;
    font-size: 0.86rem;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  }

  .ut-input::placeholder {
    color: #a0a7b2;
  }

  .ut-input:hover {
    border-color: #ccd5df;
  }

  .ut-input:focus {
    border-color: #149d80;
    box-shadow: 0 0 0 4px rgba(20, 157, 128, 0.12);
  }

  @media (max-width: 720px) {
    .ut-root {
      padding: 16px;
    }

    .ut-header {
      display: block;
      margin-bottom: 14px;
    }

    .ut-header-stat {
      margin-top: 12px;
      width: 100%;
    }

    .ut-toolbar {
      align-items: stretch;
    }

    .ut-tabs {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .ut-tab {
      flex: 1 0 auto;
    }

    .ut-helper {
      width: 100%;
      justify-content: flex-start;
    }

    .ut-card-main {
      padding: 15px;
    }

    .ut-card-top {
      align-items: flex-start;
    }
  }
`;

function statusBadge(status) {
  if (status === "in_transit") {
    return (
      <span className="ut-badge ut-badge-transit">
        <Truck /> In Transit
      </span>
    );
  }
  if (status === "at_utilization") {
    return (
      <span className="ut-badge ut-badge-util">
        <Settings /> Processing
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="ut-badge ut-badge-done">
        <CheckCircle2 /> Completed
      </span>
    );
  }
  return null;
}

export default function UtilizerPage() {
  const [tab, setTab] = useState("incoming");
  const [incoming, setIncoming] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState({}); // {taskId: {weight, method, notes}}

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === "incoming") {
        const res = await getIncomingTasks();
        setIncoming(res.data);
      } else {
        const res = await getUtilizerHistory();
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptWaste(id);
      setIncoming((prev) => prev.map((t) => (t.id === id ? { ...t, status: "at_utilization" } : t)));
    } catch (err) {
      console.error("Accept error:", err.response?.data || err.message);
    }
  };

  const handleComplete = async (id) => {
    const data = completing[id] || {};
    try {
      await completeProcess(id, {
        weightKg: Number(data.weight || 0),
        method: data.method || "incineration",
        notes: data.notes || "",
      });
      setIncoming((prev) => prev.filter((t) => t.id !== id));
      fetchData();
    } catch (err) {
      console.error("Complete error:", err.response?.data || err.message);
    }
  };

  const tasks = tab === "incoming" ? incoming : history;

  return (
    <>
      <style>{css}</style>
      <div className="ut-root">
        <main className="ut-shell">
          <header className="ut-header">
            <div>
              <span className="ut-kicker">
                <Flame />
                Disposal workflow
              </span>
              <h1>Utilization Station</h1>
              <p>Manage incoming medical waste, confirm receipt, and record disposal outcomes.</p>
            </div>
            <div className="ut-header-stat" aria-label="Visible task count">
              <span>{tab === "incoming" ? "Incoming queue" : "History view"}</span>
              <strong>{tasks.length}</strong>
            </div>
          </header>

          <div className="ut-toolbar">
            <div className="ut-tabs">
              <button className={`ut-tab ${tab === "incoming" ? "active" : ""}`} onClick={() => setTab("incoming")}>
                <Inbox />
                Incoming
                <span className="ut-count">{incoming.length}</span>
              </button>
              <button className={`ut-tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
                <History />
                History
              </button>
            </div>
            <span className="ut-helper">
              <ClipboardList />
              Compact disposal records
            </span>
          </div>

          {loading ? (
            <div className="ut-empty">
              <div className="ut-empty-box">
                <span className="ut-empty-icon">
                  <Loader2 className="ut-spin" />
                </span>
                <p>Loading utilization records...</p>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="ut-empty">
              <div className="ut-empty-box">
                <span className="ut-empty-icon">{tab === "incoming" ? <Truck /> : <ClipboardList />}</span>
                <p>{tab === "incoming" ? "No incoming tasks right now." : "No completed tasks yet."}</p>
              </div>
            </div>
          ) : (
            <section className="ut-grid" aria-label="Utilization tasks">
              {tasks.map((task) => (
                <article key={task.id || task._id} className="ut-card">
                  <div className="ut-card-main">
                    <div className="ut-card-top">
                      <div className="ut-card-title">
                        <span className="ut-card-icon">
                          <Package />
                        </span>
                        <div>
                          <span className="ut-card-id">Task #{(task.id || task._id)?.toString().slice(-6)}</span>
                          <span className="ut-card-sub">Utilization record</span>
                        </div>
                      </div>
                      {statusBadge(task.status)}
                    </div>

                    <div className="ut-meta">
                      <div className="ut-meta-row">
                        <Package className="ut-meta-icon" />
                        <span>
                          Container: <strong>{task.containerId}</strong>
                        </span>
                      </div>
                      <div className="ut-meta-row">
                        <User className="ut-meta-icon" />
                        <span>Driver ID: {task.driverId}</span>
                      </div>
                      {task.disposalLog && (
                        <>
                          <div className="ut-meta-row">
                            <Scale className="ut-meta-icon" />
                            <span>Weight: {task.disposalLog.weightKg} kg</span>
                          </div>
                          <div className="ut-meta-row">
                            <Flame className="ut-meta-icon" />
                            <span>Method: {task.disposalLog.method}</span>
                          </div>
                          <div className="ut-meta-row">
                            <Clock3 className="ut-meta-icon" />
                            <span>Completed: {new Date(task.disposalLog.completedAt).toLocaleString()}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {tab === "incoming" && (
                      <>
                        {task.status === "in_transit" && (
                          <div className="ut-action-strip">
                            <button className="ut-btn ut-btn-blue" onClick={() => handleAccept(task.id)}>
                              <CheckCircle2 />
                              Accept Waste
                            </button>
                          </div>
                        )}

                        {task.status === "at_utilization" && (
                          <div className="ut-complete-form">
                            <label className="ut-form-label">
                              <Scale />
                              Disposal completion
                            </label>
                            <input
                              className="ut-input"
                              type="number"
                              placeholder="Weight (kg)"
                              value={completing[task.id]?.weight || ""}
                              onChange={(e) =>
                                setCompleting((p) => ({
                                  ...p,
                                  [task.id]: { ...p[task.id], weight: e.target.value },
                                }))
                              }
                            />
                            <select
                              className="ut-input"
                              value={completing[task.id]?.method || "incineration"}
                              onChange={(e) =>
                                setCompleting((p) => ({
                                  ...p,
                                  [task.id]: { ...p[task.id], method: e.target.value },
                                }))
                              }
                            >
                              <option value="incineration">Incineration</option>
                              <option value="autoclave">Autoclave</option>
                              <option value="chemical">Chemical treatment</option>
                            </select>
                            <input
                              className="ut-input"
                              type="text"
                              placeholder="Notes (optional)"
                              value={completing[task.id]?.notes || ""}
                              onChange={(e) =>
                                setCompleting((p) => ({
                                  ...p,
                                  [task.id]: { ...p[task.id], notes: e.target.value },
                                }))
                              }
                            />
                            <button className="ut-btn ut-btn-green" onClick={() => handleComplete(task.id)}>
                              <Flame />
                              Mark as Destroyed
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
