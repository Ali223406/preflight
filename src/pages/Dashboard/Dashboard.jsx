import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { getAllChecklists, deleteChecklist as apiDeleteChecklist } from "../../services/api";
import { useState, useEffect } from "react";

function Dashboard({ checklists: propsChecklists = [], onDeleteChecklist }) {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChecklists = async () => {
      try {
        const data = await getAllChecklists();
        setChecklists(data);
      } catch (err) {
        setError("Erreur lors du chargement des checklists.");
      } finally {
        setLoading(false);
      }
    };

    loadChecklists();
  }, []);

  // Fonction locale pour supprimer une checklist
  const handleDeleteChecklist = async (id) => {
    if (window.confirm("Supprimer cette checklist ?")) {
      try {
        await apiDeleteChecklist(id);
        setChecklists((prev) => prev.filter((checklist) => checklist.id !== id));
      } catch (err) {
        setError("Erreur lors de la suppression de la checklist.");
      }
    }
  };

  // Gestion affichage loading / erreur
  if (loading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">PREFLIGHT CHECKLIST</h1>
        <p>Chargement des checklists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">PREFLIGHT CHECKLIST</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Render principal
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">PREFLIGHT CHECKLIST</h1>

      {/* Bouton NOUVEAU */}
      <div className="new-btn-container">
        <Link to="/check" className="new-checklist-btn">+ New</Link>
      </div>

      {/* Message si aucune checklist */}
      {checklists.length === 0 && (
        <p className="no-checklist-message">
          Aucune checklist créée pour le moment.
        </p>
      )}

      {/* Liste des checklists */}
      {checklists.length > 0 && (
        <div className="checklist-list">
          {checklists.map((list) => {
            const total = list.tasks?.length || 0;
            const done = list.tasks?.filter((t) => t.done).length || 0;
            const status =
              total === 0 ? "Vierge" : done === total ? "Terminée" : "En cours";

            return (
              <div key={list.id} className="checklist-card">
                <div
                  className="checklist-info"
                  onClick={() => navigate(`/check/${list.id}`)}
                >
                  <h2>{list.title}</h2>
                  {list.description && <p>{list.description}</p>}
                  <small>{done}/{total} tâches — <b>{status}</b></small>
                </div>

                <div className="checklist-actions">
                  <Link to={`/edit/${list.id}`} className="btn edit-btn">Éditer</Link>
                  <button
                    className="btn delete-btn"
                    onClick={() =>
                      onDeleteChecklist
                        ? onDeleteChecklist(list.id)
                        : handleDeleteChecklist(list.id)
                    }
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
