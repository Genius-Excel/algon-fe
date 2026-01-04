const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const tokenManager = {
  // Access Token
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // User Data
  getUserData(): any {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  setUserData(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Clear all
  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};