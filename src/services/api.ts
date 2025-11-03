// services/api.ts - Enhanced with validation and error handling
import { 
  validateNIN, 
  validateEmail, 
  validatePhone, 
  validatePassword,
  buildFormData,
  handleApiError 
} from '../utils/validation';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nin: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ApplicationRequest {
  fullName: string;
  nin: string;
  dob: string;
  state: string;
  lga: string;
  village: string;
  phone: string;
  email: string;
  profilePhoto?: File;
  ninSlip?: File;
  address: string;
  landmark: string;
}

// API Request Handler with automatic token injection
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse> => {
    // Client-side validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.message };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.message };
    }

    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    // Validate all fields
    const ninValidation = validateNIN(data.nin);
    if (!ninValidation.valid) {
      return { success: false, error: ninValidation.message };
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.message };
    }

    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
      return { success: false, error: phoneValidation.message };
    }

    const passwordValidation = validatePassword(data.password, data.confirmPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.message };
    }

    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        nin: data.nin,
        email: data.email,
        phone: data.phone,
        password: data.password,
      }),
    });
  },

  logout: async (): Promise<ApiResponse> => {
    return apiRequest('/auth/logout/', {
      method: 'POST',
    });
  },

  getProfile: async (): Promise<ApiResponse> => {
    return apiRequest('/auth/profile/');
  },

  refreshToken: async (): Promise<ApiResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiRequest('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },
};

// Applications API
export const applicationsAPI = {
  submit: async (data: ApplicationRequest): Promise<ApiResponse> => {
    // Validate required fields
    if (!data.fullName?.trim()) {
      return { success: false, error: 'Full name is required' };
    }

    const ninValidation = validateNIN(data.nin);
    if (!ninValidation.valid) {
      return { success: false, error: ninValidation.message };
    }

    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
      return { success: false, error: phoneValidation.message };
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.message };
    }

    // Build FormData for file upload
    const formData = buildFormData(data);

    return apiRequest('/applications/', {
      method: 'POST',
      body: formData,
    });
  },

  getAll: async (filters?: {
    status?: string;
    lg?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/applications/${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/applications/${id}/`);
  },

  updateStatus: async (
    id: string,
    status: 'approved' | 'rejected',
    comment?: string
  ): Promise<ApiResponse> => {
    return apiRequest(`/applications/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  },

  getMy: async (): Promise<ApiResponse> => {
    return apiRequest('/applications/my/');
  },
};

// Certificates API
export const certificatesAPI = {
  download: async (id: string): Promise<Blob | null> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/certificates/${id}/download/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      return await response.blob();
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  },

  verify: async (certificateNumber: string): Promise<ApiResponse> => {
    if (!certificateNumber?.trim()) {
      return { success: false, error: 'Certificate number is required' };
    }

    return apiRequest(`/certificates/verify/${certificateNumber}/`);
  },

  getPreview: async (applicationId: string): Promise<ApiResponse> => {
    return apiRequest(`/certificates/preview/${applicationId}/`);
  },
};

