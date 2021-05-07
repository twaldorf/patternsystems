async function onSignIn(googleUser) {
    console.log('signed in')
    const id_token = googleUser.getAuthResponse().id_token
    const uid = googleUser.getId()
    console.log(id_token)
    const resolution = await fetch('login', {
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
    // fetch(`http://localhost:3000/users/${uid}/patterns`, {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         pattern: {
    //             key1: "pattern1"
    //         },
    //     }),
    // })
    // .then(response => response.json())
    // .then(data => {console.log(data)})
}



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('login-container').style.backgroundImage = `url(${genBackgroundDataURL('login-container')})`
    document.getElementById("continue").addEventListener('click',() => {window.location.replace('/')})
})

function genBackgroundDataURL(element) {
        const canvas = document.createElement('canvas')
        const {width, height} = document.getElementById(element).getBoundingClientRect()
        canvas.width = width * devicePixelRatio
        canvas.height = height * devicePixelRatio
        const context = canvas.getContext('2d')
        context.fillStyle = '#444'
        context.fillRect(0,0,canvas.width,canvas.height)
        context.beginPath()
        context.moveTo(Math.random()*500 - 800, Math.random()*500 - 800)
        for (let i = 0; i < 80; i++) {
            context.lineTo(Math.random()*500, Math.random()*500)
            if (i%20 == 0) {
                context.fillStyle = '#4a4a4a'
                context.fill()
                context.closePath()
                context.beginPath()
                context.moveTo(-50,-50)
            }
        }
        context.fillStyle = `#555`
        context.fill()
        context.closePath()
        return canvas.toDataURL()
}
