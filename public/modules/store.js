export const savePattern = (wrappedPattern) => {
    const existingPatterns = loadPatterns()
    let updatedPatterns = {}
    let version = 1
    if (existingPatterns) {
        const { patterns, version } = existingPatterns
        updatedPatterns = {
            ...patterns,
            ...wrappedPattern
        }
    } else {
        updatedPatterns = {
            ...wrappedPattern
        }
    }
    const updatedStore = {
        patterns: updatedPatterns,
        version: version
    }
    return localStorage.setItem('patternDesignerPatterns', JSON.stringify(updatedStore))
}

export const setStore = (patterns) => {
    //v1 of this is for version migration and testing

    const store = {
        patterns: patterns,
        version: 1
    }
    return localStorage.setItem('patternDesignerPatterns', JSON.stringify(store))
} 

export const loadPatterns = () => {
    try {
        const patterns = JSON.parse(localStorage.getItem('patternDesignerPatterns'))
        if (!patterns) {
            console.error('no patterns!')
            return false
        }
        return patterns
    } catch (e) {
        console.log(e)
        return false
    }
}

export const loadActivePattern = () => {
    try {
        const { patterns } = loadPatterns()
        const activePattern = Object.keys(patterns).filter((key) => {
            return patterns[key].active == true
        })[0]
        if (activePattern) {
            return patterns[activePattern]
        } else return false
    } catch (e) {
        console.error(e)
    }
}

export const setActivePatternById = (id) => {
    const { patterns } = loadPatterns()
    const activePatternKey = Object.keys(patterns).filter((key) => {
        return key == id
    })[0]
    patterns[activePatternKey].active = true
    savePattern( { [activePatternKey]: patterns[activePatternKey] } )
}

export const deletePatternById = (patternId) => {
    const { patterns } = loadPatterns()
    const patternIdsToSave = Object.keys(patterns).filter((key) => {
        return key != patternId
    })

    var patternsToSave = { 
        patterns: {},
        version: 1
    }

    patternIdsToSave.map((id) => {
        patternsToSave.patterns[id] = patterns[id]
    })

    return localStorage.setItem('patternDesignerPatterns', JSON.stringify(patternsToSave))
}

export const clearActive = () => {
    const patterns = loadPatterns().patterns
    if (!patterns) {
        return false
    } else {
        Object.keys(patterns).forEach((key) => {
            patterns[key].active = false
        })
        setStore(patterns)
    }
}

export const countPatterns = () => {
    const patterns = loadPatterns().patterns
    if (!patterns) {
        return false
    } else {
        return Object.keys(patterns).length
    }
}

export const pullRemoteStore = async () => {
    const patterns = loadPatterns().patterns
    try {
        const remotePatterns = await fetch(`http://localhost:3000/users/me/patterns`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }, 
        })
        .catch(err => {
            console.log(err)
        })
        .then(response => {
            if (response.status == 401) {
                return Promise.reject(401)
            } else {
                return response.json()
            }
        })
        .then(data => data)
        return remotePatterns
    } catch {
        return 401
    }
}

export const setRemoteStore = async () => {
    const patterns = loadPatterns().patterns
    const receipts = Object.keys(patterns).map(async (pattern)=> {
        return await fetch(`http://localhost:3000/users/me/patterns`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({pattern: {
                [pattern]: patterns[pattern]},
            }),
        })
        .then(response => response.json())
        .then(data => {return data})
    })
    return receipts
}
