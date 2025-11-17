import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChecklistById, updateChecklist } from "../../services/api";
import "./ChecklistView.css";

function ChecklistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getChecklistById(id);
      setChecklist(data);
    };
    load();
  }, [id]);

  const toggleTask = async (index) => {
    const updatedTasks = [...checklist.todo];
    updatedTasks[index].statut = updatedTasks[index].statut ? 0 : 1;
    const updatedChecklist = { ...checklist, todo: updatedTasks };
    await updateChecklist(id, updatedChecklist);
    setChecklist(updatedChecklist);
  };

  if (!checklist) return <p>Chargement...</p>;

  const total = checklist.todo.length;
  const done = checklist.todo.filter((t) => t.statut === 1).length;
  const status = total === 0 ? "Vierge" : done === total ? "Terminée" : "En cours";

  return (
    <div className="checklist-view-container">
      <h1>{checklist.title}</h1>
      <p>{checklist.description}</p>
      <p>Statut: {status} ({done}/{total})</p>
      <ul>
        {checklist.todo.map((task, i) => (
          <li key={i}>
            <input
              type="checkbox"
              checked={task.statut === 1}
              onChange={() => toggleTask(i)}
            />
            {task.title} - {task.description}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/")}>Retour au Dashboard</button>
    </div>
  );
}

export default ChecklistView;
