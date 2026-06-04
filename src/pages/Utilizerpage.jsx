import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Flame,
  Loader2,
  Package,
  Scale,
  Truck,
} from "lucide-react";
import { getUtilizerHistory } from "../services/api";

const css = `
  .ut-root,
  .ut-root * { box-sizing: border-box; }

  .ut-root {
    min-height: 100vh;
    padding: clamp(18px, 4vw, 32px);
    background:
      radial-gradient(circle at top left, rgba(20, 157, 128, 0.1), transparent 32rem),
      linear-gradient(180deg, #f7f8fb 0%, #f2f3f8 100%);
    color: #111827;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .ut-shell { width: min(1120px, 100%); margin: 0 auto; }

  .ut-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 18px;
  }

  .ut-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
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
  }

  .ut-header h1 {
    margin: 0;
    font-size: clamp(1.42rem, 4.8vw, 1.9rem);
    font-weight: 800;
    letter-spacing: -0.035em;
  }

  .ut-header p {
    max-width: 560px;
    margin: 8px 0 0;
    color: #6f7684;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .ut-header-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .ut-header-stat {
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

  .ut-inbound-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 14px;
    background: #149d80;
    color: #fff;
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 800;
    box-shadow: 0 10px 22px rgba(20, 157, 128, 0.22);
  }

  .ut-inbound-link:hover { background: #0f8f75; }

  .ut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: 14px;
  }

  .ut-card {
    border: 1px solid #e5e8ef;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 12px 28px rgba(24, 33, 49, 0.07);
    padding: 17px;
  }

  .ut-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .ut-card-id {
    font-size: 0.98rem;
    font-weight: 850;
    color: #101318;
  }

  .ut-badge-done {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 9px;
    border-radius: 999px;
    background: #eaf8f4;
    color: #0f8f75;
    font-size: 0.72rem;
    font-weight: 850;
  }

  .ut-meta { display: grid; gap: 8px; }

  .ut-meta-row {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #687182;
    font-size: 0.84rem;
  }

  .ut-meta-row svg { width: 16px; height: 16px; color: #149d80; flex-shrink: 0; }
  .ut-meta-row strong { color: #202631; font-weight: 800; }

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
  }

  .ut-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    margin-bottom: 10px;
    border-radius: 18px;
    background: #eef8f6;
    color: #149d80;
  }

  .ut-spin { animation: ut-spin 1s linear infinite; }

  @keyframes ut-spin { to { transform: rotate(360deg); } }
`;

export default function UtilizerPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getUtilizerHistory();
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="ut-root">
        <main className="ut-shell">
          <header className="ut-header">
            <div>
              <span className="ut-kicker">
                <Flame />
                Disposal archive
              </span>
              <h1>Utilization Station</h1>
              <p>
                Archive of completed disposals with recorded weight.
                Intake and destruction of waste is handled in Inbound Logistics.
              </p>
            </div>
            <div className="ut-header-actions">
              <Link className="ut-inbound-link" to="/dashboard/utilizer/inbound">
                <Truck size={16} />
                Inbound Logistics
              </Link>
              <div className="ut-header-stat">
                <span>Completed records</span>
                <strong>{history.length}</strong>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="ut-empty">
              <span className="ut-empty-icon">
                <Loader2 size={25} className="ut-spin" />
              </span>
              <p>Loading archive...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="ut-empty">
              <span className="ut-empty-icon">
                <ClipboardList size={25} />
              </span>
              <p>No completed disposals yet.</p>
              <Link className="ut-inbound-link" to="/dashboard/utilizer/inbound" style={{ marginTop: 16 }}>
                <Truck size={16} />
                Go to inbound queue
              </Link>
            </div>
          ) : (
            <section className="ut-grid" aria-label="Disposal history">
              {history.map((task) => (
                <article key={task.id || task._id} className="ut-card">
                  <div className="ut-card-top">
                    <span className="ut-card-id">
                      Task #{(task.id || task._id)?.toString().slice(-6)}
                    </span>
                    <span className="ut-badge-done">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  </div>
                  <div className="ut-meta">
                    <div className="ut-meta-row">
                      <Package />
                      <span>
                        Container: <strong>{task.containerId}</strong>
                      </span>
                    </div>
                    {task.disposalLog && (
                      <>
                        <div className="ut-meta-row">
                          <Scale />
                          <span>
                            Weight:{" "}
                            <strong>
                              {task.disposalLog.actualWeight ?? task.disposalLog.weightKg} kg
                            </strong>
                          </span>
                        </div>
                        <div className="ut-meta-row">
                          <Flame />
                          <span>Method: {task.disposalLog.method}</span>
                        </div>
                        <div className="ut-meta-row">
                          <Clock3 />
                          <span>
                            Completed:{" "}
                            {new Date(task.disposalLog.completedAt).toLocaleString()}
                          </span>
                        </div>
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
