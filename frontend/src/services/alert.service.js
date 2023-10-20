/**
 * Creates and adds to document body a custom 'alert' with an ok buttom
 * that needs to be clicked by the user in order to close
 * (the message will also dissapear if page is reloaded)
 * @param {string} message - message to be displayed in the alert
 */
export const customAlert = (message) => {
    const cAlert = document.createElement('div')
    const alertBody = document.createElement('div')

    cAlert.classList.add('my-alert')
    alertBody.classList.add('my-alert-body')
    cAlert.appendChild(alertBody)
    document.body.appendChild(cAlert)

    cAlert.classList.add('my-visible')
    cAlert.classList.add('my-darken')
    const alertContent = document.createElement('div')

    alertContent.classList.add('my-alert-content')

    const alertMsg = document.createElement('div')
    alertMsg.innerText = message
    alertMsg.classList.add('my-alert-msg')

    const btn = document.createElement('div')

    btn.innerText = 'OK'
    btn.classList.add('my-alert-btn')

    alertContent.appendChild(alertMsg)
    alertContent.appendChild(btn)
    alertBody.appendChild(alertContent)

    btn.addEventListener('click', () => {
        alertBody.innerHTML = ''
        cAlert.classList.remove('my-darken')
        setTimeout(function () {
            cAlert.classList.remove('my-visible')
            cAlert.remove()
        }, 300)
    })
}

/**
 * Creates and adds do document body a toast-message.
 * The toast will automatically dissapear after 3.4 s
 * @param {string} message - message to be displayed in the toast
 */
export const toast = (message) => {
    const toast = document.createElement('div')
    const toastBody = document.createElement('div')
    const messageContainer = document.createElement('p')

    messageContainer.classList.add('my-toast-message')
    toast.classList.add('my-toast')
    toastBody.classList.add('my-toast-body')
    toast.appendChild(toastBody)
    toastBody.appendChild(messageContainer)
    messageContainer.innerHTML = message
    document.body.appendChild(toast)

    setTimeout(function () {
        toast.classList.add('my-visible')
    }, 200)

    setTimeout(function () {
        toast.classList.remove('visible')
    }, 3000)

    setTimeout(function () {
        toast.remove()
    }, 3400)
}
