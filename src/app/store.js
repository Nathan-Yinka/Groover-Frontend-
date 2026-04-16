import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slice/auth.slice";
import profileSlice from "./slice/profile.slice";
import packsSlice from "./slice/packs.slice";
import productSlice from "./slice/product.slice";
import depositSlice from "./slice/deposit.slice";
import paymentsSlice from "./slice/payments.slice";
import withdrawSlice from "./slice/withdraw.slice";
import notificationsSlice from "./slice/notifications.slice";
import eventSlice from "./slice/event.slice";

// Combine all reducers
const appReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    packs: packsSlice,
    products: productSlice,
    deposits: depositSlice,
    payments: paymentsSlice,
    withdrawals: withdrawSlice,
    notifications: notificationsSlice,
    event: eventSlice,
});

// Create a root reducer with logout handling
const rootReducer = (state, action) => {
    if (action.type === "auth/logout") {
        state = undefined; // Reset the entire state
    }
    return appReducer(state, action);
};

// Configure the store with the rootReducer
const store = configureStore({
    reducer: rootReducer,
});

export default store;
