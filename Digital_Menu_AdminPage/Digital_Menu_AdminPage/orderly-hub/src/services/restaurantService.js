import API_BASE_URL from "../api/api";

export const getRestaurant = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant`);
    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error fetching restaurant settings:", error);
    return null;
  }
};

export const updateRestaurant = async (restaurantData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating restaurant settings:", error);
  }
};