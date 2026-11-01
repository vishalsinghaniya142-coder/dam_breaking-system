/**
 * Authentication Service
 * Prepares architecture for future FastAPI JWT endpoints (/api/auth/token, /api/auth/register)
 */
export const authService = {
  async login(email, password, role) {
    // Simulated token generation for prototype
    const mockToken = "jwt_" + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("pravah_token", mockToken);
    return { token: mockToken, email, role };
  },

  async register(userData) {
    const mockToken = "jwt_" + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("pravah_token", mockToken);
    return { token: mockToken, ...userData };
  },

  logout() {
    localStorage.removeItem("pravah_token");
    localStorage.removeItem("pravah_user");
  },

  getToken() {
    return localStorage.getItem("pravah_token");
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem("pravah_token") || localStorage.getItem("pravah_user"));
  },
};
