export const getCurrentUser = async () => {
    try {
        const user = await fetch(`http://localhost:3000/users/me`, {
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
    console.log(pattern)
    const jsonPattern = JSON.stringify(pattern)
        const data = await fetch(`http://localhost:3000/users/me/patterns`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonPattern,
        }).then(response => response.json()).then(data => data)
        return data
}