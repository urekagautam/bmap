export default function useOrgAuth() {
  return {
    orgId: localStorage.getItem("organizationId"),
    token: localStorage.getItem("orgAccessToken")
  };
}