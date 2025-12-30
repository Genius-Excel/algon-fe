import apiClient from "./api";
import { tokenManager } from "../utils/tokenManager";
import type { UserRole } from "../Types/types";

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
  nin: string;
  email: string;
  phone_number: string;
  password: string;
  role?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Real API call to /api/auth/login
    // API expects application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    const response = await apiClient.post<{
      message: string;
      user_id: string;
      role: string;
      "refresh-token": string;
      "access-token": string;
    }>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Map backend role format to frontend format
    const mapRole = (backendRole: string): UserRole => {
      if (backendRole === "super-admin") return "superAdmin";
      if (backendRole === "admin") return "admin";
      return "applicant";
    };

    // Map API response to internal format
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
      console.warn("Failed to fetch user details, using email as name:", error);
    }

    return loginData;
  }

  async getCurrentUser(): Promise<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    nin: string;
    role: string;
    email_verified: boolean;
    profile_image: string | null;
  }> {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
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

    const response = await apiClient.post<{
      message: string;
      data: Array<{
        user_id: string;
        email: string;
        role: string;
        phone_number: string;
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
        name: userData.email.split("@")[0], // Extract name from email
        phone: userData.phone_number,
        nin: data.nin,
      },
    };
  }

  async logout(): Promise<void> {
    try {
      const accessToken = tokenManager.getAccessToken();
      const refreshToken = tokenManager.getRefreshToken();

      if (accessToken && refreshToken) {
        // Real API requires both tokens in request body
        await apiClient.post("/auth/logout", {
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
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
    const response = await apiClient.post<{ message: string }>(
      `/token/verify/${token}`
    );
    return response.data;
  }
}

export default new AuthService();
