const db = require("../config/db");

const createOrder = async (req, res) => {
  try {
    const {
      restaurant_id,
      order_type,
      customer_name,
      customer_phone,
      table_number,
      delivery_address,
      total_amount,
      items,
    } = req.body;

    const orderResult = await db.query(
      `
      INSERT INTO orders
      (
        restaurant_id, order_type, customer_name, customer_phone,
        table_number, delivery_address, total_amount, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        restaurant_id,
        order_type,
        customer_name,
        customer_phone,
        table_number,
        delivery_address,
        total_amount,
        "Pending",
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await db.query(
        `
        INSERT INTO order_items
        (order_id, menu_item_id, item_name, quantity, price)
        VALUES ($1,$2,$3,$4,$5)
        `,
        [orderId, item.id, item.name, item.quantity, item.price]
      );
    }

    res.status(201).json({
      success: true,
      orderId,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'name', oi.item_name,
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      `,
      [status, id]
    );

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * FROM orders WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};