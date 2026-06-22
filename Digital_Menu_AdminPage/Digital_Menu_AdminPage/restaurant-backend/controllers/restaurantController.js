// const db = require("../config/db");

// const getRestaurant = async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM restaurants WHERE id = 1");

//     res.json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch restaurant settings",
//     });
//   }
// };

// const updateRestaurant = async (req, res) => {
//   try {
//     const {
//       name,
//       tagline,
//       phone1,
//       phone2,
//       address,
//       logo,
//       whatsapp_number,
//       theme_color,
//       order_mode,
//       is_open,
//     } = req.body;

//     await db.query(
//       `
//       UPDATE restaurants
//       SET
//         name = $1,
//         tagline = $2,
//         phone1 = $3,
//         phone2 = $4,
//         address = $5,
//         logo = $6,
//         whatsapp_number = $7,
//         theme_color = $8,
//         order_mode = $9,
//         is_open = $10
//       WHERE id = 1
//       `,
//       [
//         name,
//         tagline,
//         phone1,
//         phone2,
//         address,
//         logo,
//         whatsapp_number,
//         theme_color,
//         order_mode,
//         is_open,
//       ]
//     );

//     res.json({
//       success: true,
//       message: "Restaurant settings updated successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update restaurant settings",
//     });
//   }
// };

// module.exports = {
//   getRestaurant,
//   updateRestaurant,
// };



const db = require("../config/db");

const getRestaurant = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM restaurants WHERE id = 1");

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Restaurant fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant settings",
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const current = await db.query("SELECT * FROM restaurants WHERE id = 1");
    const oldData = current.rows[0];

    const updatedData = {
      name: req.body.name ?? oldData.name,
      tagline: req.body.tagline ?? oldData.tagline,
      phone1: req.body.phone1 ?? oldData.phone1,
      phone2: req.body.phone2 ?? oldData.phone2,
      address: req.body.address ?? oldData.address,
      logo: req.body.logo ?? oldData.logo,
      whatsapp_number: req.body.whatsapp_number ?? oldData.whatsapp_number,
      theme_color: req.body.theme_color ?? oldData.theme_color,
      order_mode: req.body.order_mode ?? oldData.order_mode,
      is_open: req.body.is_open ?? oldData.is_open,
    };

    const result = await db.query(
      `
      UPDATE restaurants
      SET
        name = $1,
        tagline = $2,
        phone1 = $3,
        phone2 = $4,
        address = $5,
        logo = $6,
        whatsapp_number = $7,
        theme_color = $8,
        order_mode = $9,
        is_open = $10
      WHERE id = 1
      RETURNING *
      `,
      [
        updatedData.name,
        updatedData.tagline,
        updatedData.phone1,
        updatedData.phone2,
        updatedData.address,
        updatedData.logo,
        updatedData.whatsapp_number,
        updatedData.theme_color,
        updatedData.order_mode,
        updatedData.is_open,
      ]
    );

    res.json({
      success: true,
      message: "Restaurant settings updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Restaurant update error:", error);
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