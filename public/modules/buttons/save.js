import * as api from '../api.js'

export const setup = (state) => {
  document.getElementById('save').addEventListener('click', async () => {
    const patternSnapshot = {
      [state.dateCreated]: {
        state,
        name: state.patternName,
        active: true,
        version: 1,
      },
    }
    patternSnapshot[state.dateCreated].dateModified = new Date()
    console.log()
    const receipt = await api.savePattern({ pattern: patternSnapshot }).then((data) => data)
    console.log(receipt)
  })
}
