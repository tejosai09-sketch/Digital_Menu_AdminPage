
import API_BASE_URL from "../api/api";
export const getAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  const result = await response.json();
  return result.data;
};
