import * as store from './store.js'

const user = {
    username: 'twaldorf',
    patterns: 
        [
            'pattern1',
            'pattern2'
    ],
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
        ]
    },
    pattern2: {
        points: [
            [856,1363],
            [957,231]
        ],
        colors: [
            '#FFFFFF',
            '#134ECC'
        ]
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
        ]
    }
}

store.setStore(tempPatterns)

// store.deletePattern('pattern2')

console.log(store.loadPatterns())

store.savePattern(newPattern)

console.log(store.loadPatterns())

console.log(store.deletePattern('pattern23'))

console.log(store.loadPatterns())