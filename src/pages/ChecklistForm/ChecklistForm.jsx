import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addChecklistThunk,
  updateChecklistThunk,
} from "../../store/checklistsSlice";
import { getChecklistById } from "../../services/api"; // pour pré-remplir lors de l'édition
import "./ChecklistForm.css";

function ChecklistForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    todo: [],
  });

  // Charger la checklist existante si on édite
  useEffect(() => {
    if (!isEditing) return;

    const loadChecklist = async () => {
      try {
        const data = await getChecklistById(id);
        setFormData({
          title: data.title,
          description: data.description,
          todo: data.todo || [],
        });
      } catch (err) {
        console.error("Erreur lors du chargement de la checklist :", err);
      }
    };

    loadChecklist();
  }, [id, isEditing]);

  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Ajouter une tâche
  const addTask = () => {
    setFormData((prev) => ({
      ...prev,
      todo: [...prev.todo, { title: "", description: "", statut: 0 }],
    }));
  };

  // Modifier une tâche existante
  const updateTask = (index, key, value) => {
    const updatedTasks = [...formData.todo];
    updatedTasks[index][key] = value;
    setFormData((prev) => ({ ...prev, todo: updatedTasks }));
  };

  // Supprimer une tâche
  const deleteTask = (index) => {
    const updatedTasks = [...formData.todo];
    updatedTasks.splice(index, 1);
    setFormData((prev) => ({ ...prev, todo: updatedTasks }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(updateChecklistThunk({ id, ...formData })).unwrap();
      } else {
        await dispatch(addChecklistThunk(formData)).unwrap();
      }
      navigate("/"); // retourne au Dashboard automatiquement mis à jour
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checklist-form">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Titre de la checklist"
        className="input-field"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="text-area-field"
      />
      <h3>Tâches</h3>
      {formData.todo.map((task, i) => (
        <div key={i} className="task-item">
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(i, "title", e.target.value)}
            placeholder="Titre tâche"
            required
          />
          <input
            type="text"
            value={task.description}
            onChange={(e) => updateTask(i, "description", e.target.value)}
            placeholder="Description tâche"
          />
          <button
            type="button"
            className="delete-task-btn"
            onClick={() => deleteTask(i)}
          >
            Supprimer
          </button>
        </div>
      ))}
      <button type="button" onClick={addTask} className="add-task-btn">
        + Ajouter une tâche
      </button>
      <button type="submit" className="submit-btn">
        {isEditing ? "Enregistrer" : "Créer"}
      </button>
    </form>
  );
}

export default ChecklistForm;
