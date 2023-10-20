/**
 * A spinner to display while
 * waiting for a fetch to resolve
 */
export const loader = {
    /**
     * Creates and a spinner to the document body
     */
    show: function show() {
        const check = document.querySelector('.loader')

        if (check === null) {
            const myLoader = document.createElement('div')
            myLoader.classList.add('loader')

            document.body.appendChild(myLoader)
        }
    },
    /**
     * Removes the spinner from document body
     */
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
