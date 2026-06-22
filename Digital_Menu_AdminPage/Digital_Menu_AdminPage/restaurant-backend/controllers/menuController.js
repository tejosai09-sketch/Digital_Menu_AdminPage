const db = require("../config/db");

const getAllMenuItems = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM menu_items ORDER BY id ASC");

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
    });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const {
      restaurant_id = 1,
      name,
      category,
      description,
      image,
      price,
      item_type,
      available,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO menu_items
      (
        restaurant_id,
        name,
        category,
        description,
        image,
        price,
        item_type,
        available
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        restaurant_id,
        name,
        category,
        description || "",
        image || "",
        price,
        item_type || "Veg",
        available ?? true,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add menu item",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      description,
      image,
      price,
      item_type,
      available,
    } = req.body;

    await db.query(
      `
      UPDATE menu_items
      SET
        name = $1,
        category = $2,
        description = $3,
        image = $4,
        price = $5,
        item_type = $6,
        available = $7
      WHERE id = $8
      `,
      [
        name,
        category,
        description || "",
        image || "",
        price,
        item_type || "Veg",
        available ?? true,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Menu item updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM menu_items WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
    });
  }
};

module.exports = {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};