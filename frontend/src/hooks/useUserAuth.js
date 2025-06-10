export default function useUserAuth() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userAccessToken");
  const refreshToken = localStorage.getItem("userRefreshToken");

  const isAuthenticated = !!(userId && token);

  const clearAuth = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
  };

  return {
    userId,
    token,
    refreshToken,
    isAuthenticated,
    clearAuth
  };
}