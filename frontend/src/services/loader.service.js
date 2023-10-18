export const loader = {
    show: function show() {
        const check = document.querySelector('.loader')

        if (check === null) {
            const myLoader = document.createElement('div')
            myLoader.classList.add('loader')

            document.body.appendChild(myLoader)
        }
    },

    hide: function hide() {
        const myLoader = document.querySelector('.loader')

        if (myLoader !== null) {
            myLoader.classList.add('loader--hidden')
            myLoader.addEventListener('transitionend', () => {
                myLoader.remove()
            })
        }
    }
}
