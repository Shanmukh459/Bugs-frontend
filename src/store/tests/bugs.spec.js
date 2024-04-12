import MockAdapter from "axios-mock-adapter"
import axios from "axios"
import { loadBugs, addBug, resolveBug, getUnresolvedBugs, assignBugToUser } from "../bugs"
import configureStore from "../configureStore"

describe("bugsSlice", () => {
    let fakeAxios
    let store

    beforeEach(() => {
        fakeAxios = new MockAdapter(axios)
        store = configureStore()
    })

    const bugSlice = () => store.getState().entities.bugs
    
    const createState = () => ({
        entities: {
            bugs: {
                list: []
            }
        }
    })

    it("Should add the bug to the store if it's saved to the server", async () => {
        //Arrange
        const bug = { description: 'a'}
        const savedBug = { ...bug, id: 1}
        fakeAxios.onPost('/bugs').reply(200, savedBug)

        //Act
        await store.dispatch(addBug(bug))

        //Assert
        expect(bugSlice().list).toContainEqual(savedBug)

    })
    it("Should not add the bug to the store if it's not saved to the server", async () => {
        //Arrange
        const bug = { description: 'a'}
        fakeAxios.onPost('/bugs').reply(500)

        //Act
        await store.dispatch(addBug(bug))

        //Assert
        expect(bugSlice().list).toHaveLength(0)

    })

    it("should mark the bug as resolved if it's saved to the server", async () => {
        fakeAxios.onPost('/bugs').reply(200, { id: 1})
        fakeAxios.onPatch("/bugs/1").reply(200, {id: 1, resolved: true})

        await store.dispatch(addBug({ id: 1}))
        await store.dispatch(resolveBug(1))

        expect(bugSlice().list[0].resolved).toBe(true)
    })
    
    it("should not mark the bug as resolved if it's not saved to the server", async () => {
        fakeAxios.onPatch("/bugs/1").reply(500)
        fakeAxios.onPost('/bugs').reply(200, { id: 1})

        await store.dispatch(addBug({ id: 1}))
        await store.dispatch(resolveBug(1))

        expect(bugSlice().list[0].resolved).not.toBe(true)
    })

    // it("should add user to the bug and save it server and store", async () => {
    //     const savedBug = { id: 2, userId: 2, description: 'a'}
    //     fakeAxios.onPatch("/bugs/1").reply(200, savedBug)

    //     const x = await store.dispatch(assignBugToUser(2, 2))
    //     console.log("DEBUG", x)

    //     expect(bugSlice().list[0].userId).toEqual(2)
    // })


    describe("loading bugs", () => {
        describe("if the bugs exist in the cache", () => {
            it("they should not be fetched from the server again", async () => {
                fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

                await store.dispatch(loadBugs())
                await store.dispatch(loadBugs())

                expect(fakeAxios.history.get.length).toBe(1)
            })
        })
        describe("if the bugs doesn't exist in the cache", () => {
            it("they should be fetched from the server and put in the store", async () => {
                fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

                await store.dispatch(loadBugs())

                expect(bugSlice().list).toHaveLength(1)
            })
            describe("bugs indicator", () => {
                it("should be true while fetching the bugs", () => {
                    fakeAxios.onGet("/bugs").reply(() => {
                        expect(bugSlice().loading).toBe(true)
                        return [200, {id: 1}]
                    })

                    store.dispatch(loadBugs())
                })
                it("should be false after the bugs are fetched", async() => {
                    fakeAxios.onGet("/bugs").reply(200, [{id: 1}])

                    await store.dispatch(loadBugs())

                    expect(bugSlice().loading).toBe(false)
                })
                it("should be false if the server returns an error", async () => {
                    fakeAxios.onGet('/bugs').reply(500)

                    await store.dispatch(loadBugs())

                    expect(bugSlice().loading).toBe(false)
                })
            })
        })
    })

    describe("selectors", () => {
        it("getUnresolvedBugs", () => {

            const state = createState()
            state.entities.bugs.list = [{id: 1, resolved: true},{id: 2},{id: 3}]

            const result = getUnresolvedBugs(state)

            expect(result).toHaveLength(2)
        })
    })
})