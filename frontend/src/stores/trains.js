import { defineStore } from 'pinia'

/**
 * Part of functionality in toggling between
 * showing all trains or a specific train
 */
export const useTrainsStore = defineStore('trains', {
    state: () => ({
        // Contains the number of train to display in DelayedList and as
        // marker on map. If value is not set all trains are displayed
        current: ''
    }),
    actions: {
        /**
         * For togglings between displaying specific train or all trains
         * @param {string} trainnr 
         */
        setCurrent(trainnr) {
            if (this.current === '') {
                this.current = trainnr
            } else {
                this.current = ''
            }
        }
    }
})
