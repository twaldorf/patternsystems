export const setup = (state) => {
    state.domElements.gridSizeCounter.textContent = state.parameters.gridSize
    state.domElements.gridSize.addEventListener('input', (e) => {
        state.parameters.gridSize = e.target.value
        state.domElements.gridSizeCounter.textContent = e.target.value
    })
}