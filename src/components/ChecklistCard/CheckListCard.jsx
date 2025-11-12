import { Link } from "react-router-dom";
import Checklistitem from "../Taskitem/Taskitem";
import "./CheckListCard.css";

const CheckList = ({ checklists, onDoneChecklist, onEditChecklist, onDeleteChecklist }) => {
  // Vérifie qu'il y a au moins une checklist
  if (!checklists || checklists.length === 0) {
    return (
      <div className="Checkliststyle">
        <h1>Aucune checklist à afficher</h1>
      </div>
    );
  }

  // On prend la première checklist
  const checklist = checklists[0];

  // Statut global
  const total = checklist.tasks?.length || 0;
  const doneCount = checklist.tasks?.filter(t => t.done).length || 0;
  const status = total === 0 ? "Vierge" : doneCount === total ? "Terminée" : "En cours";

  return (
    <div className="checklist-container">
      <h1>{checklist.title}</h1>
      {checklist.description && <p>{checklist.description}</p>}
      <span className="checklist-status">{status}</span>

      <div className="tasks-list">
        {checklist.tasks.map((task) => (
          <Checklistitem
            key={task.id}
            checklist={task}      // chaque tâche
            ondone={onDoneChecklist}
            onEdit={onEditChecklist}
            onDelete={onDeleteChecklist}
          />
        ))}
      </div>

      <button className="save-btn" onClick={() => alert("Checklist enregistrée !")}>
        Enregistrer
      </button>

      <Link to="/" className="back-btn">Retour au Dashboard</Link>
    </div>
  );
};

export default CheckList;

