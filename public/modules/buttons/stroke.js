export const setup = (state) => {
  state.domElements.strokeWeightCounter.textContent = state.parameters.strokeWeight
  state.domElements.strokeWeight.value = state.parameters.strokeWeight
  state.domElements.strokeWeight.addEventListener('input', (e) => {
    state.parameters.strokeWeight = e.target.value
    state.domElements.strokeWeightCounter.textContent = e.target.value
  })
}
