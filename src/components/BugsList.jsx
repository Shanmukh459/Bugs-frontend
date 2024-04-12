import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUnresolvedBugs, loadBugs, resolveBug } from "../store/bugs"

export default function BugsList() {
    const dispatch = useDispatch()
    const bugs = useSelector(getUnresolvedBugs)
    React.useEffect(() => {
        dispatch(loadBugs())
    }, [])

    function handleClick(id) {
        dispatch(resolveBug(id))
    }
    return (
        <ul>
            {bugs.map((bug) => (
            <div key={bug.id}>
                <li >{bug.description}</li>
                <button onClick={() => handleClick(bug.id)}>Resolve</button>
            </div>
            ))}
        </ul>
    )
}