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
    let { patterns } = loadPatterns()
    Object.keys(patterns).forEach((key) => {
        patterns[key].active = false
    })
    setStore(patterns)
}

export const countPatterns = () => {
    let { patterns } = loadPatterns()
    return Object.keys(patterns).length
}

