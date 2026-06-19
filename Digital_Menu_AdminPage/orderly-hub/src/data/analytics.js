// Mock analytics data.
const analytics = {
  daily: [
    { label: "Mon", value: 4200 },
    { label: "Tue", value: 5100 },
    { label: "Wed", value: 3800 },
    { label: "Thu", value: 6200 },
    { label: "Fri", value: 7400 },
    { label: "Sat", value: 9100 },
    { label: "Sun", value: 8200 },
  ],
  weekly: [
    { label: "W1", value: 32000 },
    { label: "W2", value: 28500 },
    { label: "W3", value: 41200 },
    { label: "W4", value: 38900 },
  ],
  monthly: [
    { label: "Jan", value: 120000 },
    { label: "Feb", value: 98000 },
    { label: "Mar", value: 140000 },
    { label: "Apr", value: 155000 },
    { label: "May", value: 162000 },
    { label: "Jun", value: 138000 },
  ],
  topProducts: [
    { name: "Chicken Biryani", sold: 142 },
    { name: "Margherita Pizza", sold: 121 },
    { name: "Chicken Burger", sold: 98 },
    { name: "Cold Coffee", sold: 87 },
    { name: "Pasta Alfredo", sold: 64 },
  ],
  leastProducts: [
    { name: "Paneer Tikka", sold: 8 },
    { name: "Veg Burger", sold: 11 },
    { name: "Brownie", sold: 14 },
  ],
  topCategories: [
    { name: "Pizza", value: 38 },
    { name: "Indian", value: 27 },
    { name: "Burgers", value: 18 },
    { name: "Beverages", value: 10 },
    { name: "Desserts", value: 7 },
  ],
};

export default analytics;
