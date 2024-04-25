import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TokenState {
    accessToken : string
}


const initialState: TokenState = {
    accessToken: ""
}

export const accessTokenSlice = createSlice({
    name: "accessToken",
    initialState,
    reducers:{
        setToken:(state, action: PayloadAction<string>)=>{
            state.accessToken = action.payload
        },
        resetToken:(state)=>{
            state.accessToken = ""
        }
    }
})

export const {setToken, resetToken} = accessTokenSlice.actions
export default accessTokenSlice.reducer