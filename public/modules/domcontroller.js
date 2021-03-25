const $ = _ => document.querySelector(_)
const $c = _ => document.createElement(_)

import * as erase from './buttons/erase.js'
import * as color from './buttons/color.js'
import * as exportCanvas from './buttons/export.js'
import * as title from './buttons/title.js'

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
    // try to wait until the window is ready
    return domElements.map((e) => {
        let partnerKey = Object.keys(state.parameters).filter((param) => {return param == e.id})[0]
        if (partnerKey) {
            if (e.type == "range") {
                e.addEventListener('input',() => {
                    state.updateParameter(partnerKey, e.value)
                })
                return
            } if (e.type == "text") {
                e.addEventListener('input',() => {
                    const value = 
                        typeof(e.value) == 'string' &&
                        (e.value.length == 6 || e.value.length == 3)
                        ? e.value : 'eeeeee'
                    //TO DO: const value = validate.input(e.value)
                    state.updateParameter(partnerKey, `#${value}`)
                })
                return
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
        button_clear_shape: 'clearShape',
        button_export: 'button_export',
        button_tile: 'tiling',
        container_color: 'colors',
        gridSize: 'gridSize',
        grid_unit: 'gridunit-value',
        strokeWeight: 'strokeWeight',
        strokeWeightCounter: 'stroke-weight-value',
        vertex_counter: 'vertex-counter',
        shape_height: 'shape-height',
        shape_width: 'shape-width',
        date: 'date',
        header_title: 'header',
        bgColor: 'bgColor',
        colorInput1: 'colorInput1',
        color_input_2: 'colorInput2',
    }

    const domElements = Object.keys(domElementNames).map((e) => {
        return document.getElementById(domElementNames[e])
    })

    setInitialState(state, domElements)
    const domObject = buildDomStateObject(domElements)
    state.updateDomElements(domObject)
    // tie the dom elements to their matching state parameters (the parameter must be defined in state independently!)
    tieStateToggles(domElements, state)
    actionSetups(state)
}

const actionSetups = (state) => {
    state.domElements.clearShape.addEventListener('click', () => {erase.action(state)})
    state.domElements.button_export.addEventListener('click', () => {
        exportCanvas.exportPattern(state)
    })
    state.domElements.header.addEventListener('click', (e) => {
        title.edit(state, e.currentTarget, document.getElementById('console-label'), state.patternName)
    })
    state.domElements.header.textContent = state.patternName
}
