import * as controller from './domcontroller.js'
import * as api from './api.js'

export async function setup (state, baseCanvas) {
    baseCanvas.parent('sketch-holder')
    const user = await api.getCurrentUser()
    if (user) {
        document.getElementById('btnLogin').textContent = 'Logged in'
        document.getElementById('current-user').textContent = user.id
    }
    controller.setup(state)
}