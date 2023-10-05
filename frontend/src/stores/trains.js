import { defineStore } from 'pinia'

/**
 *
 */
export const useTrainsStore = defineStore('trains', {
    state: () => ({
        //  delayed: ref([]),
        current: ''
    }),
    actions: {
        // setTrains(trains) {
        //     this.delayed.value = trains
        // },
        setCurrent(trainnr) {
            if (this.current === '') {
                this.current = trainnr
            } else {
                this.current = ''
            }
            console.log(this.current)
        }
    }
})
