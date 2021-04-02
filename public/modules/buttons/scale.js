export const setup = (state) => {
    state.domElements.scaleCounter.textContent = state.domElements.scale.value
    state.domElements.scale.addEventListener('input', (e) => {
        state.form.scale(e.target.value, state.form.points)
        state.domElements.scaleCounter.textContent = e.target.value
    })
}