// Digitization API
export const digitizationAPI = {
  submit: async (data: {
    nin: string;
    email: string;
    phone: string;
    lga: string;
    certificateRef?: string;
    certificateFile: File;
    profilePhoto?: File;
    ninSlip?: File;
  }): Promise<ApiResponse> => {
    // Validate fields
    const ninValidation = validateNIN(data.nin);
    if (!ninValidation.valid) {
      return { success: false, error: ninValidation.message };
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.message };
    }

    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
      return { success: false, error: phoneValidation.message };
    }

    if (!data.certificateFile) {
      return { success: false, error: 'Certificate file is required' };
    }

    const formData = buildFormData(data);

    return apiRequest('/digitization/requests/', {
      method: 'POST',
      body: formData,
    });
  },

  getAll: async (filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/digitization/requests/${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  updateStatus: async (
    id: string,
    status: 'approved' | 'rejected',
    comment?: string
  ): Promise<ApiResponse> => {
    return apiRequest(`/digitization/requests/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  },
};

// Admin Onboarding API
export const adminOnboardingAPI = {
  complete: async (data: {
    fullName: string;
    phone: string;
    password: string;
    state: string;
    localGovernment: string;
    permissions: Record<string, boolean>;
  }): Promise<ApiResponse> => {
    // Validate fields
    if (!data.fullName?.trim()) {
      return { success: false, error: 'Full name is required' };
    }

    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
      return { success: false, error: phoneValidation.message };
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.message };
    }

    return apiRequest('/admin/onboarding/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getStates: async (): Promise<ApiResponse> => {
    return apiRequest('/states/');
  },

  getLocalGovernments: async (stateId: string): Promise<ApiResponse> => {
    return apiRequest(`/lgs/?state=${stateId}`);
  },
};

// Dynamic Requirements API
export const requirementsAPI = {
  getAll: async (lgId?: string): Promise<ApiResponse> => {
    const endpoint = lgId ? `/lg/requirements/?lg=${lgId}` : '/lg/requirements/';
    return apiRequest(endpoint);
  },

  create: async (fieldData: {
    field_label: string;
    field_type: string;
    is_required: boolean;
    dropdown_options?: string[];
  }): Promise<ApiResponse> => {
    if (!fieldData.field_label?.trim()) {
      return { success: false, error: 'Field label is required' };
    }

    if (fieldData.field_label.length < 3) {
      return { success: false, error: 'Field label must be at least 3 characters' };
    }

    if (fieldData.field_type === 'dropdown' && (!fieldData.dropdown_options || fieldData.dropdown_options.length < 2)) {
      return { success: false, error: 'Dropdown fields must have at least 2 options' };
    }

    return apiRequest('/lg/requirements/', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  },

  update: async (
    fieldId: string,
    fieldData: {
      field_label: string;
      field_type: string;
      is_required: boolean;
      dropdown_options?: string[];
    }
  ): Promise<ApiResponse> => {
    return apiRequest(`/lg/requirements/${fieldId}/`, {
      method: 'PUT',
      body: JSON.stringify(fieldData),
    });
  },

  delete: async (fieldId: string): Promise<ApiResponse> => {
    return apiRequest(`/lg/requirements/${fieldId}/`, {
      method: 'DELETE',
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: async (lgId?: string): Promise<ApiResponse> => {
    const endpoint = lgId ? `/analytics/dashboard/?lg=${lgId}` : '/analytics/dashboard/';
    return apiRequest(endpoint);
  },

  getApplicationTrends: async (
    period: 'week' | 'month' | 'year',
    lgId?: string
  ): Promise<ApiResponse> => {
    const params = new URLSearchParams({ period });
    if (lgId) params.append('lg', lgId);

    return apiRequest(`/analytics/trends/?${params.toString()}`);
  },

  exportData: async (
    type: 'applications' | 'certificates' | 'digitization',
    format: 'csv' | 'excel',
    filters?: any
  ): Promise<Blob | null> => {
    try {
      const params = new URLSearchParams({ type, format });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/analytics/export/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export error:', error);
      return null;
    }
  },
};

// Settings API
export const settingsAPI = {
  get: async (lgId?: string): Promise<ApiResponse> => {
    const endpoint = lgId ? `/settings/?lg=${lgId}` : '/settings/';
    return apiRequest(endpoint);
  },

  update: async (settings: {
    processingTimeDays?: number;
    applicationFee?: number;
    processingFee?: number;
    autoApproval?: boolean;
  }): Promise<ApiResponse> => {
    return apiRequest('/settings/', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};

export default {
  authAPI,
  applicationsAPI,
  certificatesAPI,
  digitizationAPI,
  adminOnboardingAPI,
  requirementsAPI,
  analyticsAPI,
  settingsAPI,
};