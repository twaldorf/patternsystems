export const savePattern = (newPattern) => {
    // v1 schema:
    // const newPattern = {
    //     pattern3: {
    //         points: [
    //             [856,1363],
    //             [957,231]
    //         ],
    //         colors: [
    //             '#FFFFFF',
    //             '#134ECC'
    //         ]
    //     }
    // } 
    // 
    // savePattern(newPattern)

    const existingPatterns = loadPatterns()
    let updatedPatterns = {}
    let version = 1
    if (existingPatterns) {
        const { patterns, version } = existingPatterns
        updatedPatterns = {
            ...patterns,
            ...newPattern
        }
    } else {
        updatedPatterns = {
            ...newPattern
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
    return JSON.parse(localStorage.getItem('patternDesignerPatterns'))
}

export const loadActivePattern = () => {
    const { patterns } = loadPatterns()
    const editingPattern = Object.keys(patterns).filter((key) => {
        return patterns[key].active == true
    })[0]
    console.log(patterns)
    if (editingPattern) {
        return patterns[editingPattern]
    } else return false
}

export const setActivePattern = (patternName) => {
    const { patterns } = loadPatterns()
    const activePatternKey = Object.keys(patterns).filter((key) => {
        return patterns[key].name == patternName
    })[0]
    patterns[activePatternKey].active = true
    savePattern( { [activePatternKey]: patterns[activePatternKey] } )
}

export const deletePattern = (patternNameToDelete) => {
    //v1 schema:
    //deletePattern('patterName')

    const existingPatterns = loadPatterns().patterns
    
    // const error = !JSON.stringify(existingPatterns).includes(patternNameToDelete) ? `Error: no pattern "${patternNameToDelete}"` : false
    
    // if (error) {return error}
    
    const patternNamesToSave = Object.keys(existingPatterns).filter((key) => {
        return existingPatterns[key].name != patternNameToDelete
    })
    var patternsToSave = { 
        patterns: {},
        version: 1
    }
    patternNamesToSave.map((patternName) => {
        patternsToSave.patterns[patternName] = existingPatterns[patternName]
    })
    return localStorage.setItem('patternDesignerPatterns', JSON.stringify(patternsToSave))
}

//untested
export const clearActive = () => {
    let { patterns } = loadPatterns()
    Object.keys(patterns).forEach((key) => {
        patterns[key].active = false
    })
    console.log('cleared from: ', patterns)
    setStore(patterns)
}

