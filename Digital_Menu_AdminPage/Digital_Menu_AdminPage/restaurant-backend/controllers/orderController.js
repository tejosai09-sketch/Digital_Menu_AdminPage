const Razorpay = require("razorpay");
const db = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const {
      restaurant_id,
      order_type,
      customer_name,
      customer_phone,
      table_number,
      delivery_address,
      delivery_latitude,
      delivery_longitude,
      total_amount,
      payment_method,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      items,
    } = req.body;

    const finalPaymentMethod =
      payment_method ||
      (order_type === "delivery" ? "cash_on_delivery" : "pay_to_bearer");

    const finalPaymentStatus =
      finalPaymentMethod === "online" ? payment_status || "pending" : "pending";

    const orderResult = await db.query(
      `
      INSERT INTO orders
      (
        restaurant_id,
        order_type,
        customer_name,
        customer_phone,
        table_number,
        delivery_address,
        delivery_latitude,
        delivery_longitude,
        total_amount,
        payment_method,
        payment_status,
        razorpay_order_id,
        razorpay_payment_id,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id
      `,
      [
        restaurant_id,
        order_type,
        customer_name,
        customer_phone,
        table_number,
        delivery_address,
        delivery_latitude,
        delivery_longitude,
        total_amount,
        finalPaymentMethod,
        finalPaymentStatus,
        razorpay_order_id || null,
        razorpay_payment_id || null,
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
      payment_method: finalPaymentMethod,
      payment_status: finalPaymentStatus,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Error Full:", error);
    console.error("Razorpay Error Message:", error.message);
    console.error("Razorpay Error Description:", error?.error?.description);

    res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error.message ||
        "Failed to create payment order",
    });
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
    console.error("Get orders error:", error);
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

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * FROM orders WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    await db.query(
      `
      UPDATE orders
      SET payment_status = $1
      WHERE id = $2
      `,
      [payment_status, id]
    );

    res.json({
      success: true,
      message: "Payment status updated",
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  createRazorpayOrder,
  updatePaymentStatus,
};