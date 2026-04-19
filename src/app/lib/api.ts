const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("kusambwila_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ocorreu um erro na requisição");
  }

  return data;
}

export async function uploadFile(endpoint, file, documentType) {
  const token = localStorage.getItem("kusambwila_token");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao fazer upload do arquivo");
  }

  return data;
}

export const api = {
  auth: {
    login: (data) =>
      apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data) =>
      apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getProfile: () => apiRequest("/auth/profile"),
    updateProfile: (data) =>
      apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  properties: {
    getAll: () => apiRequest("/properties"),
    getOne: (id) => apiRequest(`/properties/${id}`),
    publish: (data) =>
      apiRequest("/properties/publish", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiRequest(`/admin/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  documents: {
    upload: (file, documentType) =>
      uploadFile("/documents/upload", file, documentType),
    getMyDocuments: () => apiRequest("/documents"),
    getDocument: (id) => apiRequest(`/documents/${id}`),
  },
  admin: {
    verifyUser: (userId, data) =>
      apiRequest(`/admin/verify/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getFinancials: () => apiRequest("/admin/financials"),
    documents: {
      getAll: (status = "pending") =>
        apiRequest(`/admin/documents?status=${status}`),
      getOne: (id) => apiRequest(`/admin/documents/${id}`),
      approve: (id, notes) =>
        apiRequest(`/admin/documents/${id}/approve`, {
          method: "PUT",
          body: JSON.stringify({ adminNotes: notes }),
        }),
      reject: (id, reason) =>
        apiRequest(`/admin/documents/${id}/reject`, {
          method: "PUT",
          body: JSON.stringify({ rejectionReason: reason }),
        }),
    },
  },
};
