import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateBill = (order, restaurant) => {
  const doc = new jsPDF();

  const restaurantName = restaurant?.name || "Restaurant";
  const address = restaurant?.address || "";
  const phone = restaurant?.phone || restaurant?.phone_number || "";

  doc.setFontSize(18);
  doc.text(restaurantName, 105, 15, { align: "center" });

  doc.setFontSize(10);
  if (address) doc.text(address, 105, 22, { align: "center" });
  if (phone) doc.text(`Phone: ${phone}`, 105, 28, { align: "center" });

  doc.line(14, 34, 196, 34);

  doc.setFontSize(11);
  doc.text(`Bill No: #${order.id}`, 14, 43);
  doc.text(`Date: ${order.time || new Date().toLocaleString()}`, 14, 50);
  doc.text(`Customer: ${order.customer || "Guest"}`, 14, 57);
  doc.text(`Phone: ${order.phone || "—"}`, 14, 64);
  doc.text(`Order Type: ${order.orderType || "—"}`, 14, 71);
  doc.text(`Payment: ${order.payment || "Paid"}`, 14, 78);

  const rows = (order.items || []).map((item, index) => {
    const qty = item.quantity || item.qty || 1;
    const price = Number(item.price || 0);
    return [
      index + 1,
      item.name || "Item",
      qty,
      `Rs. ${price}`,
      `Rs. ${price * qty}`,
    ];
  });

  autoTable(doc, {
    startY: 86,
    head: [["#", "Item", "Qty", "Price", "Total"]],
    body: rows,
  });

  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(13);
  doc.text(`Grand Total: Rs. ${Number(order.total || order.totalAmount || 0)}`, 14, finalY);

  doc.setFontSize(10);
  doc.text("Thank you! Visit again.", 105, finalY + 15, { align: "center" });

  doc.save(`Bill_Order_${order.id}.pdf`);
};