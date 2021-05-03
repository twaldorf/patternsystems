import * as api from '../api.js'

export const setup = (state) => {
    document.getElementById('save').addEventListener('click', async () => {
        let patternSnapshot = {
            [state.dateCreated]: {
                state: state,
                name: state.patternName,
                active: true,
                version: 1
            }
        }
        patternSnapshot[state.dateCreated].dateModified = new Date()
        const receipt = await api.savePattern(patternSnapshot[0]).then(data=>data)
        console.log(receipt)
    })
}