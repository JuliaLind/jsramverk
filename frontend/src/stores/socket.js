import { defineStore } from 'pinia'
// import { ref } from 'vue'
import socket from '../services/socket.service.js'


export const socketStore = defineStore('socket', {
    state: () => ({ data: {} }),
    actions: {
        notifyBackendTicketEdit(data) {
            socket.emit('edit-ticket', data)
        },
        receiveFromBackendTicketEdit() {
            socket.on('editing-ticket', (data) => {
                this.data = data;
            });
        }
    },
    getters: {
        getDataFromBackend() {
            return this.data
        }
    }
})

