import { createSlice } from "@reduxjs/toolkit";

let lastIndex = 0

const slice = createSlice({
    name: "users",
    initialState: [],
    reducers: {
        userAdded: (users, action) => {
            users.push({
                id: ++lastIndex,
                name: action.payload.name
            })
        }
    }
})

export const { userAdded } = slice.actions
export default slice.reducer