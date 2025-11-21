import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchChecklists,
  deleteChecklistThunk,
} from "../../store/checklistsSlice";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { items: checklists, status, error } = useSelector(
    (state) => state.checklists
  );

  // 🔥 Recharger les checklists à chaque fois qu'on arrive sur cette page
  useEffect(() => {
    dispatch(fetchChecklists());
  }, [location.pathname, dispatch]);

  const handleDeleteChecklist = (id) => {
    if (!window.confirm("Supprimer cette checklist ?")) return;
    dispatch(deleteChecklistThunk(id));
  };

  if (status === "loading") return <p>Chargement des checklists...</p>;
  if (status === "failed") return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">PREFLIGHT CHECKLIST</h1>

      <div className="new-btn-container">
        <Link to="/checklist-form" className="new-checklist-btn">
          + New
        </Link>
      </div>

      {checklists.length === 0 && <p>Aucune checklist créée pour le moment.</p>}

      {checklists.length > 0 && (
        <div className="checklist-list">
          {checklists.map((list) => {
            const total = list.todo?.length || 0;
            const done = list.todo?.filter((t) => t.statut === 1).length || 0;
            const statusLabel =
              total === 0 ? "Vierge" : done === total ? "Terminée" : "En cours";

            return (
              <div key={list.id} className="checklist-card">
                <div
                  className="checklist-info"
                  onClick={() => navigate(`/check/${list.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h2>{list.title}</h2>
                  {list.description && <p>{list.description}</p>}
                  <small>
                    {done}/{total} tâches — <b>{statusLabel}</b>
                  </small>
                </div>

                <div className="checklist-actions">
                  <Link
                    to={`/checklist-form/${list.id}`}
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
                                  