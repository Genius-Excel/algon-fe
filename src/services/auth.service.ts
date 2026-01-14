import apiClient from "./api";
import { tokenManager } from "../utils/tokenManager";
import type { UserRole } from "../Types/types";
import { mockAuthService } from "./mock.service";

const USE_MOCK = false; // Mock data disabled

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    phone?: string;
    nin?: string;
  };
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  nin?: string; // Optional for super-admin
  email: string;
  phone_number: string;
  password: string;
  role?: string;
}

export interface UserInfo {
  id: string;
  last_login: string | null;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  email: string;
  phone_number: string;
  profile_image: string | null;
  alternative_number: string | null;
  email_verified: boolean;
  nin: string;
  account_status: string;
  role: string;
  local_government?: string; // UUID of the local government for LG admins
  groups: any[];
  user_permissions: any[];
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use mock data when enabled
    if (USE_MOCK) {
      const mockResponse = await mockAuthService.login(
        credentials.email,
        credentials.password
      );

      // Store tokens and user data
      tokenManager.setAccessToken(mockResponse.access);
      tokenManager.setRefreshToken(mockResponse.refresh);
      tokenManager.setUserData(mockResponse.user);

      return mockResponse;
    }

    // Real API call to /auth/login
    try {
      const response = await apiClient.post<{
        message: string;
        user_id: string;
        role: string;
        "refresh-token": string;
        "access-token": string;
      }>("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Map backend role format to frontend format
      const mapRole = (backendRole: string): UserRole => {
        if (backendRole === "super-admin") return "superAdmin";
        if (backendRole === "admin" || backendRole === "lg-admin")
          return "admin";
        return "applicant";
      };

      // Map API response to internal format (tokens and user data are at root level)
      const loginData: LoginResponse = {
        access: response.data["access-token"],
        refresh: response.data["refresh-token"],
        user: {
          id: response.data.user_id,
          email: credentials.email,
          role: mapRole(response.data.role),
          name: credentials.email.split("@")[0], // Extract name from email
        },
      };

      // Store tokens and user data
      tokenManager.setAccessToken(loginData.access);
      tokenManager.setRefreshToken(loginData.refresh);
      tokenManager.setUserData(loginData.user);

      // Fetch full user details from /auth/me
      try {
        const userInfo = await this.getCurrentUser();
        const fullName =
          `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim() ||
          credentials.email.split("@")[0];

        // Update user data with actual name
        const updatedUser = {
          ...loginData.user,
          name: fullName,
        };
        tokenManager.setUserData(updatedUser);
        loginData.user = updatedUser;
      } catch (error) {
        console.warn(
          "Failed to fetch user details, using email as name:",
          error
        );
      }

      return loginData;
    } catch (error: any) {
      // Log the full error for debugging
      console.error("Login error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });

      let message = "Login failed";

      if (error.response?.status === 400) {
        message = error.response?.data?.message || "Invalid email or password";
      } else if (error.response?.status === 401) {
        message = error.response?.data?.message || "Invalid credentials";
      } else if (error.response?.status === 403) {
        message = "Account is not active or verified";
      } else if (error.response?.status === 404) {
        message = "User not found";
      } else if (error.response?.status === 429) {
        message = "Too many login attempts. Please try again later.";
      } else if (error.response?.status >= 500) {
        message = "Server error. Please try again later.";
      } else if (
        error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK"
      ) {
        message = "Network error. Please check your connection and try again.";
      } else if (!error.response) {
        message = `Connection failed: ${error.message}`;
      }

      throw new Error(message);
    }
  }

  async getCurrentUser(): Promise<UserInfo> {
    // Use mock data when enabled
    if (USE_MOCK) {
      return await mockAuthService.getCurrentUser();
    }

    const response = await apiClient.get<{
      message: string;
      data: UserInfo;
    }>("/auth/me");

    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    // Use mock data when enabled
    if (USE_MOCK) {
      const mockResponse = await mockAuthService.register(data);

      // Store tokens and user data
      tokenManager.setAccessToken(mockResponse.access);
      tokenManager.setRefreshToken(mockResponse.refresh);
      tokenManager.setUserData(mockResponse.user);

      return mockResponse;
    }

    // Determine role for endpoint - default to 'applicant'
    const role = data.role || "applicant";

    // API expects application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    formData.append("password", data.password);
    formData.append("nin", data.nin);

    try {
      const response = await apiClient.post<{
        message: string;
        data: Array<{
          user_id: string;
          email: string;
          role: string;
          phone_number: string;
          first_name: string;
          last_name: string;
        }>;
      }>(`/register/${role}`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Note: Real API doesn't return tokens on registration
      // User needs to login separately
      const userData = response.data.data[0];

      return {
        access: "", // Will need to login separately
        refresh: "",
        user: {
          id: userData.user_id,
          email: userData.email,
          role: userData.role as UserRole,
          name: `${userData.first_name} ${userData.last_name}`,
          phone: userData.phone_number,
          nin: data.nin,
        },
      };
    } catch (error: any) {
      // Enhanced error handling for specific API error responses
      const errorData = error.response?.data;

      // Map specific API error messages to user-friendly format
      if (errorData?.error) {
        const errorMsg = errorData.error;

        if (errorMsg === "NIN already exists") {
          throw new Error("This NIN is already registered in the system");
        }
        if (errorMsg === "Invalid NIN number, must be 11 digits") {
          throw new Error("NIN must be exactly 11 digits");
        }
        if (errorMsg === "First name missing") {
          throw new Error("First name is required");
        }
        if (errorMsg === "Last name missing") {
          throw new Error("Last name is required");
        }
        if (errorMsg === "Phone number already exists") {
          throw new Error("This phone number is already registered");
        }

        throw new Error(errorMsg);
      }

      if (errorData?.message) {
        if (errorData.message === "email already exist") {
          throw new Error("This email is already registered");
        }
        throw new Error(errorData.message);
      }

      // Re-throw original error if no specific mapping found
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Use mock data when enabled
    if (USE_MOCK) {
      await mockAuthService.logout();
      tokenManager.clearTokens();
      return;
    }

    try {
      const accessToken = tokenManager.getAccessToken();
      const refreshToken = tokenManager.getRefreshToken();

      if (accessToken && refreshToken) {
        // API expects application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append("access_token", accessToken);
        formData.append("refresh_token", refreshToken);

        await apiClient.post<{ message: string }>("/auth/logout", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear tokens even if API call fails
    } finally {
      tokenManager.clearTokens();
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post("/auth/refresh/", {
      refresh: refreshToken,
    });

    tokenManager.setAccessToken(response.data.access);
    return response.data.access;
  }

  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  getUserData() {
    return tokenManager.getUserData();
  }

  async sendPasswordResetEmail(
    email: string,
    deviceType: string = "web"
  ): Promise<{ message: string; email_status: string }> {
    const response = await apiClient.post<{
      message: string;
      email_status: string;
    }>("/auth/reset-mail", {
      email,
      device_type: deviceType,
    });
    return response.data;
  }

  async resetPassword(
    email: string,
    password1: string,
    password2: string,
    token: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{
      message: string;
    }>(`/auth/password-reset?token=${token}`, {
      email,
      password1,
      password2,
    });
    return response.data;
  }

  async verifyInviteToken(token: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        `/token/verify/${token}`
      );
      return response.data;
    } catch (error: any) {
      let message = "Failed to verify token";

      if (error.response?.status === 400) {
        message = error.response?.data?.detail || "Invalid token";
      } else if (error.response?.status === 401) {
        message = error.response?.data?.detail || "Missing or malformed token";
      } else if (error.response?.status === 404) {
        message =
          error.response?.data?.detail || "Token not found or already used";
      } else if (error.response?.status >= 500) {
        message = "Server error. Please try again later.";
      }

      throw new Error(message);
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{
      message: string;
    }>("/user/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  }
}

export default new AuthService();
