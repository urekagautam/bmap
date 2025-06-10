export default function useOrgAuth() {
  const orgId = localStorage.getItem("organizationId");
  const token = localStorage.getItem("orgAccessToken");
  const refreshToken = localStorage.getItem("orgRefreshToken");

  const isAuthenticated = !!(orgId && token);

  const clearAuth = () => {
    localStorage.removeItem("organizationId");
    localStorage.removeItem("orgAccessToken");
    localStorage.removeItem("orgRefreshToken");
  };

  return {
    orgId,
    token,
    refreshToken,
    isAuthenticated,
    clearAuth
  };
}