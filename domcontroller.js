const $ = _ => document.querySelector(_)
const $c = _ => document.createElement(_)

const button_add_color = document.getElementById('add-color');
const container_color = document.getElementById('colors');

button_add_color.addEventListener("mousedown", (element) => {
    addColorField();
});

function addColorField(element) {
    let new_li = document.createElement('li');
    let new_input = document.createElement('input');
    new_input.setAttribute('type','text');
    new_input.classList.add('input-color');
    new_li.innerHTML = '#';
    new_li.appendChild(new_input);
    container_color.appendChild(new_li);
}