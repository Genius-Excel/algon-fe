// Centralized type definitions for LGCIVS

export interface NavigationProps {
  onNavigate: (page: string) => void;
}

// User Types
export type UserRole = 'applicant' | 'lg-admin' | 'super-admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
}

// Application Types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'under-review' | 'digitization';

export interface Application {
  id: string;
  name: string;
  nin: string;
  status: ApplicationStatus;
  payment: string;
  date: string;
  village?: string;
  lga: string;
  state: string;
}

export interface ApplicationFormData {
  fullName: string;
  nin: string;
  dob: string;
  state: string;
  lga: string;
  village: string;
  phone: string;
  email: string;
  profilePhoto: File | null;
  ninSlip: File | null;
  landmark: string;
  address: string;
  paymentMethod: string;
}

// Admin Onboarding Types
export interface AdminPermissions {
  approveApplications: boolean;
  manageFees: boolean;
  manageRequirements: boolean;
  viewAnalytics: boolean;
  exportData: boolean;
}

export interface OnboardingFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  state: string;
  localGovernment: string;
  permissions: AdminPermissions;
}

export interface OnboardingStepProps {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
}

// Digitization Types
export interface DigitizationFormData {
  nin: string;
  email: string;
  phone: string;
  lga: string;
  certificateRef: string;
  paymentMethod: string;
  profilePhoto: File | null;
  ninSlip: File | null;
}

export interface DigitizationRequest {
  id: string;
  name: string;
  nin: string;
  status: ApplicationStatus;
  payment: string;
  date: string;
  certificateRef: string;
  uploadPreview: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  holderName: string;
  nin: string;
  lga: string;
  state: string;
  issueDate: string;
  isDigitized?: boolean;
  qrCode?: string;
}

// LG Admin Types
export interface LocalGovernment {
  id: number;
  name: string;
  state: string;
  admin: string;
  status: 'active' | 'inactive';
  certificates: number;
  revenue: string;
}

export interface DynamicField {
  id: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'file' | 'dropdown';
  is_required: boolean;
  dropdown_options?: string[];
}

// Stats Types
export interface StatsData {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

// Chart Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Select Option Types
export interface SelectOption {
  value: string;
  label: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// File Upload Types
export interface FileUploadState {
  file: File | null;
  preview: string | null;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
  duration?: number;
}