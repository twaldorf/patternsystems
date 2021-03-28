import * as store from './modules/store.js'
import * as hash from './modules/hash.js'

// clear active flag from all patterns
store.clearActive()

const renderPattern = (pattern) => {
    const id = hash.hashCode(pattern.state.dateCreated)

    let divParent = document.createElement('div')
    divParent.classList.add('pattern-link-container')
    divParent.classList.add(id)
    divParent.id = id
        
    let aParent = document.createElement('a')
    aParent.classList.add(`pattern-link`)
    aParent.href="/editor"

    let metadataContainer = document.createElement('div')
    let titleBar = document.createElement('div')

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

    deleteBtn.textContent = 'x'
    deleteBtn.classList.add('delete')
    deleteBtn.classList.add(id)

    titleSpan.innerHTML = pattern.name
    dateSpan.innerHTML = pattern.dateModified

    try {
        verticesSpan.innerHTML = `${pattern.state.form.points.length} vertices`
        colorsSpan.innerHTML = `${pattern.state.parameters.colorsArray.length} colors`
    } catch (e) {
        console.log(e)
    }

    title.append(titleSpan)
    date.append(dateSpan)
    vertices.append(verticesSpan)
    colors.append(colorsSpan)
    
    titleBar.append(title)
    divParent.append(deleteBtn)
    metadataContainer.append(date)
    metadataContainer.append(vertices)
    metadataContainer.append(colors)

    aParent.append(metadataContainer)
    aParent.append(titleBar)
    divParent.append(aParent)
    return { patternLink: divParent }
}

const render = () => {
    const parent = document.getElementById('pattern-container')
    const { patterns } = store.loadPatterns()

    Object.keys(patterns).map((pattern) => {
        let patternObj = patterns[pattern]
        try {
            let { patternLink } = renderPattern(patternObj)
            parent.append(patternLink)
        } catch (e) {
            console.log(e)
        }
    })

    document.addEventListener( 'click', (event) => {
        if (event.target.matches('.delete')) {
            const id = event.target.classList[1]
            const patternIdToDelete = Object.keys(patterns).filter((key) => {
                return hash.hashCode(patterns[key].state.dateCreated) == id
            })
            store.deletePatternById(patternIdToDelete)
            document.getElementById(id).remove()
        } else if (event.target.matches(aParent)) {
            // aParent.addEventListener('click', () => {
                //     store.setActivePattern(pattern.name)
                // })
            console.log('nav')
        }
    })

}

render()
