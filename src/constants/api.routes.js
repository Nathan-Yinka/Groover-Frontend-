
// export const BASEURL = "https://backend.musosoupcurator.org";
export const BASEURL = "https://sound-camp-qq0z.onrender.com";
// export const BASEURL = "http://127.0.0.1:8000";

// export const BASEURL = "http://127.0.0.1:8000";

export const loginAPI = `${BASEURL}/auth/login/`;
export const registerAPI = `${BASEURL}/auth/signup/`;
export const refreshToken = `${BASEURL}/auth/refresh-token/`;
export const meAPI = `${BASEURL}/auth/me/`;
export const updateAPI = `${BASEURL}/auth/update_profile/`;
export const passwordAPI = `${BASEURL}/auth/user_change_password/`;
export const transactionPasswordAPI = `${BASEURL}/auth/user_change_transactional_password/`;
export const packsAPI = `${BASEURL}/api/packs/active_packs/`;
export const productsAPI = `${BASEURL}/api/products/`;
export const depositsAPI = `${BASEURL}/api/deposits/`;
export const settingsAPI = `${BASEURL}/auth/settings/`;
export const paymentsAPI = `${BASEURL}/api/payments/`;
export const eventAPI = `${BASEURL}/api/events/`;
export const fetchWithdrawals = `${BASEURL}/api/withdrawals/withdrawal_history/`;
export const makeWithdrawals = `${BASEURL}/api/withdrawals/make_withdrawal/`;
export const notificationsAPI = `${BASEURL}/api/notifications/`;
export const markRead = `${BASEURL}/api/notifications/mark-read/`;
export const markallRead = `${BASEURL}/api/notifications/mark-all-read/`;
export const currentGame = `${BASEURL}/api/games/current-game/`;
export const playGame = `${BASEURL}/api/games/play-game/`;
export const gameRecord = `${BASEURL}/api/games/game-record/`;
