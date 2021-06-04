import * as store from './store.js'

export const setup = (state) => {
  const activePattern = store.loadActivePattern()
  console.log(store.loadPatterns())
  if (activePattern && activePattern.state.form.points) {
    state.loadState(activePattern.state)
  }
  // clear activity
  store.clearActive()
  // if new unique pattern, set new id
  setInterval(() => {
    const patternSnapshot = {
      [state.dateCreated]: {
        state,
        name: state.patternName,
        active: true,
        version: 1,
      },
    }
    patternSnapshot[state.dateCreated].dateModified = new Date()
    store.savePattern(patternSnapshot)
    console.log(store.loadPatterns())
  }, 3000 * 1)
}
