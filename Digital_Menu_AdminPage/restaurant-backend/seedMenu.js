require("dotenv").config();

const db = require("./config/db");
const menuItems = require("./data/menu");

const seedMenu = async () => {
  try {
    for (const item of menuItems) {
      await db.query(
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
          1,
          item.name,
          item.category,
          item.description || "",
          item.image,
          item.price,
          item.type || "Veg",
          1,
        ]
      );
    }

    console.log("Menu seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Menu seed failed:", error);
    process.exit(1);
  }
};

seedMenu();