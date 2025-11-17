import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useState, useEffect } from "react";
import { getAllChecklists, deleteChecklist } from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger toutes les checklists
  useEffect(() => {
    const loadChecklists = async () => {
      try {
        const data = await getAllChecklists();
        setChecklists(data.response || []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des checklists.");
      } finally {
        setLoading(false);
      }
    };
    loadChecklists();
  }, []);

  // Supprimer une checklist
  const handleDeleteChecklist = async (id) => {
    if (!window.confirm("Supprimer cette checklist ?")) return;
    try {
      await deleteChecklist(id);
      setChecklists((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la checklist.");
    }
  };

  if (loading) return <p>Chargement des checklists...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">PREFLIGHT CHECKLIST</h1>

      {/* Bouton création */}
      <div className="new-btn-container">
        <Link to="/checklist-form" className="new-checklist-btn">
          + Nouveau
        </Link>
      </div>

      {checklists.length === 0 && <p>Aucune checklist créée pour le moment.</p>}

      {checklists.length > 0 && (
        <div className="checklist-list">
          {checklists.map((list) => {
            const total = list.todo?.length || 0;
            const done = list.todo?.filter((t) => t.statut === 1).length || 0;
            const status =
              total === 0 ? "Vierge" : done === total ? "Terminée" : "En cours";

            return (
              <div key={list.id} className="checklist-card">
                {/* Clic sur la checklist → ChecklistView */}
                <div
                  className="checklist-info"
                  onClick={() => navigate(`/check/${list.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h2>{list.title}</h2>
                  {list.description && <p>{list.description}</p>}
                  <small>
                    {done}/{total} tâches — <b>{status}</b>
                  </small>
                </div>

                {/* Actions */}
                <div className="checklist-actions">
                  <Link
                    to={`/checklist-form/${list.id}`} // Éditer → ChecklistForm
                    className="btn edit-btn"
                  >
                    Éditer
                  </Link>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDeleteChecklist(list.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
