import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/proxy";

function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Attach JWT + locale to every request ─────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = lsGet("snl_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const lang = window.location.pathname.startsWith("/fr") ? "fr" : "en";
    config.headers["Accept-Language"] = lang;
  }
  return config;
});

// ── Auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = lsGet("snl_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // API response: { success, data: { accessToken, refreshToken } }
        const newToken = data?.data?.accessToken ?? data?.accessToken;
        if (!newToken) throw new Error("Failed to extract access token from refresh response");

        const newRefreshToken = data?.data?.refreshToken ?? data?.refreshToken;
        lsSet("snl_access_token", newToken);
        if (newRefreshToken) lsSet("snl_refresh_token", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        lsRemove("snl_access_token");
        lsRemove("snl_refresh_token");
        lsRemove("snl_user");
        if (typeof window !== "undefined") {
          document.cookie = "snl_access_token=; path=/; max-age=0";
          document.cookie = "snl_user_role=; path=/; max-age=0";
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ── Health ────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get("/health"),
};

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  getVapidPublicKey: () => api.get("/auth/vapid-public-key"),
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  changePassword: (data) => api.post("/auth/change-password", data),
  getMe: () => api.get("/auth/me"),
  setup2FA: () => api.get("/auth/2fa/setup"),
  enable2FA: (code) => api.post("/auth/2fa/enable", { code }),
  disable2FA: (code) => api.post("/auth/2fa/disable", { code }),
  verify2FA: (data) => api.post("/auth/2fa/verify", data),
  exchangeOAuth: (code) => api.post("/auth/oauth/exchange", { code }),
  checkUsername: (username) => api.get("/auth/check-username", { params: { username } }),
};

