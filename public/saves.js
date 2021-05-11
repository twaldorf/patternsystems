import * as store from './modules/store.js'
import * as hash from './modules/hash.js'
import * as utilities from './modules/utilities.js'
import * as api from './modules/api.js'

const shapePreviewDataUrl = (points, rect) => {
    const canvas = document.createElement('canvas')
    const {width, height} = utilities.getDimensionsFromCoordinates(points)
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    const context = canvas.getContext('2d')
    context.scale(devicePixelRatio,devicePixelRatio)
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
    dateSpan.textContent = `Edited: ${new Date(pattern.dateModified).toLocaleDateString()}`

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

const render = async (patterns) => {
    const parent = document.getElementById('pattern-container')

    let count = 0
    Object.keys(patterns).map((pattern) => {
        count++
        let patternObj = patterns[pattern]
        try {
            let { patternLink } = renderPattern(patternObj)
            parent.append(patternLink)
            setTimeout(() => {
                patternLink.childNodes[1].classList.add('visible')
            }, 50 * count)
            setTimeout(() => {
                patternLink.childNodes[1].classList.add('alive')
            }, 75 * count)
            const rect = patternLink.getBoundingClientRect()
            if (patternObj.state.form.points.length > 0) {
                const coordinates = utilities.distillCoordinates(patternObj.state.form.points)
                const points = utilities.normalizeCoordinates(coordinates)
                const preview = shapePreviewDataUrl(points, rect)
                const aParent = patternLink.childNodes[1]
                aParent.style.backgroundImage = `url(${preview})`
            }
        } catch (e) {
            console.log(e)
        }
    })

    document.addEventListener( 'click', async (event) => {
        if (event.target.matches('.delete')) {
            const id = event.target.classList[1]
            const patternIdToDelete = Object.keys(patterns).filter((key) => {
                return hash.hashCode(patterns[key].state.dateCreated) == id
            })
            store.deletePatternById(patternIdToDelete)
            console.log(await api.deletePattern(patternIdToDelete))
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

async function syncPatterns () {
    try {
        const remotePatterns = await getRemotePatterns()
        if (remotePatterns == 401) {
            throw('Not logged in') 
        } else if (remotePatterns.response == 'User has no patterns') {
            const patterns = store.loadPatterns().patterns
            const receipts = Object.keys(patterns).map(async (key) => {
                return await api.savePattern({pattern: {[key]: patterns[key]}})
            })
            return receipts
        } else if (remotePatterns) {
            const patterns = store.mergeStores(store.loadPatterns(), remotePatterns)
            Object.keys(patterns).map((key) => {
                store.savePattern({[key]: patterns[key]})
            })
        }
    } catch (e) {
        console.log(e)
        if (e == 'Not logged in') {
            window.location.replace('./login')
        }
    }
}

const setUserState = async () => {
    const currentUser = await api.getCurrentUser()
    if (currentUser) {
        document.getElementById('btnLogin').textContent = 'Log Out'
        document.getElementById('btnLogin').href = '/logout'
    }
}

console.log(store.loadPatterns().patterns)
await syncPatterns()
console.log(store.loadPatterns().patterns)
render(store.loadPatterns().patterns)
setUserState()
store.clearActive()
// clear active flag from all patterns

async function getRemotePatterns() {
    const saves = await fetch(`/users/me/patterns`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {return data})
    return saves
}

setTimeout(() => {
    syncPatterns()
}, 2 * 1000)