export const setup = (state) => {
    // state.domElements.scaleCounter.textContent = state.domElements.scale.value
    state.domElements.scaleDown.addEventListener('click', (e) => {
        state.form.scale(0.75)
        state.domElements.scaleCounter.textContent = 0.75
    })
    state.domElements.scaleUp.addEventListener('click', (e) => {
        state.form.scale(1.5)
        state.domElements.scaleCounter.textContent = 1.5
    })
}