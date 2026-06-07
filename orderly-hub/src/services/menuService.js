import API_BASE_URL from "../api/api";

// GET all menu items
export const getMenu = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    const data = await response.json();

    const menuItems = data.data ? data.data : data;

    return menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description || "",
      price: Number(item.price),
      type: item.item_type || item.type || "Veg",
      available: Boolean(item.available),
      image: item.image || "",
    }));
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

// POST a new menu item
export const addMenuItem = async (item) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: 1,
        name: item.name,
        category: item.category,
        description: item.description,
        image: item.image,
        price: item.price,
        item_type: item.type,
        available: item.available,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding menu item:", error);
  }
};

// PUT / Update an existing menu item
export const updateMenuItem = async (id, item) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        category: item.category,
        description: item.description,
        image: item.image,
        price: item.price,
        item_type: item.type,
        available: item.available,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating menu item:", error);
  }
};

// DELETE a menu item
export const deleteMenuItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting menu item:", error);
  }
};