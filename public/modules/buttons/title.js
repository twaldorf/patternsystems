export const edit = (state, element, parent, name) => {
  // const field = document.createElement('input')
  // field.type = 'text'
  // field.value = name
  // field.id = 'header'
  // parent.removeChild(element)
  // parent.appendChild(field)
  // field.focus()
  field.addEventListener('focusout', () => {
    const text = element.value
    // parent.removeChild(field)
    // element.textContent = text
    // parent.appendChild(element)
    state.setName(text)
  })
}
