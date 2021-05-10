import * as controller from './domcontroller.js'
import * as api from './api.js'

export async function setup (state, baseCanvas) {
    baseCanvas.parent('sketch-holder')
    const user = await api.getCurrentUser()
    if (user) {
        document.getElementById('current-user').textContent = user.id
        document.getElementById('btnLogin').textContent = 'Log Out'
        document.getElementById('btnLogin').href = '/logout'
    }
    controller.setup(state)
}