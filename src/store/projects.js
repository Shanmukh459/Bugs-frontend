import { createSlice } from "@reduxjs/toolkit"

let lastIndex = 0
const slice = createSlice({
    name: "projects",
    initialState: [],
    reducers: {
        projectAdded: (projects, actions) => {
            projects.push({
                id: ++lastIndex,
                name: actions.payload.name
            })
        }
    }
})

export default slice.reducer
export const { projectAdded } = slice.actions