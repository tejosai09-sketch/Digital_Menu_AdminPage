const db = require("../config/db");

const createOrder = async (req, res) => {
  console.log("ORDER BODY:", req.body);

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

    const [orderResult] = await db.query(
      `
      INSERT INTO orders
      (
        restaurant_id,
        order_type,
        customer_name,
        customer_phone,
        table_number,
        delivery_address,
        total_amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.query(
        `
        INSERT INTO order_items
        (
          order_id,
          menu_item_id,
          item_name,
          quantity,
          price
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.id,
          item.name,
          item.quantity,
          item.price,
        ]
      );
    }

    res.status(201).json({
      success: true,
      orderId,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `);

    for (let order of orders) {
      const [items] = await db.query(
        `
        SELECT
          item_name AS name,
          quantity,
          price
        FROM order_items
        WHERE order_id = ?
        `,
        [order.id]
      );

      order.items = items;
    }

    res.json({
      success: true,
      data: orders,
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
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      data: orders[0],
    });
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