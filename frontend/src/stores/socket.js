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
                console.log(data)
            })
        },
        listenForTicketUnlock() {
            socket.on('unlock-ticket', (data) => {
                if (data.ticket in this.data) {
                    delete this.data[data.ticket]
                }
            })
        },
        listenForTicketUpdate() {
            socket.on('updated', (data) => {
                if (data.ticket in this.data) {
                    delete this.data[data.ticket]
                }
            })
        },
        notifyUpdate(data) {
            socket.emit('updated', data)
        },
        listenForRefresh() {
            socket.on("refresh-tickets", () => {
                this.counter += 1
            })
            socket.on("unlock-ticket", () => {
                this.counter += 1
            })
        }
    }
})
