export const edit = (state, element, parent, name) => {
    const field = document.createElement('input')
    field.type = 'text'
    field.value = name
    console.log(field)
    parent.removeChild(element)
    parent.appendChild(field)
    field.focus()
    field.addEventListener('focusout', () => {
        let text = field.value
        console.log(element)
        parent.removeChild(field)
        element.textContent = text
        parent.appendChild(element)
        state.setName(text)
    })
}
