import apiClient from "./api-client";

const AuthService = {
  // Login User
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return {
      user: response.data.user,
      token: response.data.token,
    };
  },

  // Register User
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put("/users/profile", userData);
    return response.data;
  },

  // Chnage password
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.patch("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default AuthService;
