import * as store from './modules/store.js'

const user = {
    username: 'twaldorf',
    patterns: 
        [
            'pattern1',
            'pattern2'
    ],
}

const renderPattern = (pattern) => {
    let aParent = document.createElement('a')
    aParent.classList.add('pattern-link')
    aParent.href="#"
    
    let divContainer = document.createElement('div')
    let metadataContainer = document.createElement('div')
    let titleBar = document.createElement('div')
    divContainer.classList.add('pattern-item')
    metadataContainer.classList.add('metadata')
    titleBar.classList.add('title-bar')

    let date = document.createElement('li')
    let vertices = document.createElement('li')
    let colors = document.createElement('li')
    let dateSpan = document.createElement('span')
    let verticesSpan = document.createElement('span')
    let colorsSpan  = document.createElement('span')
    let titleSpan = document.createElement('span')
    let title = document.createElement('h4')
    let deleteBtn = document.createElement('button')

    deleteBtn.innerHTML = 'x'

    deleteBtn.addEventListener('click', () => {
        store.deletePattern(pattern.name)
        let parent  = document.getElementById('pattern-container')
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
        render()
    })

    titleSpan.innerHTML = pattern.name
    dateSpan.innerHTML = pattern.dateModified
    verticesSpan.innerHTML = `${pattern.points.length} vertices`
    colorsSpan.innerHTML = `${pattern.colors.length} colors`

    title.append(titleSpan)
    date.append(dateSpan)
    vertices.append(verticesSpan)
    colors.append(colorsSpan)
    
    titleBar.append(title)
    titleBar.append(deleteBtn)
    metadataContainer.append(date)
    metadataContainer.append(vertices)
    metadataContainer.append(colors)

    divContainer.append(metadataContainer)
    divContainer.append(titleBar)
    aParent.append(divContainer)
    return aParent
}

const tempPatterns = {
    pattern1: {
        points: [
            [12,24],
            [18,41]
        ],
        colors: [
            '#000000',
            '#15A341'
        ],
        name: 'Pattern 1',
        dateModified: '1 Sep 2020'
    },
    pattern2: {
        points: [
            [856,1363],
            [957,231]
        ],
        colors: [
            '#FFFFFF',
            '#134ECC'
        ],
        name: 'Pattern 2',
        dateModified: '2 Sep 2020'
    }
}

const newPattern = {
    pattern3: {
        points: [
            [856,1363],
            [957,231]
        ],
        colors: [
            '#FFFFFF',
            '#134ECC'
        ],
        name: 'Pattern 3',
        dateModified: '3 Sep 2020'
    }
}

// store.setStore(tempPatterns)

// // store.deletePattern('pattern2')

// console.log(store.loadPatterns())

// store.savePattern(newPattern)

// console.log(store.loadPatterns())

// console.log(store.deletePattern('pattern23'))


const render = () => {
    const parent = document.getElementById('pattern-container')
    const patternStore = store.loadPatterns()
    Object.keys(patternStore.patterns).map((pattern) => {
        let patternObj = patternStore.patterns[pattern]

        try {
            let patternLink = renderPattern(patternObj)
            parent.append(patternLink)
        } catch (e) {
            console.log(e)
        }
    })
}

render()