const db = require("../config/db");

const getCustomers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        customer_name AS name,
        customer_phone AS phone,
        delivery_address AS address,
        COUNT(*) AS total_orders,
        MAX(created_at) AS last_order_date
      FROM orders
      WHERE customer_phone IS NOT NULL
        AND customer_phone != ''
      GROUP BY customer_phone, customer_name, delivery_address
      ORDER BY last_order_date DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

module.exports = { getCustomers };