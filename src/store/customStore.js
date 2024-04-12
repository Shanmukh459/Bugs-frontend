import reducer from './reducer'

export default function createStore(reducer) {
    let state
    let listeners = []

    function getState() {
        return state
    }

    function subscribe(subscriber) {
        listeners.push(subscriber)

        for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
        }
    }

    function dispatch(action) {
        console.log("in dispatch")
        state = reducer(state, action)
    }

    return {
        getState,
        dispatch,
        subscribe
    };
}