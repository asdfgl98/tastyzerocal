import { combineReducers, configureStore } from "@reduxjs/toolkit";
import mapInfoSlice from "./reducer/mapInfoSlice";
import accessTokenSlice from "./reducer/accessTokenSlice";
import userDataSlice from "./reducer/userDataSlice";
import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'

const reducers = combineReducers({
    kakaomapData: mapInfoSlice,
    tokenData: accessTokenSlice,
    userData: userDataSlice
})

const persistConfig:any = {
    key: 'root',
    storage,
    whitelist: ['userData']
}

const persistedReducer = persistReducer(persistConfig, reducers)



const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => (getDefaultMiddleware({serializableCheck: false}))
})




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


