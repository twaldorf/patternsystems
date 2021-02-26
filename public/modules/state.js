import * as shape from './shape.js'

export class State {
    constructor() {
        this.radius = 10,
        this.feedback = null,
        this.selecting = false,
        this.patternName = 'default pattern',
        this.form = new shape.Shape(this.radius, this),
        this.handler = false,
        this.parameters = {
            colorsArray: [],
            fill: true,
            stroke: true,
            strokeWeight: 1,
            round: false,
            gridSize: 50,
            tiling: false,
        }
        this.domElements = {}
    }

    getName() {
        return this.patternName
    }

    updateDomElements(object) {
        this.domElements = object
        return this.domElements
    }

    updateParameter(key, status) {
        this.parameters[key] = status
        if (key !== 'colorsArray') {
            this.updateButton(key, status)
        }
        return this.parameters[key]
    }

    updateButton(key, status) {
        let e = this.domElements[key]
        if (status) { 
            e.classList.remove('off'); 
            e.classList.add('on'); 
        } else if (status == false) { 
            e.classList.add('off'); 
            e.classList.remove('on'); 
        }
    }
}
