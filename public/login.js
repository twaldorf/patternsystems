async function onSignIn(googleUser) {
    console.log('signed in')
    const id_token = googleUser.getAuthResponse().id_token
    const uid = googleUser.getId()
    console.log(id_token)
    const resolution = await fetch('http://localhost:3000/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idToken: id_token,
        }),
    })
    .then(response => response.json())
    .then(data => {return data})
    console.log(resolution)
    // fetch(`http://localhost:3000/users/${uid}/patterns`, {
    //     method: 'get',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    // })
    // .then(response => response.json())
    // .then(data => {console.log(data)})
    fetch(`http://localhost:3000/users/${uid}/patterns`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pattern: {
                key1: "pattern1"
            },
        }),
    })
    .then(response => response.json())
    .then(data => {console.log(data)})
}

function setBackground() {
        const canvas = document.createElement('canvas')
        const {width, height} = utilities.getDimensionsFromCoordinates(points)
        canvas.width = width * devicePixelRatio
        canvas.height = height * devicePixelRatio
        const context = canvas.getContext('2d')
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
