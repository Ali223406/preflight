import { useState } from "react";
import "./styles/App.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import { Routes, Route } from "react-router-dom";
import ChecklistForm from "./pages/ChecklistForm/ChecklistForm.jsx";
import ChecklistView from "./pages/ChecklistView/ChecklistView.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <Routes>
        {/* Dashboard principal */}
        <Route path="/" element={<Dashboard />} />

        {/* Formulaire création / modification */}
        <Route path="/checklist-form" element={<ChecklistForm />} />
        <Route path="/checklist-form/:id" element={<ChecklistForm />} />

        {/* Affichage d'une checklist */}
        <Route path="/check/:id" element={<ChecklistView />} />

        {/* Page 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;

