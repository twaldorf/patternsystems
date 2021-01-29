export const savePattern = (pattern) => {
    return localStorage.setItem(pattern.name, JSON.stringify(pattern))
}

export const saveWipForm = (form) => {
    const wips = localStorage.getItem('tempPatterns')
    const newWips = { ...wips, form: form }
    localStorage.setItem('tempPatterns', newWips)
}

export const loadPattern = (patternName) => {
    return JSON.parse(localStorage.getItem(patternName))
}

export const deletePattern = (patternName) => {
    localStorage.removeItem(patternName)
}