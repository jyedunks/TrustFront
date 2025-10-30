// src/api/item.js
export async function fetchMyItems(userId) {
    const res = await fetch(`/api/items?userId=${encodeURIComponent(userId ?? "")}`);
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  }