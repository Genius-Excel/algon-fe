

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// Form validation functions
export const validateNIN = (nin: string): ValidationResult => {
  if (!nin) {
    return { valid: false, message: "NIN is required" };
  }
  if (nin.length !== 11) {
    return { valid: false, message: "NIN must be 11 digits" };
  }
  if (!/^\d+$/.test(nin)) {
    return { valid: false, message: "NIN must contain only numbers" };
  }
  return { valid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { valid: false, message: "Email is required" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }
  return { valid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { valid: false, message: "Phone number is required" };
  }
  const phoneRegex = /^0[789][01]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: "Invalid Nigerian phone number" };
  }
  return { valid: true };
};

export const validatePassword = (password: string, confirmPassword?: string): ValidationResult => {
  if (!password) {
    return { valid: false, message: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }
  return { valid: true };
};

// Application form validation
export const validateApplicationForm = (formData: {
  fullName: string;
  nin: string;
  dob: string;
  phone: string;
  state: string;
  lga: string;
  village: string;
}): ValidationResult => {
  if (!formData.fullName?.trim()) {
    return { valid: false, message: "Full name is required" };
  }
  
  const ninValidation = validateNIN(formData.nin);
  if (!ninValidation.valid) return ninValidation;
  
  if (!formData.dob) {
    return { valid: false, message: "Date of birth is required" };
  }
  
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.valid) return phoneValidation;
  
  if (!formData.state) {
    return { valid: false, message: "State is required" };
  }
  
  if (!formData.lga) {
    return { valid: false, message: "Local government is required" };
  }
  
  if (!formData.village?.trim()) {
    return { valid: false, message: "Village/community is required" };
  }
  
  return { valid: true };
};

// File validation
export const validateFile = (
  file: File | null,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
): ValidationResult => {
  if (!file) {
    return { valid: false, message: "File is required" };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, message: `File size must be less than ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: `File type must be ${allowedTypes.join(', ')}` };
  }
  
  return { valid: true };
};

// utils/formatting.ts
// Formatting utilities

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};

export const formatNIN = (nin: string): string => {
  // Format NIN as XXX-XXX-XXX-XX for display
  if (nin.length !== 11) return nin;
  return `${nin.slice(0, 3)}-${nin.slice(3, 6)}-${nin.slice(6, 9)}-${nin.slice(9)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone as 0XXX XXX XXXX for display
  if (phone.length !== 11) return phone;
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
};

// utils/constants.ts
// Application constants

export const APPLICATION_FEES = {
  NEW_APPLICATION: 5000,
  PROCESSING_FEE: 500,
  DIGITIZATION: 2000,
  DIGITIZATION_PROCESSING: 300
} as const;

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Debit/Credit Card' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'ussd', label: 'USSD' }
] as const;

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DIGITIZATION: 'digitization'
} as const;

export const NIGERIAN_STATES = [
  { value: 'lagos', label: 'Lagos' },
  { value: 'kano', label: 'Kano' },
  { value: 'rivers', label: 'Rivers' },
  { value: 'kaduna', label: 'Kaduna' },
  { value: 'oyo', label: 'Oyo' },
  { value: 'abia', label: 'Abia' },
  { value: 'adamawa', label: 'Adamawa' },
  { value: 'akwa-ibom', label: 'Akwa Ibom' },
  { value: 'anambra', label: 'Anambra' },
  { value: 'bauchi', label: 'Bauchi' },
  { value: 'bayelsa', label: 'Bayelsa' },
  { value: 'benue', label: 'Benue' },
  { value: 'borno', label: 'Borno' },
  { value: 'cross-river', label: 'Cross River' },
  { value: 'delta', label: 'Delta' },
  { value: 'ebonyi', label: 'Ebonyi' },
  { value: 'edo', label: 'Edo' },
  { value: 'ekiti', label: 'Ekiti' },
  { value: 'enugu', label: 'Enugu' },
  { value: 'gombe', label: 'Gombe' },
  { value: 'imo', label: 'Imo' },
  { value: 'jigawa', label: 'Jigawa' },
  { value: 'kebbi', label: 'Kebbi' },
  { value: 'kogi', label: 'Kogi' },
  { value: 'kwara', label: 'Kwara' },
  { value: 'nasarawa', label: 'Nasarawa' },
  { value: 'niger', label: 'Niger' },
  { value: 'ogun', label: 'Ogun' },
  { value: 'ondo', label: 'Ondo' },
  { value: 'osun', label: 'Osun' },
  { value: 'plateau', label: 'Plateau' },
  { value: 'sokoto', label: 'Sokoto' },
  { value: 'taraba', label: 'Taraba' },
  { value: 'yobe', label: 'Yobe' },
  { value: 'zamfara', label: 'Zamfara' },
  { value: 'fct', label: 'Federal Capital Territory' }
] as const;

// Sample LGA data structure
export const LOCAL_GOVERNMENTS: Record<string, { value: string; label: string }[]> = {
  lagos: [
    { value: 'ikeja', label: 'Ikeja' },
    { value: 'lagos-island', label: 'Lagos Island' },
    { value: 'surulere', label: 'Surulere' },
    { value: 'alimosho', label: 'Alimosho' },
    { value: 'oshodi-isolo', label: 'Oshodi-Isolo' },
    { value: 'eti-osa', label: 'Eti-Osa' },
    { value: 'mushin', label: 'Mushin' },
    { value: 'ajeromi-ifelodun', label: 'Ajeromi-Ifelodun' },
    { value: 'kosofe', label: 'Kosofe' },
    { value: 'ojo', label: 'Ojo' }
  ],
  kano: [
    { value: 'kano-municipal', label: 'Kano Municipal' },
    { value: 'nassarawa', label: 'Nassarawa' },
    { value: 'fagge', label: 'Fagge' },
    { value: 'dala', label: 'Dala' }
  ],
  rivers: [
    { value: 'port-harcourt', label: 'Port Harcourt' },
    { value: 'obio-akpor', label: 'Obio-Akpor' },
    { value: 'eleme', label: 'Eleme' }
  ]
};

// utils/apiHelpers.ts
// API helper functions

export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });
  
  return formData;
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Type definitions
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
export type PaymentMethod = typeof PAYMENT_METHODS[number]['value'];
export type StateValue = typeof NIGERIAN_STATES[number]['value'];