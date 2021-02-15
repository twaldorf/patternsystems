import * as controller from './domcontroller.js'

export async function setup (state) {
    const username = 'spiva2'
    const address = 'http://localhost:3000/'
    const userObject = await fetch(address + 'users/' + username)
        .then(response => {
            return response.json()
        })
    document.getElementById('current-user').textContent = userObject.username

    controller.setup(state)
}