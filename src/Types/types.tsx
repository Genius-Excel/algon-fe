// ============================================================================
// CENTRALIZED TYPE DEFINITIONS FOR ALGON
// ============================================================================
// This file contains all TypeScript types and interfaces used across the application
// Organized by domain for better maintainability
// ============================================================================

import { ComponentType } from "react";

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export type UserRole = "applicant" | "admin" | "superAdmin";

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
  | "pending"
  | "approved"
  | "rejected"
  | "under-review"
  | "digitization";

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
  full_name: string;
  phone: string;
  state: string;
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

export interface CertificateVerificationResponse {
  message: string;
  data: {
    status: string;
    certificate_type: string;
    expiry_date: string;
    issued_at: string;
    verification_code: string;
    certificate_number: string;
    id: string;
  };
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
  id: string;
  name: string;
  state: {
    name: string;
    id: string;
  };
  asigned_admin?: {
    id: string;
    name: string;
    email: string;
  } | null;
  assigned_admin?: {
    id: string;
    name: string;
    email: string;
  } | null;
  certificates: {
    certificates: number;
    digitization: number;
  };
  revenue: number;
  created_at: string;
  updated_at: string;
}

export interface AllLocalGovernmentsResponse {
  message: string;
  data: LocalGovernment[];
}

export interface DynamicField {
  id: string;
  field_label: string;
  field_name: string;
  field_type: "text" | "number" | "date" | "file" | "dropdown";
  is_required: boolean;
  dropdown_options?: string[];
}

export interface DynamicFieldFormData {
  field_label: string;
  field_name?: string;
  field_type: "text" | "number" | "date" | "file" | "dropdown";
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
// SUPER ADMIN - AUDIT LOGS & DASHBOARD
// ============================================================================

export interface AuditLog {
  id: string;
  action_type: string;
  table_name: string;
  record_id: string | null;
  changes: object | string | null;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user: string;
}

export interface AuditLogsResponse {
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AuditLog[];
  };
}

export interface InviteLGAdminRequest {
  state: string; // UUID of the State
  lga: string; // UUID of the Local Government Area
  first_name: string;
  last_name: string;
  email: string;
}

export interface InviteLGAdminResponse {
  message: string;
  email_status: string;
  data: Array<{
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    email_verified: boolean;
  }>;
}

export interface UpdateLGAdminRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UpdateLGAdminResponse {
  message: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    email_verified: boolean;
  };
}

export interface UpdateLGAdminRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UpdateLGAdminResponse {
  message: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    email_verified: boolean;
  };
}

export interface MetricCard {
  value: number;
  trend?: "up" | "down";
  percent_change?: number;
}

export interface MonthlyMetric {
  month: string;
  total: number;
}

export interface SuperAdminDashboardResponse {
  message: string;
  data: {
    metric_cards: {
      certificates_issued: MetricCard;
      active_lgs: { value: number };
      total_revenue: MetricCard;
      total_applications: MetricCard;
    };
    monthly_applications: MonthlyMetric[];
    monthly_revenue: any[];
    active_lgas: number;
  };
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

export type Theme = "light" | "dark";

export type ToastType = "success" | "error" | "warning" | "info";

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
  status: "pending" | "success" | "failed";
  date: string;
  channel?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// API RESPONSE TYPES FOR CERTIFICATE & DIGITIZATION
// ============================================================================

export interface FeeStructure {
  application_fee: number | null;
  digitization_fee: number | null;
  regeneration_fee: number | null;
  currency: string;
  local_government: string | null;
  last_updated_by: string | null;
}

export interface StateInfo {
  id: string;
  name: string;
}

export interface LocalGovernmentInfo {
  id: string;
  name: string;
}

export interface CertificateApplicationData {
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  state: string;
  local_government: string;
  village: string;
  nin: string;
}

export interface CertificateApplicationResponse {
  message: string;
  data: {
    user_data: CertificateApplicationData;
    extra_fields: any[];
    application_id: string;
  };
}

export interface ApplicationStep2Response {
  message: string;
  data: {
    fee: FeeStructure;
    verification_fee: number | null;
    application_id: string;
  };
}

export interface DigitizationApplicationData {
  id: string;
  email: string;
  phone_number: string;
  state: string;
  local_government: string;
  certificate_reference_number: string;
  nin: string;
  full_name: string;
  payment_status: string;
  verification_status: string;
  reviewed_at: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  reviewed_by: string | null;
}

export interface DigitizationApplicationResponse {
  message: string;
  data: {
    user_data: DigitizationApplicationData;
    fee: FeeStructure;
  };
}

export interface ApplicationListItem {
  id: string;
  nin: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  village: string;
  residential_address: string | null;
  landmark: string | null;
  letter_from_traditional_ruler: string | null;
  profile_photo: string | null;
  nin_slip: string | null;
  application_status: string;
  payment_status: string;
  remarks: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  applicant: string;
  state: StateInfo;
  local_government: LocalGovernmentInfo;
  approved_by: string | null;
}

export interface MyApplicationsResponse {
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ApplicationListItem[];
  };
}

export interface NINVerificationResponse {
  message: string;
}

