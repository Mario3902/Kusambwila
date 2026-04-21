const API_BASE_URL = "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const token = localStorage.getItem("kusambwila_token");

  const headers: Record<string, string> = {
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

export async function uploadFile(endpoint: string, file: File, documentType: string) {
  const token = localStorage.getItem("kusambwila_token");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const headers: Record<string, string> = {};

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

interface AuthData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  userType?: string;
  biNumber?: string;
}

interface PropertyData {
  title: string;
  description?: string;
  price: number;
  location: string;
  district: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featured?: boolean;
}

interface VerificationData {
  biStatus?: string;
  propertyTitleStatus?: string;
  addressProofStatus?: string;
  isVerified?: boolean;
  verificationScore?: number;
}

export const api = {
  auth: {
    login: (data: AuthData) =>
      apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: AuthData) =>
      apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getProfile: () => apiRequest("/auth/profile"),
    updateProfile: (data: Record<string, string>) =>
      apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  properties: {
    getAll: () => apiRequest("/properties"),
    getOne: (id: string | number) => apiRequest(`/properties/${id}`),
    publish: (data: PropertyData) =>
      apiRequest("/properties/publish", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string | number, data: Partial<PropertyData>) =>
      apiRequest(`/admin/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    // Para proprietários
    getMyProperties: () => apiRequest("/my-properties"),
    updateStatus: (id: string | number, status: 'available' | 'rented' | 'inactive') =>
      apiRequest(`/properties/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },
  favorites: {
    getAll: () => apiRequest("/favorites"),
    add: (propertyId: number, notes?: string) =>
      apiRequest("/favorites", {
        method: "POST",
        body: JSON.stringify({ propertyId, notes }),
      }),
    remove: (propertyId: number) =>
      apiRequest(`/favorites/${propertyId}`, {
        method: "DELETE",
      }),
  },
  documents: {
    upload: (file: File, documentType: string) =>
      uploadFile("/documents/upload", file, documentType),
    getMyDocuments: () => apiRequest("/documents"),
    getDocument: (id: string | number) => apiRequest(`/documents/${id}`),
  },
  admin: {
    verifyUser: (userId: string | number, data: VerificationData) =>
      apiRequest(`/admin/verify/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getFinancials: () => apiRequest("/admin/financials"),
    getStats: () => apiRequest("/admin/stats"),
    getUsers: () => apiRequest("/admin/users"),
    getUser: (id: string | number) => apiRequest(`/admin/users/${id}`),
    deleteProperty: (id: string | number) =>
      apiRequest(`/admin/properties/${id}`, {
        method: "DELETE",
      }),
    documents: {
      getAll: (status = "pending") =>
        apiRequest(`/admin/documents?status=${status}`),
      getOne: (id: string | number) => apiRequest(`/admin/documents/${id}`),
      approve: (id: string | number, notes?: string) =>
        apiRequest(`/admin/documents/${id}/approve`, {
          method: "PUT",
          body: JSON.stringify({ adminNotes: notes }),
        }),
      reject: (id: string | number, reason: string) =>
        apiRequest(`/admin/documents/${id}/reject`, {
          method: "PUT",
          body: JSON.stringify({ rejectionReason: reason }),
        }),
    },
  },
};
