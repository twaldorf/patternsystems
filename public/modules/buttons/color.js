export const paint = (state, input) => {
    let color = `#${input.value}`
    state.form.color = color
}
