import { useEffect, useState } from "react";
import api from "../services/api";
import { createSocket } from "../services/socket";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function Emergencies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let m = true;
    api
      .get("/emergencies")
      .then((r) => m && setItems(r.data))
      .catch(
        (e) =>
          m &&
          setError(e.response?.data?.message || "Failed to load emergencies"),
      )
      .finally(() => m && setLoading(false));
    const s = createSocket();
    const up = (e) => setItems((p) => [e, ...p.filter((x) => x._id !== e._id)]);
    s.on("emergency:new", up);
    s.on("emergency:update", up);
    return () => {
      m = false;
      s.disconnect();
    };
  }, []);
  const update = async (id, status) => {
    try {
      const r = await api.patch(`/emergencies/${id}`, { status });
      setItems((p) => p.map((x) => (x._id === id ? r.data : x)));
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    }
  };
  if (loading) return <Loading />;
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h2>Live Emergencies</h2>
          <p>Manage active emergency records from the backend.</p>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      {!items.length ? (
        <EmptyState title="No emergencies" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Description</th>
                <th>Reported</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id}>
                  <td>
                    <b>{e.type}</b>
                  </td>
                  <td>
                    <span className={`badge ${e.severity}`}>{e.severity}</span>
                  </td>
                  <td>
                    <span className={`badge ${e.status}`}>{e.status}</span>
                  </td>
                  <td>{e.description || "—"}</td>
                  <td>{new Date(e.createdAt).toLocaleString()}</td>
                  <td>
                    <select
                      value={e.status}
                      onChange={(ev) => update(e._id, ev.target.value)}
                    >
                      <option value="active">active</option>
                      <option value="assigned">assigned</option>
                      <option value="resolved">resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
