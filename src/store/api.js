import { createAction } from "@reduxjs/toolkit"

export const apiCallBegan = createAction("api/callBegan")
export const apicallSuccess = createAction("api/callSuccess")
export const apiCallFailed = createAction("api/callFailed")