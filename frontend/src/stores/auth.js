import { defineStore } from 'pinia'
import { router } from '../router/index.js'

export const useAuthStore = defineStore('store', {
    state: () => ({
        data: {
            token: '',
            userEmail: ''
        }
    }),
    actions: {
        async login(username, password) {
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
                window.alert(result.errors.detail)
                return result.errors.detail
            }
            this.token = result.data.token
            this.userEmail = result.data.user.email
            router.push('/admin')

            return 'ok'
        },
        getToken() {
            return this.token
        },
        async logout() {
            this.token = ''
        },
        async register(username, password, name) {
            const user = {
                name: name,
                email: username,
                password: password
            }

            const response = await fetch(`${import.meta.env.VITE_URL}/register`, {
                body: JSON.stringify(user),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            })
            const result = await response.json()

            if ('errors' in result) {
                window.alert(result.errors.detail)
                return result.errors.detail
            }
            return await this.login(username, password)
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
                window.alert(result.errors[0].message)
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
                return result.data
            }
            return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
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
                return result.data
            }
            return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
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
                return result.data
            }
            return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
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
            return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
        }
    }
})
