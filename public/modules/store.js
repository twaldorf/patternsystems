const validate = (wrappedPattern) => {
  try {
    const pattern = wrappedPattern[Object.entries(wrappedPattern)[0][0]]
    const { state } = pattern
    const { points } = state.form
    if (!state || !points) {
      return false
    }
    return wrappedPattern
  } catch (e) {
    return false
  }
}

export const savePattern = (incomingPattern) => {
  const wrappedPattern = validate(incomingPattern)
  console.log(wrappedPattern)
  const existingPatterns = loadPatterns()
  let updatedPatterns = {}
  const version = 1
  if (existingPatterns) {
    const { patterns, version } = existingPatterns
    updatedPatterns = {
      ...patterns,
      ...wrappedPattern,
    }
  } else {
    updatedPatterns = {
      ...wrappedPattern,
    }
  }
  const updatedStore = {
    patterns: updatedPatterns,
    version,
  }
  try {
    localStorage.setItem('patternDesignerPatterns', JSON.stringify(updatedStore))
    return loadPatterns()
  } catch (e) {
    console.log(e)
    return false
  }
}

export const setStore = (patterns) => {
  // v1 of this is for version migration and testing

  const store = {
    patterns,
    version: 1,
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
    const activePattern = Object.keys(patterns).filter((key) => patterns[key].active == true)[0]
    if (activePattern) {
      return patterns[activePattern]
    } return false
  } catch (e) {
    console.error(e)
  }
}

export const setActivePatternById = (id) => {
  const { patterns } = loadPatterns()
  const activePatternKey = Object.keys(patterns).filter((key) => key == id)[0]
  patterns[activePatternKey].active = true
  savePattern({ [activePatternKey]: patterns[activePatternKey] })
}

export const deletePatternById = (patternId) => {
  const { patterns } = loadPatterns()
  const patternIdsToSave = Object.keys(patterns).filter((key) => key != patternId)

  const patternsToSave = {
    patterns: {},
    version: 1,
  }

  patternIdsToSave.map((id) => {
    patternsToSave.patterns[id] = patterns[id]
  })

  return localStorage.setItem('patternDesignerPatterns', JSON.stringify(patternsToSave))
}

export const clearActive = () => {
  const { patterns } = loadPatterns()
  if (!patterns) {
    return false
  }
  Object.keys(patterns).forEach((key) => {
    patterns[key].active = false
  })
  setStore(patterns)
}

export const countPatterns = () => {
  const { patterns } = loadPatterns()
  if (!patterns) {
    return false
  }
  return Object.keys(patterns).length
}

export const pullRemoteStore = async () => {
  const { patterns } = loadPatterns()
  try {
    const remotePatterns = await fetch('users/me/patterns', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .catch((err) => {
        console.log(err)
      })
      .then((response) => {
        if (response.status == 401) {
          return Promise.reject(401)
        }
        return response.json()
      })
      .then((data) => data)
    return remotePatterns
  } catch {
    return 401
  }
}

export const setRemoteStore = async () => {
  const { patterns } = loadPatterns()
  const receipts = Object.keys(patterns).map(async (pattern) => await api.savePattern({ pattern }))
  return receipts
}

export const mergeStores = (localStoreGroup, cloudStore) => {
  const { patterns } = localStoreGroup
  const localStore = patterns
  const dupes = Object.keys(cloudStore).filter((key) => localStore[key])
  const superStore = { ...localStore, ...cloudStore }
  const clearStore = Object.keys(superStore).filter((key) => {
    if (cloudStore[key] && localStore[key]) { return false } return true
  })
  const clearStoreObj = clearStore.reduce((prevValue, cKey, keyIndex, keyArray) => ({ ...prevValue, [cKey]: superStore[cKey] }), {})
  const unduped = dupes[0] ? null : dupes.map((key) => (localStore[key].dateModified > cloudStore[key].dateModified ? { [key]: cloudStore[key] } : { [key]: localStore[key] }))
  const undupedObj = unduped[0] ? null : unduped.reduce((prev, curr, index, array) => ({ ...prev, ...curr }), {})
  const mergedStore = {
    ...clearStoreObj,
    ...undupedObj,
  }
  // console.log('dupes',dupes,'superStore',superStore,'clearStore',clearStore,'clearStoreObj',clearStoreObj,'unduped',unduped,'mergedStore','undupedObj',undupedObj,mergedStore)
  return mergedStore
}
