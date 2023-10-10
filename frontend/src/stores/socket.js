import { defineStore } from 'pinia'
// import { ref } from 'vue'
import socket from '../services/socket.service.js'


export const socketStore = defineStore('socket', {
    state: () => ({ data: {} }),
    actions: {
        notifyBackendTicketEdit(data) {
            socket.emit('edit-ticket', data)
        },
        notifyBackendStopEdit(data) {
            // skicka id
            socket.emit('stop-edit', data)
        },
        receiveFromBackendTicketEdit() {
            socket.on('editing-ticket', (data) => {
                // this.data = data;
                this.data[data.ticket] = data.user
                console.log(data);
            });
        },
        receiveFromBackendTicketEditStop() {
            socket.on('stop-editing', (data) => {
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

