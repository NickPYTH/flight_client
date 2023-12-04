import {createSlice} from "@reduxjs/toolkit";

interface UserState {
    filials: any[]
}

const initialState: UserState = {
    filials: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    }
})

export default userSlice.reducer;
