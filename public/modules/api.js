export const getCurrentUser = async () => {
    try {
        const user = await fetch(`users/me`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => data)
        return user
    } catch(e) {
        return false
    }
}

export const savePattern = async (pattern) => {
    const jsonPattern = JSON.stringify(pattern)
        const data = await fetch(`users/me/patterns`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonPattern,
        }).then(response => response.json()).then(data => data)
        return data
}