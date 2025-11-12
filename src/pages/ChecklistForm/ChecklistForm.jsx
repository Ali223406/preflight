import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

import "./ChecklistForm.css";
import { useParams } from "react-router-dom";
import { createChecklist, updateChecklist,getChecklistById} from "../../services/api";

function ChecklistForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tasks: [],
  });
  useEffect(() => {
    if (isEditing) {
      const loadChecklist = async () => {
        try {
          const data = await getChecklistById(id);
          setFormData({
            title: data.title,
            description: data.description,
            tasks: data.tasks || [],    
          });
        } catch (error) {
          console.error("Erreur lors du chargement de la checklist :", error);
        }
        };
        loadChecklist();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
   const addTask= ()=>{
   setFormData((prevData)=>({
    ...prevData,
    tasks:[...prevData.tasks,{id:Date.now(),text:"",done:false}]
   }))
  };

  const updateTask = (taskId, newText) => {
    setFormData((prevData) => ({
      ...prevData,
      tasks: prevData.tasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateChecklist(id, formData);        
        } else {
        await createChecklist(formData);
      }
        navigate("/");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la checklist :", error);
    }
    };
    return (
    <form onSubmit={handleSubmit} className="checklist-form">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter checklist title"
        className="input-field"
      />
        <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter checklist description"
        className="text-area-field"
      />
        <div className="tasks-section">
        <h3>Tasks</h3>
        {formData.tasks &&
          formData.tasks.map((task) => (
            <input
              key={task.id}
              type="text"
                value={task.text}
                onChange={(e) => updateTask(task.id, e.target.value)}
                placeholder="Enter task description"
                className="task-input-field"
            />
            ))}
        <button type="button" onClick={addTask} className="add-task-button">
            + Add Task
        </button>
      </div>
      <button type="submit" className="save-button">
        {isEditing ? "Save Changes" : "Create Checklist"}
      </button>
    </form>
  );
}
export default ChecklistForm
  

