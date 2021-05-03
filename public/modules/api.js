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
        const data = await fetch(`http://localhost:3000/users/me/patterns`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({pattern: {
                [pattern]: pattern},
            }),
        }).then(response => response.json()).then(data => data)
        return data
}