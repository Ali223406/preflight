import { useState } from "react";
import "./TaskForm.css";
import { useNavigate } from "react-router-dom";
import { createChecklist } from "../../services/api";

function AddChecklistForm({ onAddChecklist }) { // Receive the onAddChecklist prop
  const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate=     useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {    // Handle form submission
    e.preventDefault();           // Prevent default form behavior
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const newChecklist = await createChecklist({ title, description });
      onAddChecklist(newChecklist);
      setTitle("");
      setDescription("");
      navigate("/");
    } catch (err) {
      setError("Erreur lors de la création de la checklist.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
   <form onSubmit={handleSubmit} className="ChecklistForm"> 
      <input
        type="text"              // Input field for checklist title
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Update state on input change
        placeholder="Enter checklist title"         // Placeholder text 
        className="InputField"
      />
      <textarea 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter checklist description"
        className="TextAreaField"   
        />
        {error && <p className="ErrorMessage">{error}</p>}
        <button type="submit" className="AddButton">Create Checklist</button>
      {loading && <p>Creating checklist...</p>} 
    </form>
    );
}
export default AddChecklistForm;