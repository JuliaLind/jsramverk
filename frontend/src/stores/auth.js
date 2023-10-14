import { defineStore } from 'pinia'
import axios from 'axios'
import { router } from '../router/index.js'

export const useAuthStore = defineStore('store', {
    state: () => ({
        data: {
            token: '',
            // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5zZSIsIm5hbWUiOiJUZXN0IFRlc3Rzc29uIiwiaWF0IjoxNjk3Mjg3NTE0LCJleHAiOjE2OTczNzM5MTR9.yYgOudcaNESBi4GIlN6-ptPT6KHt1Rc5D9K_p6gzpvU",
            userEmail: ''
        }
    }),
    actions: {
        async login(username, password) {
            const user = {
                email: username,
                password: password
            }
            const result = await axios.post(`${import.meta.env.VITE_URL}/login`, user)
            if ('errors' in result) {
                return result.errors.detail
            }
            this.token = result.data.data.token
            this.userEmail = result.data.data.user.email
            console.log(this.token);
            router.push('/admin')

            //note for later: set toast to "hello 'result.data.ta.user.name'""
            return 'ok'
        },
        getToken() {
            return this.token
        },
        async logout() {
            this.token = ''
            // note for later - choose to which page we want to redirect
            // after logout. example below (not to be used together with routerlink component)
            // router.push('/login');
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

            if ('errors' in result.data) {
                return result.data.errors.status
            }
            return await this.login(username, password)
        },
        /**
         * @param resultObject - the returned object from
         * backend, to check if token has expired.
         * This function is used in the ticket service
         */
        async isTokenValid(resultObject) {
            if ('errors' in resultObject) {
                this.token = ''
                // note for later: set toast: "${resultObject.errors.title} ${resultObject.errors.detail}"
                router.push('/login')
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
            console.log('new ticket result: ', result)
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
            console.log(result)
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
