export { default as authService } from "./auth.service";
export { default as applicationService } from "./application.service";
export { default as certificateService } from "./certificate.service";
export { default as digitizationService } from "./digitization.service";
export { default as adminService } from "./admin.service";
export { default as paymentService } from "./payment.service";
export { default as apiClient } from "./api";

// Export types
export type {
  UserInfo,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "./auth.service";

export {
  mockAuthService,
  mockApplicationService,
  mockCertificateService,
  mockDigitizationService,
  mockAdminService,
} from "./mock.service";
