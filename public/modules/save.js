import * as store from './store.js'

export const setup = (state) => {
    const activePattern = store.loadActivePattern()
    if (activePattern && activePattern.state.form.points) {
        state.loadState(activePattern.state)
    }
    // clear activity
    store.clearActive()
    // if new unique pattern, set new id
    setInterval(() => {
        let patternSnapshot = {
            [state.dateCreated]: {
                state: state,
                name: state.patternName,
                active: true,
                version: 1
            }
        }
        patternSnapshot[state.dateCreated].dateModified = new Date()
        console.log(patternSnapshot)
        store.savePattern(patternSnapshot)
    }, 3000 * 1)
}