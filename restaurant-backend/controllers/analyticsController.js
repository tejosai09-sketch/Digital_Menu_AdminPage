const db = require("../config/db");

const getAnalytics = async (req, res) => {
  try {
    const [summaryRows] = await db.query(`
      SELECT
        COUNT(*) AS todayOrders,
        COALESCE(SUM(total_amount), 0) AS todayRevenue,
        SUM(CASE WHEN status IN ('Pending', 'Accepted', 'Preparing', 'Ready') THEN 1 ELSE 0 END) AS pendingOrders,
        SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS completedOrders
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);

    const [daily] = await db.query(`
      SELECT DATE(created_at) AS label, SUM(total_amount) AS value
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const [topProducts] = await db.query(`
      SELECT item_name AS name, SUM(quantity) AS sold
      FROM order_items
      GROUP BY item_name
      ORDER BY sold DESC
      LIMIT 5
    `);

    const [leastProducts] = await db.query(`
      SELECT item_name AS name, SUM(quantity) AS sold
      FROM order_items
      GROUP BY item_name
      ORDER BY sold ASC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        summary: {
          todayOrders: Number(summaryRows[0].todayOrders || 0),
          todayRevenue: Number(summaryRows[0].todayRevenue || 0),
          pendingOrders: Number(summaryRows[0].pendingOrders || 0),
          completedOrders: Number(summaryRows[0].completedOrders || 0),
        },
        daily,
        weekly: daily,
        monthly: daily,
        topProducts,
        leastProducts,
        topCategories: [],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = { getAnalytics };