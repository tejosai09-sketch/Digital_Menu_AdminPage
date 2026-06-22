const db = require("../config/db");

const getAnalytics = async (req, res) => {
  try {
    const summaryResult = await db.query(`
      SELECT
        COUNT(*) AS "todayOrders",
        COALESCE(SUM(total_amount), 0) AS "todayRevenue",
        COALESCE(SUM(CASE WHEN status IN ('Pending', 'Accepted', 'Preparing', 'Ready') THEN 1 ELSE 0 END), 0) AS "pendingOrders",
        COALESCE(SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END), 0) AS "completedOrders"
      FROM orders
      WHERE created_at::date = CURRENT_DATE
    `);

    const dailyResult = await db.query(`
      SELECT created_at::date AS label, COALESCE(SUM(total_amount), 0) AS value
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY created_at::date
      ORDER BY created_at::date
    `);

    const topProductsResult = await db.query(`
      SELECT item_name AS name, COALESCE(SUM(quantity), 0) AS sold
      FROM order_items
      GROUP BY item_name
      ORDER BY sold DESC
      LIMIT 5
    `);

    const leastProductsResult = await db.query(`
      SELECT item_name AS name, COALESCE(SUM(quantity), 0) AS sold
      FROM order_items
      GROUP BY item_name
      ORDER BY sold ASC
      LIMIT 5
    `);

    const summary = summaryResult.rows[0];

    res.json({
      success: true,
      data: {
        summary: {
          todayOrders: Number(summary.todayOrders || 0),
          todayRevenue: Number(summary.todayRevenue || 0),
          pendingOrders: Number(summary.pendingOrders || 0),
          completedOrders: Number(summary.completedOrders || 0),
        },
        daily: dailyResult.rows,
        weekly: dailyResult.rows,
        monthly: dailyResult.rows,
        topProducts: topProductsResult.rows,
        leastProducts: leastProductsResult.rows,
        topCategories: [],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};

module.exports = { getAnalytics };