import * as store from './modules/store.js'
import * as hash from './modules/hash.js'
import * as utilities from './modules/utilities.js'

// clear active flag from all patterns
store.clearActive()

const shapePreviewDataUrl = (points, rect) => {
    const canvas = document.createElement('canvas')
    const {width, height} = utilities.getDimensionsFromCoordinates(points)
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    const context = canvas.getContext('2d')
    context.fillStyle = 'black'
    context.fillRect(0,0,canvas.width,canvas.height)
    context.lineWidth = 2
    context.strokeStyle = 'white'
    context.beginPath()
    context.moveTo(points[0][0], points[0][1])
    points.map((point) => {
        context.lineTo(point[0], point[1])
    })
    context.stroke()
    context.fillStyle = 'white'
    context.fill()
    context.closePath()
    return canvas.toDataURL()
}

const renderPattern = (pattern) => {
    const id = hash.hashCode(pattern.state.dateCreated)

    let divParent = document.createElement('div')
    divParent.classList.add('pattern-link-container')
    divParent.classList.add(id)
    divParent.id = id
        
    let aParent = document.createElement('a')
    aParent.classList.add(`pattern-link`)
    aParent.classList.add(id)
    aParent.href="/editor"

    let metadataContainer = document.createElement('div')
    let titleBar = document.createElement('div')

    metadataContainer.classList.add('metadata')
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
        colorsSpan.innerHTML = `${pattern.state.parameters.colorArray.length} colors`
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

const render = (cloudPatterns) => {
    const parent = document.getElementById('pattern-container')
    const { patterns } = store.loadPatterns()

    Object.keys(patterns).map((pattern) => {
        let patternObj = patterns[pattern]
        try {
            let { patternLink } = renderPattern(patternObj)
            parent.append(patternLink)
            const rect = patternLink.getBoundingClientRect()
            const coordinates = utilities.distillCoordinates(patternObj.state.form.points)
            const points = utilities.normalizeCoordinates(coordinates)
            const aParent = patternLink.childNodes[1]
            const preview = shapePreviewDataUrl(points, rect)
            aParent.style.backgroundImage = `url(${preview})`
        } catch (e) {
            console.log(e)
        }
    })

    if (cloudPatterns) {
        Object.keys(cloudPatterns).map((pattern) => {
            let patternObj = patterns[pattern]
            try {
                let { patternLink } = renderPattern(patternObj)
                parent.append(patternLink)
                const rect = patternLink.getBoundingClientRect()
                const coordinates = utilities.distillCoordinates(patternObj.state.form.points)
                const points = utilities.normalizeCoordinates(coordinates)
                const aParent = patternLink.childNodes[1]
                const preview = shapePreviewDataUrl(points, rect)
                aParent.style.backgroundImage = `url(${preview})`
            } catch (e) {
                console.log(e)
            }
        })
    }

    document.addEventListener( 'click', (event) => {
        if (event.target.matches('.delete')) {
            const id = event.target.classList[1]
            const patternIdToDelete = Object.keys(patterns).filter((key) => {
                return hash.hashCode(patterns[key].state.dateCreated) == id
            })
            store.deletePatternById(patternIdToDelete)
            document.getElementById(id).remove()
        } else if (event.target.matches('.pattern-link')) {
            const id = event.target.classList[1]
            const patternIdToActivate = Object.keys(patterns).filter((key) => {
                return hash.hashCode(patterns[key].state.dateCreated) == id
            })
            store.setActivePatternById(patternIdToActivate)
        }
    })

}

render()
// getRemotePatterns()
console.log(await store.pullRemoteStore())

async function getRemotePatterns() {
    const saves = await fetch(`http://localhost:3000/users/me/patterns`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {return data})
    console.log(saves)
}
