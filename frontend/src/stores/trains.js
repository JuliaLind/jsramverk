import { defineStore } from 'pinia'

/**
 * Part of functionality in toggling between
 * showing all trains or a specific train
 */
export const useTrainsStore = defineStore('trains', {
    state: () => ({
        current: ''
    }),
    actions: {
        setCurrent(trainnr) {
            if (this.current === '') {
                this.current = trainnr
            } else {
                this.current = ''
            }
        }
    }
})
