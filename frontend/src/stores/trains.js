import { defineStore } from 'pinia'

/**
 *
 */
export const useTrainsStore = defineStore('trains', {
    state: () => ({
        current: ''
        // delayed: [],
        // codes: []
    }),
    actions: {
        setCurrent(trainnr) {
            if (this.current === '') {
                this.current = trainnr
            } else {
                this.current = ''
            }
            console.log(this.current)
        }
        // setDelayed(announcements) {
        //     this.delayed = announcements
        // },
        // setCodes(codes) {
        //     this.codes = codes
        // },
        // getTrainNumbers() {
        //     return [
        //         ...new Set(
        //             this.delayed
        //                 .map((item) => {
        //                     return item.OperationalTrainNumber
        //                 })
        //                 .sort()
        //         )
        //     ]
        // }
    }
})
