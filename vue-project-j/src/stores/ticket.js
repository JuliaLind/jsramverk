import { ref } from 'vue'
import { defineStore } from 'pinia'

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
