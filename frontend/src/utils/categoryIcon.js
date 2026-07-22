const ICONS = {
  Electronics: "🔌",
  Computers: "💻",
  "Mobile Phones": "📱",
  "Home & Kitchen": "🏠",
  "Sports & Outdoors": "🏀",
  Books: "📚",
  "Toys & Games": "🧸",
  Fashion: "👗",
  "Beauty & Personal Care": "💄",
  Automotive: "🚗",
};

export function iconForCategory(name) {
  return ICONS[name] || "🛍️";
}
