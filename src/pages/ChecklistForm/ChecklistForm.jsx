import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createChecklist, updateChecklist, getChecklistById } from "../../services/api";
import "./ChecklistForm.css";

function ChecklistForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    todo: [],
  });

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
        console.error(err);
      }
    };
    loadChecklist();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    setFormData((prev) => ({
      ...prev,
      todo: [...prev.todo, { title: "", description: "", statut: 0 }],
    }));
  };

  const updateTask = (index, key, value) => {
    const updatedTasks = [...formData.todo];
    updatedTasks[index][key] = value;
    setFormData((prev) => ({ ...prev, todo: updatedTasks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await updateChecklist(id, formData);
      else await createChecklist(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
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
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="text-area-field"
      />
      <h3>Tasks</h3>
      {formData.todo.map((task, i) => (
        <div key={i}>
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(i, "title", e.target.value)}
            placeholder="Titre tâche"
          />
          <input
            type="text"
            value={task.description}
            onChange={(e) => updateTask(i, "description", e.target.value)}
            placeholder="Description tâche"
          />
        </div>
      ))}
      <button type="button" onClick={addTask}>
        + Ajouter une tâche
      </button>
      <button type="submit">{isEditing ? "Enregistrer" : "Créer"}</button>
    </form>
  );
}

export default ChecklistForm;

