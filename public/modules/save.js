import * as store from './store.js'

export const setup = (state) => {
    setInterval(() => {
        let patternSnapshot = {
            [state.patternName]: {
                points: state.form.points,
                colors: state.form.color,
                name: state.patternName,
                parameters: state.parameters,
                version: 1
            }
        }
        store.savePattern(patternSnapshot)
    }, 1000 * 5)
}