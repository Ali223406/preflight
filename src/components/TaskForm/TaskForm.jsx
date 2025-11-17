import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createChecklist, updateChecklist, getChecklistById } from "../../services/api";
import "./ChecklistForm.css";

function ChecklistForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger checklist existante si édition
  useEffect(() => {
    if (isEditing) {
      const loadChecklist = async () => {
        try {
          const data = await getChecklistById(id);
          setTitle(data.title || "");
          setDescription(data.description || "");
          setTasks(
            data.todo?.map(t => ({
              title: t.title || "",
              description: t.description || "",
              statut: t.statut || 0
            })) || []
          );
        } catch (err) {
          console.error(err);
          setError("Erreur lors du chargement de la checklist.");
        }
      };
      loadChecklist();
    }
  }, [id, isEditing]);

  // Gestion des tâches
  const addTask = () => setTasks([...tasks, { title: "", description: "", statut: 0 }]);
  const updateTask = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };
  const removeTask = (index) => setTasks(tasks.filter((_, i) => i !== index));

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const checklistData = {
      user_id: 1, // ou dynamique si besoin
      title: title.trim(),
      description: description.trim(),
      todo: tasks.map(t => ({
        title: t.title.trim(),
        description: t.description.trim(),
        statut: t.statut || 0
      }))
    };

    try {
      if (isEditing) {
        await updateChecklist(id, checklistData);
      } else {
        await createChecklist(checklistData);
      }
      navigate("/"); // Retour au dashboard
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde de la checklist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ChecklistForm">
      <h2>{isEditing ? "Modifier la checklist" : "Nouvelle checklist"}</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la checklist"
        className="InputField"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description de la checklist"
        className="TextAreaField"
      />

      <h3>Tâches</h3>
      {tasks.map((task, index) => (
        <div key={index} className="task-item">
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(index, "title", e.target.value)}
            placeholder="Titre tâche"
            required
          />
          <input
            type="text"
            value={task.description}
            onChange={(e) => updateTask(index, "description", e.target.value)}
            placeholder="Description tâche"
          />
          <select
            value={task.statut}
            onChange={(e) => updateTask(index, "statut", parseInt(e.target.value))}
          >
            <option value={0}>Non fait</option>
            <option value={1}>Fait</option>
          </select>
          <button type="button" onClick={() => removeTask(index)}>
            Supprimer
          </button>
        </div>
      ))}

      <button type="button" onClick={addTask}>
        + Ajouter une tâche
      </button>

      {error && <p className="ErrorMessage">{error}</p>}
      <button type="submit" className="AddButton">
        {loading ? (isEditing ? "Modification..." : "Création...") : (isEditing ? "Sauvegarder" : "Créer la checklist")}
      </button>
      <button type="button" onClick={() => navigate("/")} className="BackButton">
        Retour au dashboard
      </button>
    </form>
  );
}

export default ChecklistForm;
