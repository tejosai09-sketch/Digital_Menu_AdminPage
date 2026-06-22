import API_BASE_URL from "../api/api";

export const getCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};