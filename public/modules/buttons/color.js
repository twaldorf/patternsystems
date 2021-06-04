export const twoPaint = (state, input) => {
  // for later implementation
  const color = `#${input.value}`
  state.form.color = color
  state.parameters.colorArray.push(color)
}
