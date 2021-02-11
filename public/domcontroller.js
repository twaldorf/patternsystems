const $ = _ => document.querySelector(_)
const $c = _ => document.createElement(_)

function addColorField() {
    console.log(null)
    let new_li = $c('li')
    let new_input = $c('input')
    new_input.type = 'text'
    new_input.classList.add('input-color')
    new_li.innerHTML = '#'
    new_li.appendChild(new_input)
    $('#colors').appendChild(new_li)
}

const tieStateToggles = (domElements, state) => {
    return domElements.map((e) => {
        let partnerKey = Object.keys(state.parameters).filter((param) => {return param == e.id})[0]
        if (partnerKey) {
            if (e.type == "range") {
                e.addEventListener('click',() => {
                    state.updateParameter(partnerKey, e.value)
                })
            } else {
                e.addEventListener('click',() => {
                    let newState = !state.parameters[partnerKey]
                    state.updateParameter(partnerKey, newState)
                })
            }
        }
    })
}

const setInitialState = (state, domElements) => { 
    return domElements.map((e) => {
        let partnerKey = Object.keys(state.parameters).filter((param) => {return param == e.id})[0]
        if (partnerKey) {
            if (state.parameters[partnerKey] == true) {
                e.classList.add('on')
            } else if (state.parameters[partnerKey] == false) {
                e.classList.add('off')
            }
        }
    })
} 

// build an object with key(elementId): value(value)
const buildDomStateObject = (elements) => {
    let elementMap = elements.reduce ((obj, element) => {
        return {
            ...obj,
            [element.id]: element
        }
    },0)
    return elementMap
}

export const setup = (state) => {

    const domElementNames = {
        fill: 'fill',
        stroke: 'stroke',
        round: 'round',
        button_add_color: 'add-color',
        button_export: 'button-export',
        container_color: 'colors',
        slider_tile_spacing: 'grid-slider',
        grid_unit: 'gridunit-value',
        strokeWeight: 'strokeWeight',
        strokeWeightCounter: 'stroke-weight-value',
        vertex_counter: 'vertex-counter',
        shape_height: 'shape-height',
        shape_width: 'shape-width',
        date: 'date',
        header_title: 'header',
        color_input_1: 'color-input-1',
        color_input_2: 'color-input-2',
    }

    const domElements = Object.keys(domElementNames).map((e) => {
        return document.getElementById(domElementNames[e])
    })

    const setup = setInitialState(state, domElements)

    const domObject = buildDomStateObject(domElements)

    state.updateDomElements(domObject)

    tieStateToggles(domElements, state)

}
