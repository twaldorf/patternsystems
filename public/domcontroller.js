const $ = _ => document.querySelector(_)
const $c = _ => document.createElement(_)

const button_add_color = document.getElementById('add-color');
const container_color = document.getElementById('colors');

button_add_color.addEventListener("mousedown", (element) => {
    addColorField();
});

$('#header').addEventListener('click', () => {
    $('#header').classList.add('hidden')
    $('#edit-header').classList.remove('hidden')
    document.activeElement = $('#edit-header')
})

function addColorField(element) {
    let new_li = document.createElement('li');
    let new_input = document.createElement('input');
    new_input.setAttribute('type','text');
    new_input.classList.add('input-color');
    new_li.innerHTML = '#';
    new_li.appendChild(new_input);
    container_color.appendChild(new_li);
}

function initializeNewInterfaceElements() {
    sliderStroke = createSlider(1,10,0,1);
    buttonPattern = createButton('Bake layout');
    buttonReset = createButton('Reset layout');
    buttonResetForm = createButton('Reset shape');

    sliderStroke.elt.classList.add('slider-input');
    sliderStroke.parent('stroke-slider');
    buttonPattern.parent('main-control-bar');
    buttonReset.parent('main-control-bar');
    buttonResetForm.parent('main-control-bar');

    minutesDate = fullDate.getMinutes();
    secondsDate = fullDate.getSeconds();
    hoursDate = fullDate.getHours();
    date.innerHTML = hoursDate + 'HR ' + minutesDate + 'M ' + secondsDate + 'S';
}

function updateButtonState(e) {
    if (e.className.includes('on')) {
        console.log('was active');
        e.classList.remove('on');
        e.classList.add('off');
        e.innerHTML = 'INACTIVE <span>ENABLE</span>';
    }
    else {
        console.log('was inactive');
        e.classList.remove('off');
        e.classList.add('on');
        e.innerHTML = 'ACTIVE <span>DISABLE</span>';
    };
}

document.addEventListener("DOMContentLoaded", function() {
    const colorInput1 = document.getElementById('color-input-1');
    const colorInput2 = document.getElementById('color-input-2');
    const slider = document.getElementById('grid-slider');
    const gridUnitValue = document.getElementById('gridunit-value');
    const borderSlider = document.getElementById('border-slider');
    const borderSizeValue = document.getElementById('bordersize-value');
    const vertexcounter = document.getElementById('vertex-counter');
    const formheight = document.getElementById('form-height');
    const formwidth = document.getElementById('form-width');
    const formXorigin = document.getElementById('form-X-origin');
    const formYorigin = document.getElementById('form-Y-origin');
    const currenttime = document.getElementById('current-date');
    const buttonExport = document.getElementById('button-export');
    const date = document.getElementById('date');
    const headerTitle = document.getElementById('header');
    const buttonFillToggle = document.getElementById('fill-toggle');
    const buttonBorderToggle = document.getElementById('border-toggle');
    const buttonCurveToggle = document.getElementById('curve-toggle');
    const buttons = document.querySelectorAll('button');
    buttons.forEach(function(e) {
        if (e.classList.contains('toggle')) {
            e.addEventListener('click', () => {
                updateButtonState(e)
            });
        }
    });
    buttonFillToggle.addEventListener('click', () => {
        toggleFill();
    });
    buttonBorderToggle.addEventListener('click', () => {
        toggleBorder();
    });
    buttonCurveToggle.addEventListener('click', () => {
        toggleCurve();
    });
    buttonExport.addEventListener('click', () => {
        exportPattern();
    });
    buttonExport.addEventListener('click', () => {
        editHeader();
    });
});