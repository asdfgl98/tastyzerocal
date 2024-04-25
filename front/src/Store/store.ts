import { configureStore } from "@reduxjs/toolkit";
import mapInfoSlice from "./reducer/mapInfoSlice";
import accessTokenSlice from "./reducer/accessTokenSlice";
import userDataSlice from "./reducer/userDataSlice";

const store = configureStore({
    reducer: {
        kakaomapData: mapInfoSlice,
        tokenData: accessTokenSlice,
        userData: userDataSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


