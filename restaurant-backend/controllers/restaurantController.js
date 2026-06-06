const db = require("../config/db");

const getRestaurant = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM restaurants WHERE id = 1");

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant settings",
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const {
      name,
      tagline,
      phone1,
      phone2,
      address,
      logo,
      whatsapp_number,
      theme_color,
      order_mode,
    } = req.body;

    await db.query(
      `
      UPDATE restaurants
      SET
        name = ?,
        tagline = ?,
        phone1 = ?,
        phone2 = ?,
        address = ?,
        logo = ?,
        whatsapp_number = ?,
        theme_color = ?,
        order_mode = ?
      WHERE id = 1
      `,
      [
        name,
        tagline,
        phone1,
        phone2,
        address,
        logo,
        whatsapp_number,
        theme_color,
        order_mode,
      ]
    );

    res.json({
      success: true,
      message: "Restaurant settings updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant settings",
    });
  }
};

module.exports = {
  getRestaurant,
  updateRestaurant,
};