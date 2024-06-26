import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { FavoriteList, UserState } from "../../model/types"




const initialState: UserState = {
    id: "",
    name: "",
    email: "",
    address: "",
    loginType: "",
    addressDetail: "",
    favoriteList: [],
    likeList: []
}

export const userDataSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData:(state, action: PayloadAction<UserState>)=>{
            state.name = action.payload.name
            state.loginType = action.payload.loginType
            state.favoriteList = action.payload.favoriteList
            state.id = action.payload.id
            state.email = action.payload.email === undefined ?  "" : action.payload.email
            state.address = action.payload.address === undefined ?  "" : action.payload.address
            state.addressDetail = action.payload.addressDetail === undefined ?  "" : action.payload.addressDetail
            state.likeList = action.payload.likeList
        },

        logOut:(state)=>{
            state.name = ""
            state.loginType = ""
            state.favoriteList = []
            state.id = ""
            state.email = ""
            state.address = ""
            state.likeList= []
        }
    }
})

export const {setUserData, logOut} = userDataSlice.actions
export default userDataSlice.reducer