import { defineStore } from 'pinia'
// import { ref } from 'vue'
import axios from 'axios'
import { router } from '../router/index.js'

export const useAuthStore = defineStore('store', {
    state: () => ({ token: '' }),
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
            console.log(this.token)
            console.log(result.data.data.user.name)
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
         * {
         * "errors": {
         *    "status": 500,
         *    "source": "/login",
         *    "title": "Failed authentication",
         *    "detail": "jwt expired"
         * }
         * }
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
         * @example {
         *    "data": {
         *        "acknowledged": true,
         *        "insertedId": "6504bccfa00196da499d69d1"
         *    }
         * }
         */
        async submitNewTicket(newTicketObject) {
            const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
                body: JSON.stringify(newTicketObject),
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': this.token
                }
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
            const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
                body: JSON.stringify(updatedTicketObject),
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': this.token
                }
            })
            const result = await response.json()
            console.log('updated ticket result: ', result)
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
         * @example {
         *    "data": {
         *    }
         * }
         */
        async deleteTicket(ticketid) {
            console.log(ticketid)
            const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
                body: JSON.stringify({
                    _id: ticketid
                }),
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': this.token
                }
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
            const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': this.token
                }
            })
            const result = await response.json()

            if (this.isTokenValid(result)) {
                return result.data
            }
            return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
        }
    }
})
