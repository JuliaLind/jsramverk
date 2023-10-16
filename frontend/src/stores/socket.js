import { defineStore } from 'pinia'
import socket from '../services/socket.service.js'

export const socketStore = defineStore('socket', {
    state: () => ({ data: {} }),
    actions: {
        notifyBackendEdit(data) {
            socket.emit('edit-ticket', data)
        },
        notifyBackendStopEdit(data) {
            socket.emit('stop-edit', data)
        },
        listenForTicketLock() {
            socket.on('lock-ticket', (data) => {
                this.data[data.ticket] = data.user
            })
        },
        listenForTicketUnlock() {
            socket.on('unlock-ticket', (data) => {
                if (data.ticket in this.data) {
                    delete this.data[data.ticket]
                }
            })
        },
    }
})
