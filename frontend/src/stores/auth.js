import { defineStore } from 'pinia'
import { router } from '../router/index.js'
import socket from '../services/socket.service.js'
import { customAlert, toast } from '../services/alert.service.js'
import { loader } from '../services/loader.service.js'
import { getCodes } from '../services/api.service.js'

export const useAuthStore = defineStore('store', {
    state: () => ({
        data: {
            token: '',
            userEmail: '',
            reasoncodes: []
        }
    }),
    actions: {
        async login(username, password) {
            loader.show()
            const user = {
                email: username,
                password: password
            }
            const response = await fetch(`${import.meta.env.VITE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(user)
            })

            const result = await response.json()
            if ('errors' in result) {
                loader.hide()
                customAlert(result.errors.detail)
                return
            }
            this.token = result.data.token
            this.userEmail = result.data.user.email
            this.listenForExpired()
            this.reasonCodes = await getCodes()
            router.push('/admin')
            socket.emit('logged-in', this.token)
            loader.hide()
            toast(`Välkommen tillbaka ${result.data.user.name}!`)
        },
        getToken() {
            return this.token
        },
        logout() {
            this.token = ''
            socket.emit('logged-out', this.token)
        },
        listenForExpired() {
            socket.on('unauthorized', () => {
                this.token = ''
                router.push('/login')
                customAlert('Your token expired, please login again')
            })
        },
        async register(username, password, name) {
            loader.show()
            const user = {
                name: name,
                email: username,
                password: password
            }

            const response = await fetch(`${import.meta.env.VITE_URL}/register`, {
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })
            const result = await response.json()

            if ('errors' in result) {
                let message = ''
                if (result.errors.detail.includes('duplicate key')) {
                    message = `Det finns redan en användare med användarnamn ${username}`
                } else {
                    message = 'Något gick fel, försök igen om en stund'
                }
                loader.hide()
                customAlert(message)
                return
            }
            await this.login(username, password)
        },
        /**
         * @param result - the returned object from
         * backend, to check if token has expired.
         * This function is used in the ticket service
         */
        isTokenValid(result) {
            if ('errors' in result) {
                this.token = ''
                router.push('/login')
                customAlert(result.errors[0].message)
                return false
            }
            return true
        },

        /**
         *
         * @param {Object} newTicketObject An object containing reasoncode,
         * trainnumber and traindate
         * @returns {Promise<array>} response - contains
         * the document number for the submitted ticket
         */
        async submitNewTicket(newTicketObject) {
            const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ query: newTicketObject })
            })
            const result = await response.json()

            if (this.isTokenValid(result)) {
                socket.emit('refresh-tickets')
                toast(`Du har skapat ett nytt ärende med id ${result.data.createTicket._id}!`)
            }
        },

        /**
         *
         * @param {Object} updatedTicketObject An object containing
         * _id, reasoncode,
         * trainnumber and traindate
         * @returns {Promise<array>} response - contains
         * the document number for the submitted ticket
         * }
         */
        async updateTicket(updatedTicketObject) {
            const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ query: updatedTicketObject })
            })
            const result = await response.json()

            if (this.isTokenValid(result)) {
                socket.emit('updated', result.data.updateTicket)
                toast(`Du har uppdaterat ärende ${result.data.updateTicket._id}!`)
            }
        },

        /**
         *
         * @param {string} ticketid - _id of the ticket
         * @returns {Promise<array>} response - contains
         * the document number for the submitted ticket
         */
        async deleteTicket(deletedTicketObject) {
            const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ query: deletedTicketObject })
            })
            const result = await response.json()

            if (this.isTokenValid(result)) {
                socket.emit('refresh-tickets')
                toast(`Du har raderat ärende ${result.data.deleteTicket._id}`)
            }
        },

        /**
         * @returns {Promise<array>} previous tickets
         */
        async getTickets() {
            const query = `{tickets {
                _id
                code
                trainnumber
                traindate
              }}`
            const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ query: query })
            })
            const result = await response.json()

            if (this.isTokenValid(result)) {
                return result.data.tickets
            }
            return []
        }
    }
})
