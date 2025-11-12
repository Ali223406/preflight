import { useState,useEffect } from "react";
import "./ChecklistView.css";
import { getChecklistById , updateTask} from "../../services/api";
import { useParams } from "react-router-dom";
  
function ChecklistView() {
  const { id } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getChecklistById(id);
        setChecklist(data);
      } catch (err) {
        setError("Erreur lors du chargement de la checklist.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);
 
   const handletoggleTask =async(taskId)=>{
    try {
      const updatedChecklist = await updateTask(id, taskId);
      setChecklist(updatedChecklist);
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche.");
    }
    };


  if (loading) {
    return <div>Chargement de la checklist...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }


  if (!checklist) {
    return <div className="no-checklist-message">Aucune checklist trouvée.</div>;
  }
  return (
    <div className="checklist-view-container">
      <h1 className="checklist-title">{checklist.title}</h1>
      {checklist.description && <p className="checklist-description">{checklist.description}</p>}
      <div className="tasks-list">
        {checklist.tasks.map((task) => (
          <div key={task.id} className="task-item">
            <input type="checkbox" checked={task.done} onChange={() => handletoggleTask=(task.id)} className="task-checkbox" />
            <span className="task-text">{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ChecklistView;

