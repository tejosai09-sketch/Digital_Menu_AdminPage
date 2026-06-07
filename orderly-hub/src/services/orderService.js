import API_BASE_URL from "../api/api";

// GET all orders from MySQL backend
export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const result = await response.json();
    
    // Safely parse data fallback if wrapped inside an object or arrays directly
    const dataArray = result.data ? result.data : result;

    if (!Array.isArray(dataArray)) return [];

    return dataArray.map(order => ({
  id: String(order.id),
  customer: order.customer_name || "Guest",
  phone: order.customer_phone || "-",
  status: order.status,
  time: order.created_at || "",

  table: order.table_number || "—",
  address: order.delivery_address || "—",

  total: order.total_amount,
  payment: "Pending",

  items: order.items || [],

  tableNumber: order.table_number,
  totalAmount: order.total_amount,
  orderType: order.order_type
}));;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// PUT to update order status in MySQL backend
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