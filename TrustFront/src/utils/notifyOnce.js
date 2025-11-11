// src/utils/notifyOnce.js
export function notifyOnce(flagKey, message) {
    try {
      if (sessionStorage.getItem(flagKey) === "1") {
        sessionStorage.removeItem(flagKey);
        alert(message);
      }
    } catch {}
  }