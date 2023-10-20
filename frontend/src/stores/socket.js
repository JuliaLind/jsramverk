import { defineStore } from 'pinia'
import socket from '../services/socket.service.js'

export const socketStore = defineStore('socket', {
    state: () => ({ data: {} }),
    actions: {
        /**
         * Sends message to backend to inform other users
         * to lock the ticket for editing or deleting
         * @param {Object} data associative array containing
         * ticketid and userid
         */
        notifyBackendEdit(data) {
            socket.emit('edit-ticket', data)
        },
        /**
         * Sends message to backend to inform other users
         * to unlock the ticket for editing or deleting
         * @param {Object} data associative array containing
         * ticketid
         */
        notifyBackendStopEdit(data) {
            socket.emit('stop-edit', data)
        },
        /**
         * Listens for message from backend to
         * lock the ticket for editing or deleting
         * @param {Object} data associative array containing
         * ticketid and userid.
         * Adds the ticketid and username key-value to the data array.
         * All SingleTicket component with corresponding ids that are
         * keys in the data array are locked
         */
        listenForTicketLock() {
            socket.on('lock-ticket', (data) => {
                this.data[data.ticket] = data.user
            })
        },
        /**
         * Listens for message from backend to for when to
         *  unlock the ticket for editing or deleting
         * @param {Object} data associative array containing
         * ticketid. Removes the key-value pair with the
         * ticketid as key from the data awway, thereby unlocking
         * the corresponding SingleTicket component
         */
        listenForTicketUnlock() {
            socket.on('unlock-ticket', (data) => {
                if (data.ticket in this.data) {
                    delete this.data[data.ticket]
                }
            })
        }
    }
})
