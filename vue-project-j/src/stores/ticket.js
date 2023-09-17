// import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * When a DelayedItem component is clicked
 * on the object containing data for the
 * delayed train is stored here and then
 * accessed from the TicketForm component
 */
export const useTicketStore = defineStore('ticket', {
    state: () => ({ currentItem: {} }),
    actions: {
        setCurrent(item) {
            this.currentItem = item
        },
        getCurrent() {
            return this.currentItem
        }
    },
})
