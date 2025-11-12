import axios from "axios";
const API_URL = "https://greenvelvet.alwaysdata.net/pfc";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
   "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use((config) => {
  // You can add authorization headers or other custom headers here
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
});
export  const getAllChecklists = async () => {
  const response = await apiClient.get("/checklists");
  return response.data;
};

export const getChecklistById = async (id) => {
  const response = await apiClient.get(`/checklists/${id}`);
  return response.data;
};

export const getApiInfo = async () => {
  const response = await apiClient.get("/");
  return response.data;
};

export const pingApi = async () => {
  const response = await apiClient.get("/ping");
  return response.data;
};

export const createChecklist = async (data) => {
    const response = await apiClient.post("/checklists/add", data);
    return response.data;
};
    

export const updateChecklist = async (id, data) => {
  const response = await apiClient.post(`/checklists/update/${id}`, data);
  return response.data;
};

export const deleteChecklist = async (id) => {
  const response = await apiClient.get(`/checklists/delete/${id}`);
  return response.data;
 };  
export const updateChecklistStatus = async (id, status) => {
    const response = await apiClient.get(`/checklists/updateStatus/${id}`, {  params : {status },});
    return response.data;

};
export default apiClient;





