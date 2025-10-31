// API service functions for LGCIVS application
// This file contains all API calls for the Local Government Certificate Issuance and Verification System

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers here if needed
      // 'Authorization': `Bearer ${getAuthToken()}`,
    },
    ...options,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    const headers = defaultOptions.headers as Record<string, string>;
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Admin Onboarding API
export const adminOnboardingAPI = {
  // Complete admin onboarding
  completeOnboarding: async (onboardingData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    state: string;
    localGovernment: string;
    permissions: {
      approveApplications: boolean;
      manageFees: boolean;
      manageRequirements: boolean;
      viewAnalytics: boolean;
      exportData: boolean;
    };
  }) => {
    return apiRequest('/admin/onboarding/', {
      method: 'POST',
      body: JSON.stringify(onboardingData),
    });
  },

  // Get states list
  getStates: async () => {
    return apiRequest('/states/');
  },

  // Get local governments for a state
  getLocalGovernments: async (stateId: string) => {
    return apiRequest(`/lgs/?state=${stateId}`);
  },
};

// Dynamic Field Requirements API
export const requirementsAPI = {
  // Get all dynamic fields for a local government
  getRequirements: async (lgId?: string) => {
    const endpoint = lgId ? `/lg/requirements/?lg=${lgId}` : '/lg/requirements/';
    return apiRequest(endpoint);
  },

  // Create a new dynamic field
  createRequirement: async (fieldData: {
    field_label: string;
    field_type: 'text' | 'number' | 'date' | 'file' | 'dropdown';
    is_required: boolean;
    dropdown_options?: string[]; // For dropdown fields
  }) => {
    return apiRequest('/lg/requirements/', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  },

  // Update an existing dynamic field
  updateRequirement: async (fieldId: string, fieldData: {
    field_label: string;
    field_type: 'text' | 'number' | 'date' | 'file' | 'dropdown';
    is_required: boolean;
    dropdown_options?: string[];
  }) => {
    return apiRequest(`/lg/requirements/${fieldId}/`, {
      method: 'PUT',
      body: JSON.stringify(fieldData),
    });
  },

  // Delete a dynamic field
  deleteRequirement: async (fieldId: string) => {
    return apiRequest(`/lg/requirements/${fieldId}/`, {
      method: 'DELETE',
    });
  },
};

// Applications API
export const applicationsAPI = {
  // Submit a new application with profile photo
  submitApplication: async (applicationData: FormData) => {
    return apiRequest('/applications/', {
      method: 'POST',
      body: applicationData, // FormData for file upload
    });
  },

  // Get all applications (for admin)
  getApplications: async (filters?: {
    status?: string;
    lg?: string;
    page?: number;
    limit?: number;
  }) => {
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

  // Get single application details
  getApplication: async (applicationId: string) => {
    return apiRequest(`/applications/${applicationId}/`);
  },

  // Update application status (approve/reject)
  updateApplicationStatus: async (applicationId: string, status: 'approved' | 'rejected', comment?: string) => {
    return apiRequest(`/applications/${applicationId}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  },

  // Get applicant's own applications
  getMyApplications: async () => {
    return apiRequest('/applications/my/');
  },
};

// Certificate API
export const certificatesAPI = {
  // Download certificate
  downloadCertificate: async (certificateId: string) => {
    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/download/`, {
      headers: {
        // Add auth headers
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }
    
    return response.blob();
  },

  // Verify certificate
  verifyCertificate: async (certificateNumber: string) => {
    return apiRequest(`/certificates/verify/${certificateNumber}/`);
  },

  // Get certificate preview with applicant photo
  getCertificatePreview: async (applicationId: string) => {
    return apiRequest(`/certificates/preview/${applicationId}/`);
  },
};

// Digitization API
export const digitizationAPI = {
  // Submit digitization request
  submitDigitizationRequest: async (requestData: FormData) => {
    return apiRequest('/digitization/requests/', {
      method: 'POST',
      body: requestData,
    });
  },

  // Get digitization requests (for admin)
  getDigitizationRequests: async (filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
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

  // Update digitization request status
  updateDigitizationStatus: async (requestId: string, status: 'approved' | 'rejected', comment?: string) => {
    return apiRequest(`/digitization/requests/${requestId}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  },
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: async (lgId?: string) => {
    const endpoint = lgId ? `/analytics/dashboard/?lg=${lgId}` : '/analytics/dashboard/';
    return apiRequest(endpoint);
  },

  // Get application trends
  getApplicationTrends: async (period: 'week' | 'month' | 'year', lgId?: string) => {
    const params = new URLSearchParams({ period });
    if (lgId) params.append('lg', lgId);
    
    return apiRequest(`/analytics/trends/?${params.toString()}`);
  },

  // Export data
  exportData: async (type: 'applications' | 'certificates' | 'digitization', format: 'csv' | 'excel', filters?: any) => {
    const params = new URLSearchParams({ type, format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/analytics/export/?${params.toString()}`, {
      headers: {
        // Add auth headers
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export data');
    }
    
    return response.blob();
  },
};

// Settings API
export const settingsAPI = {
  // Get LG settings
  getSettings: async (lgId?: string) => {
    const endpoint = lgId ? `/settings/?lg=${lgId}` : '/settings/';
    return apiRequest(endpoint);
  },

  // Update LG settings
  updateSettings: async (settings: {
    processingTimeDays?: number;
    applicationFee?: number;
    processingFee?: number;
    autoApproval?: boolean;
  }) => {
    return apiRequest('/settings/', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};

// Authentication API (if needed)
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Logout
  logout: async () => {
    return apiRequest('/auth/logout/', {
      method: 'POST',
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile/');
  },
};

// Utility functions
export const utils = {
  // Build FormData from object with file handling
  buildFormData: (data: Record<string, any>): FormData => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    
    return formData;
  },

  // Handle API errors consistently
  handleApiError: (error: any) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return { success: false, message, status: error.response.status };
    } else if (error.request) {
      // Request made but no response
      return { success: false, message: 'Network error. Please check your connection.', status: 0 };
    } else {
      // Something else happened
      return { success: false, message: error.message || 'An unexpected error occurred', status: 0 };
    }
  },
};

// Export all APIs as default
export default {
  adminOnboardingAPI,
  requirementsAPI,
  applicationsAPI,
  certificatesAPI,
  digitizationAPI,
  analyticsAPI,
  settingsAPI,
  authAPI,
  utils,
};