import * as shape from './shape.js'
import * as hash from './hash.js'

export class State {
    constructor() {
        this.radius = 10,
        this.feedback = null,
        this.selecting = false,
        this.patternName = 'untitled',
        this.dateCreated = new Date().toISOString()
        this.form = new shape.Shape(this.radius, this),
        this.handler = false,
        this.parameters = {
            fill: true,
            stroke: true,
            strokeWeight: 1,
            round: false,
            gridSize: 50,
            tiling: false,
            tileScheme: 'block',
            colorInput1: '#ffffff',
            colorInput2: '#222222',
            bgColor: '#181818',
            colorArray: ['#ffffff'],
        }
        this.domElements = {}
    }

    loadState(newState) {
        this.patternName = newState.patternName
        this.form.points = newState.form.points
        this.parameters = newState.parameters
        this.dateCreated = newState.dateCreated
        if (this.domElements.header) {
            this.domElements.header.textContent = this.patternName }
    }

    getName() {
        return this.patternName
    }

    setName(name) {
        this.patternName = name
        return this.patternName
    }

    generateId() {
        return hash.hashCode(JSON.stringify(this.form.points + this.parameters))
    }

    updateDomElements(object) {
        this.domElements = object
        return this.domElements
    }

    updateParameter(key, status) {
        console.log(key, status)
        this.parameters[key] = status
        if (!key.includes('color') && key != 'gridSize') {
            this.updateButton(key, status)
        } else {
            this.parameters[key] = status
            let colorKeys = Object.keys(this.parameters).filter((key) => {
                return key.includes('color') && key != 'colorArray'
            })
            this.parameters.colorArray = []
            colorKeys.map((key) => {
                this.parameters.colorArray.push(this.parameters[key])
            })
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
