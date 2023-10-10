import { defineStore } from 'pinia'
// import { ref } from 'vue'
import socket from '../services/socket.service.js'


export const socketStore = defineStore('socket', {
    state: () => ({ data: {} }),
    actions: {
        notifyBackendEdit(data) {
            socket.emit('edit-ticket', data)
        },
        notifyBackendStopEdit(data) {
            // skicka id
            socket.emit('stop-edit', data)
        },
        listenForTicketLock() {
            socket.on('lock-ticket', (data) => {
                // this.data = data;
                this.data[data.ticket] = data.user
                console.log(data);
            });
        },
        listenForTicketUnlock() {
            socket.on('unlock-ticket', (data) => {
                if (data.ticket in this.data) {
                    delete this.data[data.ticket]
                }
            });
        }
    },
    // getters: {
    //     getDataFromBackend() {
    //         return this.data
    //     }
    // }
})

