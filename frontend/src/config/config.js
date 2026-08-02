// config.js

// ✅ Backend API Base URL
export const API_BASE_URL = "http://localhost:5000";

// ✅ You can also add other global configs here
export const APP_CONFIG = {
  TIMEOUT: 10000, // default API timeout (10s)
  ENABLE_LOGS: true, // toggle for console logs
};

// ✅ Example: function to log only if ENABLE_LOGS is true
export const logInfo = (...args) => {
  if (APP_CONFIG.ENABLE_LOGS) {
    console.log(...args);
  }
};
