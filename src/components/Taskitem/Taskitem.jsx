import { useState } from "react";

function Checklistitem({ checklist, ondone, onEdit, onDelete }) {   // Receive props
  const [isEditing, setIsEditing] = useState(false);               // State for edit mode
  const [editedTitle, setEditedTitle] = useState(checklist.title); // State for edited title  

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editedTitle.trim() !== "") {
      onEdit(checklist.id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(checklist.title);
  };

  if (!checklist) return null;

  return (
    <div className="Tacheitems">  
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="EditForm">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button type="submit" className="SaveButton">Enregistrer</button>
          <button type="button" onClick={handleCancelEdit} className="CancelButton">
            Annuler
          </button>
        </form>
      ) : (
        <div>
          <input
            type="checkbox"
            checked={checklist.done}
            onChange={() => ondone(checklist.id)}
            className="Check"
          />
          <span>{checklist.title}</span>
          <button onClick={() => setIsEditing(true)} className="EditButton">Modifier</button>
          <button onClick={() => onDelete(checklist.id)} className="Delete">Supprimer</button>
        </div>
      )}
    </div>
  );
}

export default Checklistitem;