export interface PaystackPaymentData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaymentInitiationResponse {
  status?: boolean;
  message: string;
  data: {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
    public_key?: string; // Optional: Paystack public key for inline checkout
  };
}

// ============================================================================
// ADMIN - LGA FEE MANAGEMENT
// ============================================================================

export interface LGAFeeData {
  id: string;
  application_fee: string;
  digitization_fee: string;
  regeneration_fee: string;
  currency: string;
  updated_at: string;
  local_government: string;
  last_updated_by: string | null;
  state: string;
}

export interface LGAFeeResponse {
  message: string;
  data: LGAFeeData[];
}

export interface CreateLGAFeeRequest {
  application_fee: number; // Amount in NGN
  digitization_fee: number; // Amount in NGN, 0 if not applicable
  regeneration_fee: number; // Amount in NGN, 0 if not applicable
}

export interface CreateLGAFeeResponse {
  message: string;
  data: LGAFeeData;
}

export interface UpdateLGAFeeRequest {
  application_fee: number; // Amount in NGN
  digitization_fee: number; // Amount in NGN, 0 if not applicable
  regeneration_fee: number; // Amount in NGN, 0 if not applicable
}

export interface UpdateLGAFeeResponse {
  message: string;
  data: LGAFeeData[]; // Returns array with updated fee
}

// ============================================================================
// ADMIN - DYNAMIC FIELDS
// ============================================================================

export interface DynamicResponseFieldData {
  id: string;
  field_label: string;
  field_name: string;
  field_type: string; // e.g., "file", "text", "number"
  is_required: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  local_government: {
    id: string;
    name: string;
  };
}

export interface CreateDynamicFieldRequest {
  local_government: string; // UUID of the LGA
  field_label: string;
  field_name: string;
  is_required: boolean;
  field_type: string;
}

export interface CreateDynamicFieldData {
  id: string;
  field_label: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  local_government: string; // UUID (string, not object)
  created_by: string; // UUID
}

export interface CreateDynamicFieldResponse {
  message: string; // "Additional fields successfully created"
  data: CreateDynamicFieldData;
}

export interface UpdateDynamicFieldRequest {
  field_label: string;
  field_name: string;
  is_required: boolean;
  field_type: string;
}

export interface UpdateDynamicFieldResponse {
  message: string;
  data: DynamicResponseFieldData;
}

// ============================================================================
// ADMIN - APPLICATION DETAILS
// ============================================================================

export interface SingleApplicationDetail {
  id: string;
  nin: string;
  full_name: string;
  phone_number: string;
  email: string;
  uploaded_certificate: string | null;
  certificate_reference_number: string | null;
  profile_photo: string | null;
  nin_slip: string | null;
  payment_status: string;
  verification_status: string;
  reviewed_at: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  applicant: string;
  state: StateInfo;
  local_government: LocalGovernmentInfo;
  reviewed_by: string | null;
}

// ============================================================================
// ADMIN - LG DASHBOARD
// ============================================================================

export interface LGDashboardMetricCard {
  value: number;
  trend: "up" | "down";
  change_percent: number;
}

export interface LGDashboardApplication {
  id: string;
  nin: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  village: string;
  residential_address: string;
  landmark: string | null;
  letter_from_traditional_ruler: string | null;
  profile_photo: string;
  nin_slip: string;
  application_status: string;
  payment_status: string;
  remarks: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  applicant: string;
  state: StateInfo;
  local_government: LocalGovernmentInfo;
  approved_by: string | null;
}

export interface LGAdminDashboardResponse {
  message: string;
  data: {
    metric_cards: {
      pending_applications: LGDashboardMetricCard;
      approved_certificates: LGDashboardMetricCard;
      rejected: LGDashboardMetricCard;
      total_revenue: LGDashboardMetricCard;
    };
    weekly_applications: number;
    approval_statistics: number;
    recent_applications: LGDashboardApplication[];
  };
}

export interface AdminApplicationsResponse {
  message: string;
  data: LGDashboardApplication[];
}

export interface MonthlyBreakdownItem {
  month: string;
  total: number;
}

export interface ReportAnalyticsResponse {
  message: string;
  data: {
    metric_cards: {
      total_revenue: number;
      total_requests: number;
      approval_rate: number;
      average_processing_days: number;
    };
    status_distribution: {
      approved: number;
      pending: number;
      rejected: number;
    };
    monthly_breakdown: {
      certificate: MonthlyBreakdownItem[];
      digitizations: MonthlyBreakdownItem[];
    };
  };
}

// ============================================================================
// STATES AND LOCAL GOVERNMENTS
// ============================================================================

export interface LocalGovernmentBasic {
  id: string;
  name: string;
}

export interface StateWithLGs {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
  updated_at: string;
  local_governtments: LocalGovernmentBasic[]; // Note: API has typo "governtments"
}

export interface AllStatesResponse {
  message: string;
  data: StateWithLGs[];
}

export interface DigitizationOverviewResponse {
  message: string;
  data: {
    approved_requests_this_month: number;
    pending_requests: number;
    revenue_generated: number;
  };
}
