import { createAction, createReducer, createSlice } from "@reduxjs/toolkit"
import  { createSelector } from 'reselect'
import { apiCallBegan } from "./api"
import moment from "moment"

const slice = createSlice({
    name: "bugs",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null
    },
    reducers: {
        bugsRequested: (bugs, action) => {
            bugs.loading = true
        },

        bugsRequestFailed: (bugs, action) => {
            bugs.loading = false
        },

        bugsReceived: (bugs, action) => {
            bugs.list = action.payload
            bugs.loading = false
            bugs.lastFetch = Date.now()
        },

        bugAssignedToUser: (bugs, action) => {
            const { id: bugId, userId } = action.payload
            const index = bugs.list.findIndex(bug => bug.id === bugId)
            console.log(bugs)
            bugs.list[index].userId = userId
        },
        //command - event
        //addBug - bugAdded
        bugAdded: (bugs, action) => {
            bugs.list.push(action.payload)
        },
        //command(resolveBug) - event(bugResolved)
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id)
            bugs.list[index].resolved = true
        },

    }
})

export default slice.reducer
export const { 
    bugAdded, 
    bugResolved, 
    bugAssigned, 
    bugAssignedToUser, 
    bugsReceived,
    bugsRequested, 
    bugsRequestFailed,
} = slice.actions

const url = "/bugs"

export const loadBugs = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

    if(diffInMinutes < 10) return
    console.log(lastFetch)

    return dispatch(apiCallBegan({
        url,
        onStart: bugsRequested.type,
        onSuccess: bugsReceived.type,
        onError: bugsRequestFailed.type,
    }))
}

export const addBug = bug => apiCallBegan({
    url,
    method: 'post',
    data: bug,
    onSuccess: bugAdded.type
})

export const resolveBug = id => apiCallBegan({
    //url = /bugs
    url: url + '/' + id,
    method: 'patch',
    data: {resolved: true},
    onSuccess: bugResolved.type,
}) 

export const assignBugToUser = (bugId, userId) => apiCallBegan({
    url: url + '/' + bugId,
    method: 'patch',
    data: { userId: userId },
    onSuccess: bugAssignedToUser.type,
})
    
//selectors
export const getUnresolvedBugs = createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => !bug.resolved)
)

export const getAssignedBugsToUser = userId => createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
)
    