// ── Users ─────────────────────────────────────────────────────────
export const usersApi = {
  getDashboard: () => api.get("/users/me/dashboard"),
  getProfile: () => api.get("/users/me/profile"),
  updateProfile: (data) => api.put("/users/me/profile", data),
  uploadAvatar: (formData) => {
    const token = typeof window !== "undefined" ? lsGet("snl_access_token") : "";
    return axios.post("/api/upload-avatar", formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  getAddresses: () => api.get("/users/me/addresses"),
  addAddress: (data) => api.post("/users/me/addresses", data),
  updateAddress: (id, data) => api.put(`/users/me/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/me/addresses/${id}`),
  getLoginHistory: (params) => api.get("/users/me/login-history", { params }),
  getKyc: () => api.get("/users/me/kyc"),
  getPoints:        () => api.get("/users/me/points"),
  getPointsHistory: (params) => api.get("/users/me/points/history", { params }),
  collect:       () => api.post("/users/me/collect"),
  collectStatus: () => api.get("/users/me/collect/status"),
  getStreak:           () => api.get("/users/me/streak"),
  claimStreak:         () => api.post("/users/me/streak/claim"),
  getReferralEarnings:  () => api.get("/users/me/referral-earnings"),
  transferPoints:       (data) => api.post("/users/me/points/transfer", data),
  getReferralPending:  () => api.get("/users/me/referral/pending"),
  claimReferral:       (level) => api.post("/users/me/referral/claim", undefined, { params: level != null ? { level } : {} }),
  claimWelcomeBonus:   () => api.post("/users/me/welcome-bonus/claim"),
  setUsername: (username) => api.put("/users/me/username", { username }),
  searchByUsername: (username) => api.get("/users/search", { params: { username } }),
  subscribePush: (subscription) => api.post("/users/me/push-subscription", subscription),
  unsubscribePush: (endpoint) => api.delete("/users/me/push-subscription", { data: { endpoint } }),
  uploadKycDocument: (formData) => api.post("/users/me/kyc/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  submitKyc: (data) => api.post("/users/me/kyc", data),
};

// ── Network ───────────────────────────────────────────────────────
export const networkApi = {
  getStats: () => api.get("/network/stats"),
  getTree: () => api.get("/network/tree"),
  getDirects: (params) => api.get("/network/directs", { params }),
  getUpline: () => api.get("/network/upline"),
  getLevel: (level, params) => api.get(`/network/level/${level}`, { params }),
};

// ── Wallet ────────────────────────────────────────────────────────
export const walletApi = {
  getWallet: () => api.get("/wallets/me"),
  getBalance: () => api.get("/wallets/me/balance"),
  getTransactions: (params) => api.get("/wallets/me/transactions", { params }),
  getWithdrawals: (params) => api.get("/wallets/me/withdrawals", { params }),
  withdraw: (data) => api.post("/wallets/me/withdraw", data),
  transfer: (data) => api.post("/wallets/me/transfer", data),
  adminGetWithdrawals: (params) => api.get("/wallets/admin/withdrawals", { params }),
  adminProcessWithdrawal: (id) => api.put(`/wallets/admin/withdrawals/${id}/process`),
  adminCompleteWithdrawal: (id) => api.put(`/wallets/admin/withdrawals/${id}/complete`),
  adminRejectWithdrawal: (id) => api.put(`/wallets/admin/withdrawals/${id}/reject`),
};

// ── Commissions ───────────────────────────────────────────────────
export const commissionsApi = {
  getMy: (params) => api.get("/commissions/my", { params }),
  getSummary: () => api.get("/commissions/my/summary"),
  adminGetAll: (params) => api.get("/commissions/admin", { params }),
  adminApprove: (id) => api.put(`/commissions/admin/${id}/approve`),
  adminReject: (id) => api.put(`/commissions/admin/${id}/reject`),
};

// ── Notifications ─────────────────────────────────────────────────
export const notificationsApi = {
  getAll: (params) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/mark-all-read"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// ── Products ──────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params) => api.get("/products", { params }),
  getFeatured: () => api.get("/products/featured"),
  getCategories: () => api.get("/products/categories"),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  createCategory: (data) => api.post("/products/categories", data),
};

// ── Orders ────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data) => api.post("/orders", data),
  getMy: (params) => api.get("/orders/my", { params }),
  getMyOne: (id) => api.get(`/orders/my/${id}`),
  cancel: (id) => api.put(`/orders/my/${id}/cancel`),
  adminGetAll: (params) => api.get("/orders/admin", { params }),
  adminGetOne: (id) => api.get(`/orders/admin/${id}`),
  adminUpdateStatus: (id, data) => api.put(`/orders/admin/${id}/status`, data),
  adminConfirmPayment: (id) => api.put(`/orders/admin/${id}/confirm-payment`),
};

// ── Levels ───────────────────────────────────────────────────────
export const levelsApi = {
  getAll: () => api.get("/levels"),
};

// ── Leaderboard ───────────────────────────────────────────────────
export const leaderboardApi = {
  getTop:    (params) => api.get("/leaderboard", { params }),
  getMyRank: ()       => api.get("/leaderboard/me"),
};

// ── Missions ──────────────────────────────────────────────────────
export const missionsApi = {
  getPublic: ()           => api.get("/missions/public"),
  getMyMissions: ()       => api.get("/missions"),
  start: (id)             => api.post(`/missions/${id}/start`),
  complete: (id)          => api.post(`/missions/${id}/complete`),
};

// ── Admin ─────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getRevenueReport:      (params) => api.get("/admin/reports/revenue", { params }),
  getCollectActivity:    (params) => api.get("/admin/reports/collect-activity", { params }),
  getRankDistribution: () => api.get("/admin/reports/rank-distribution"),
  getNetworkGrowth: (params) => api.get("/admin/reports/network-growth", { params }),
  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getKycRequests: (params) => api.get("/admin/kyc", { params }),
  reviewKyc: (id, data) => api.put(`/admin/kyc/${id}/review`, data),
  getSettings: () => api.get("/admin/settings"),
  updateSetting: (key, value) => api.put(`/admin/settings/${key}`, { value }),
  uploadProductMedia: (formData) => api.post("/admin/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  adjustPoints: (userId, data) => api.post(`/admin/users/${userId}/points/adjust`, data),
  getPointsHistory: (params) => api.get("/admin/points/history", { params }),
  getMissions: (params)           => api.get("/missions/admin", { params }),
  createMission: (data)           => api.post("/missions", data),
  updateMission: (id, data)       => api.put(`/missions/${id}`, data),
  deleteMission: (id)             => api.put(`/missions/${id}`, { isActive: false }),
  getMissionReviews: (params)     => api.get("/admin/missions/reviews", { params }),
  approveMissionReview: (id)      => api.post(`/admin/missions/reviews/${id}/approve`),
  rejectMissionReview: (id)       => api.post(`/admin/missions/reviews/${id}/reject`),
  broadcastNotification: (data) => api.post("/admin/notifications/broadcast", data),
  getNotificationsHistory: (params) => api.get("/admin/notifications/broadcasts", { params }),
  getAuditLogs: (params) => api.get("/admin/audit-logs", { params }),
  getLevels:    (params) => api.get("/admin/levels", { params }),
  createLevel:  (data)   => api.post("/admin/levels", data),
  updateLevel:  (id, data) => api.put(`/admin/levels/${id}`, data),
  deleteLevel:  (id)     => api.delete(`/admin/levels/${id}`),
  getUserTree: (userId) => api.get(`/network/${userId}/tree`),
};

// ── Public settings ───────────────────────────────────────────────
export const settingsApi = {
  get: (key) => api.get(`/settings/${key}`),
  getPreLaunchStats: () => api.get("/settings/pre-launch-stats"),
};

// ── Error helper ──────────────────────────────────────────────────
export function getApiError(error) {
  const data = error?.response?.data;
  if (!data) return error?.message || "An error occurred";
  if (Array.isArray(data.message)) return data.message.join(". ");
  return data.message || data.error || error?.message || "An error occurred";
}

// Maps NestJS { errors: [{field, message}] } response to { fieldErrors, apiError }
export function parseFieldErrors(error) {
  const data = error?.response?.data;
  if (!data) return { apiError: error?.message || "An error occurred" };

  const fieldErrors = {};
  const general = [];

  // Format structuré : errors: [{ field, message }]
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const FIELD_MAP = {
      username: "username",
      firstname: "firstName",
      lastname: "lastName",
      email: "email",
      phone: "phone",
      password: "password",
      confirmpassword: "confirmPassword",
      referralcode: "referralCode",
      gender: "gender",
    };

    data.errors.forEach(({ field, message }) => {
      if (!field || !message || typeof field !== "string" || typeof message !== "string") return;
      const key = FIELD_MAP[field.toLowerCase()] ?? field;
      const m = message.toLowerCase();

      // Messages lisibles pour l'utilisateur
      if (key === "referralCode" || m.includes("referral")) {
        fieldErrors.referralCode = "This referral code is invalid or does not exist";
      } else if (key === "username" && (m.includes("taken") || m.includes("exist") || m.includes("already"))) {
        fieldErrors.username = "This username is already taken";
      } else if (key === "username") {
        fieldErrors.username = message;
      } else if (key === "email" && (m.includes("exist") || m.includes("taken") || m.includes("already") || m.includes("registered"))) {
        fieldErrors.email = "This email address is already registered";
      } else if (key === "email") {
        fieldErrors.email = "Please enter a valid email address";
      } else if (key === "phone") {
        fieldErrors.phone = "Please enter a valid phone number with country code";
      } else if (key === "password" && m.includes("match")) {
        fieldErrors.confirmPassword = "Passwords do not match";
      } else if (key === "password") {
        fieldErrors.password = "Password must be at least 8 characters with uppercase, lowercase and a number";
      } else if (key === "firstName") {
        fieldErrors.firstName = "First name is required";
      } else if (key === "lastName") {
        fieldErrors.lastName = "Last name is required";
      } else {
        fieldErrors[key] = message;
      }
    });
  } else {
    // Fallback : message string ou tableau (ancien format)
    const messages = Array.isArray(data.message)
      ? data.message
      : [data.message].filter(Boolean);

    messages.forEach((msg) => {
      if (!msg || typeof msg !== "string" || msg === "Validation failed" || msg === "Bad Request") return;
      const m = msg.toLowerCase();
      if (m.includes("referral")) fieldErrors.referralCode = "This referral code is invalid or does not exist";
      else if (m.includes("username") && (m.includes("taken") || m.includes("exist") || m.includes("already"))) fieldErrors.username = "This username is already taken";
      else if (m.includes("email") && (m.includes("exist") || m.includes("taken") || m.includes("already"))) fieldErrors.email = "This email address is already registered";
      else if (m.includes("email")) fieldErrors.email = "Please enter a valid email address";
      else if (m.includes("phone")) fieldErrors.phone = "Please enter a valid phone number with country code";
      else if (m.includes("password") && m.includes("match")) fieldErrors.confirmPassword = "Passwords do not match";
      else if (m.includes("password")) fieldErrors.password = "Password must be at least 8 characters";
      else general.push(msg);
    });
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return {
    fieldErrors: hasFieldErrors ? fieldErrors : null,
    apiError: general.length > 0
      ? general.join(". ")
      : !hasFieldErrors
        ? "Please check your information and try again."
        : null,
  };
}
