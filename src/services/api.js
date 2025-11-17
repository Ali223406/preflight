import axios from "axios";

const API_URL = "https://greenvelvet.alwaysdata.net/pfc"; 
const token = "d8aabcf891a01878fd64655e55a660961cf07787";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "token": token
  },
});

apiClient.interceptors.request.use((config) => {
  console.log("➡️ Envoi de la requête vers :", config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Réponse reçue de :", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Erreur sur :", error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Fonction pour récupérer toutes les checklists
export const getAllChecklists = async () => {
  console.log("🔄 getAllChecklists appelé");
  console.log("➡️ Token envoyé :", token); // Vérifie le token

  try {
    const response = await apiClient.get("/checklists");
    console.log("📦 Données reçues getAllChecklists :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ getAllChecklists a échoué :", error);
    throw error;
  }
};

// Fonction pour récupérer une checklist par ID
export const getChecklistById = async (id) => {
  console.log("🔄 getChecklistById appelé avec id :", id);
  try {
    const response = await apiClient.get(`/checklist?id=${id}`);
    console.log("📦 Données reçues getChecklistById :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ getChecklistById a échoué :", error);
    throw error;
  }
};

// Création d'une checklist
export const createChecklist = async (data) => {
  console.log(" createChecklist appelé avec :", data);
  try {
    const response = await apiClient.post("/checklist/add", data);
    console.log("📦 Données reçues createChecklist :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ createChecklist a échoué :", error);
    throw error;
  }
};

// Update checklist
export const updateChecklist = async (id, data) => {
  console.log(" updateChecklist appelé avec id :", id, "data :", data);
  try {
    const response = await apiClient.post("/checklist/update",{ id, ...data });
    console.log(JSON.stringify({ id, ...data }))
    return response.data;
  } catch (error) {
    console.error(" updateChecklist a échoué :", error);
    throw error;
  }
};

// Delete checklist
export const deleteChecklist = async (id) => {
  console.log(" deleteChecklist appelé avec id :", id);
  try {
    const response = await apiClient.get(`/checklist/delete?id=${id}`);
    console.log(" Données reçues deleteChecklist :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ deleteChecklist a échoué :", error);
    throw error;
  }
};

// Update statut
export const updateChecklistStatus = async (id, status) => {
  console.log("🔄 updateChecklistStatus appelé avec id :", id, "status :", status);
  try {
    const response = await apiClient.get(`/checklist/status?id=${id}&status=${status}`);
    console.log(" Données reçues updateChecklistStatus :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ updateChecklistStatus a échoué :", error);
    throw error;
  }
};

export default apiClient;
