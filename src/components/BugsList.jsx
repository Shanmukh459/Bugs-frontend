import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUnresolvedBugs, loadBugs } from "../store/bugs"

export default function BugsList() {
    const dispatch = useDispatch()
    const bugs = useSelector(getUnresolvedBugs)
    React.useEffect(() => {
        dispatch(loadBugs())
    }, [])
    return (
        <ul>
            {bugs.map((bug) => (
            <li key={bug.id}>{bug.description}</li>
            ))}
        </ul>
    )
}