import { useState, useEffect } from "react";
import "./styles/App.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import { Routes, Route } from "react-router-dom";
import AddChecklistForm from "./components/TaskForm/TaskForm.jsx";
import CheckList from "./components/ChecklistCard/CheckListCard.jsx";

function App() {
  const [checklists, setChecklists] = useState([
    {
      id: 1,
      title: "Remplir le carburant",
      description: "Vérifier le niveau avant départ",
      tasks: [
        { id: 1, text: "Vérifier carburant", done: false },
        { id: 2, text: "Remplir réservoir", done: false }
      ]
    },
    {
      id: 2,
      title: "Vérifier les fils",
      description: "S’assurer que tout est branché correctement",
      tasks: [{ id: 1, text: "Contrôle fils moteur", done: true }]
    },
    {
      id: 3,
      title: "Inspection des pneus",
      description: "Vérifier la pression et l'état des pneus",
      tasks: [
        { id: 1, text: "Vérifier la pression des pneus", done: false },
        { id: 2, text: "Rechercher des signes d'usure", done: false }
      ]
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleAddChecklist = (newChecklist) => {
    setChecklists([...checklists, newChecklist]);
  };

  const handleDeleteChecklist = (id) => {
    setChecklists(checklists.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              checklists={checklists}
              onDeleteChecklist={handleDeleteChecklist}
            />
          }
        />
        <Route
          path="/check"
          element={
            <>
              <h1 className="text-4xl font-bold mb-6">
                Checklist ({checklists.length})
              </h1>
              <AddChecklistForm onAddChecklist={handleAddChecklist} />
              <CheckList
                checklists={checklists}
                onDoneChecklist={() => {}}
                onEditChecklist={() => {}}
                onDeleteChecklist={handleDeleteChecklist}
              />
            </>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;

