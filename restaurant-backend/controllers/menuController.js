const db = require("../config/db");

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menu_items");

    res.status(200).json({
      success: true,
      data: rows,
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
      restaurant_id,
      name,
      category,
      description,
      image,
      price,
      item_type,
      available
    } = req.body;

    const [result] = await db.query(
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        restaurant_id,
        name,
        category,
        description,
        image,
        price,
        item_type,
        available
      ]
    );

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add menu item"
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
      available
    } = req.body;

    await db.query(
      `
      UPDATE menu_items
      SET
        name = ?,
        category = ?,
        description = ?,
        image = ?,
        price = ?,
        item_type = ?,
        available = ?
      WHERE id = ?
      `,
      [
        name,
        category,
        description,
        image,
        price,
        item_type,
        available,
        id
      ]
    );

    res.json({
      success: true,
      message: "Menu item updated successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update menu item"
    });
  }
};
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM menu_items WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Menu item deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item"
    });
  }
};
module.exports = {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};