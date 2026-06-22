import API_BASE_URL from "../api/api";

export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?t=${Date.now()}`, {
      cache: "no-store",
    });

    const result = await response.json();
    const dataArray = result.data ? result.data : result;

    if (!Array.isArray(dataArray)) return [];

    return dataArray.map((order) => ({
      id: String(order.id),
      customer: order.customer_name || "Guest",
      phone: order.customer_phone || "-",
      status: order.status,
      time: order.created_at || "",

      table: order.table_number || "—",
      address: order.delivery_address || "—",

      deliveryLatitude: order.delivery_latitude,
      deliveryLongitude: order.delivery_longitude,

      total: order.total_amount,

      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status || "pending",
      payment:
        order.payment_method === "online"
          ? order.payment_status === "paid"
            ? "Online - Paid"
            : "Online - Pending"
          : order.payment_method === "cash_on_delivery"
          ? "Cash on Delivery"
          : "Pay to Bearer",

      items: order.items || [],

      tableNumber: order.table_number,
      totalAmount: order.total_amount,
      orderType: order.order_type,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    return await response.json();
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
  }
};

export const updatePaymentStatus = async (orderId, payment_status) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/payment-status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(`Error updating payment for order ${orderId}:`, error);
  }
};