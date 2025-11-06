// ============================================================================
// CENTRALIZED TYPE DEFINITIONS FOR LGCIVS
// ============================================================================
// This file contains all TypeScript types and interfaces used across the application
// Organized by domain for better maintainability
// ============================================================================

import { ComponentType } from 'react';

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export type UserRole = 'applicant' | 'admin' | 'superAdmin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  nin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserRole;
}

export interface RegisterFormData {
  nin: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// ============================================================================
// APPLICATION & CERTIFICATE
// ============================================================================

export type ApplicationStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'under-review' 
  | 'digitization';

export interface Application {
  id: string;
  name: string;
  nin: string;
  status: ApplicationStatus;
  payment: string;
  dateProcessed: string;
  dateApplied: string;
  village?: string;
  lga: string;
  state: string;
  email?: string;
  phone?: string;
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
  paymentReference?: string;
}

export interface ApplicationStepProps {
  formData: ApplicationFormData;
  setFormData: (data: ApplicationFormData) => void;
}

// ============================================================================
// DIGITIZATION
// ============================================================================

export interface DigitizationFormData {
  nin: string;
  email: string;
  phone: string;
  lga: string;
  certificateRef: string;
  paymentReference?: string;
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

export interface DigitizationStepProps {
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
  photoPreview?: string | null;
  ninSlipPreview?: string | null;
  uploadedFile?: string | null;
  setUploadedFile?: (file: string | null) => void;
  handlePhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto?: () => void;
  handleNinSlipUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip?: () => void;
}

// ============================================================================
// LOCAL GOVERNMENT & SUPER ADMIN
// ============================================================================

export interface MonthlyData {
  month: string;
  applications: number;
  revenue?: number;
}

// ============================================================================
// CERTIFICATE
// ============================================================================

export interface Certificate {
  id: string;
  holderName: string;
  nin: string;
  lga: string;
  state: string;
  issueDate: string;
  isDigitized?: boolean;
  qrCode?: string;
  expiryDate?: string;
  downloadUrl?: string;
}

export interface CertificateVerificationData {
  holderName: string;
  certificateId: string;
  lga: string;
  state: string;
  issueDate: string;
  status: string;
  nin?: string;
  expiryDate?: string;
}

// ============================================================================
// ADMIN ONBOARDING
// ============================================================================

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

// ============================================================================
// LOCAL GOVERNMENT ADMIN
// ============================================================================

export interface LocalGovernment {
  id: number;
  name: string;
  state: string;
  admin: string;
  status: 'active' | 'inactive';
  certificates: number;
  revenue: string;
  adminEmail?: string;
  createdAt?: string;
}

export interface DynamicField {
  id: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'file' | 'dropdown';
  is_required: boolean;
  dropdown_options?: string[];
}

export interface DynamicFieldFormData {
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'file' | 'dropdown';
  is_required: boolean;
  dropdown_options: string[];
}

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

export interface StatsData {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: ComponentType<{ className?: string }>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface MonthlyData {
  month: string;
  applications: number;
  revenue?: number;
}

export interface ApprovalData {
  name: string;
  value: number;
  color: string;
}

export interface AuditLogEntry {
  id: number | string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface TabItem {
  value: string;
  label: string;
}

export interface FileUploadState {
  file: File | null;
  preview: string | null;
}

export interface FileUploadProps {
  accept: string;
  maxSize: number;
  onUpload: (file: File) => void;
  preview?: string | null;
  onRemove?: () => void;
  label?: string;
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// ============================================================================
// API & NETWORK
// ============================================================================

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

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// ============================================================================
// THEME & UI STATE
// ============================================================================

export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
  duration?: number;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export interface PaymentConfig {
  applicationFee: number;
  processingFee: number;
  digitizationFee: number;
  digitizationProcessingFee: number;
}

export interface SystemConfig {
  processingDays: number;
  certificateValidity: number;
  maxFileSize: number;
  allowedFileTypes: string[];
}

// ============================================================================
// HELPER TYPE UTILITIES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// PAYMENT
// ============================================================================
export interface Payment {
  id: number;
  reference: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  date: string;
  channel?: string;
  metadata?: Record<string, any>;
}