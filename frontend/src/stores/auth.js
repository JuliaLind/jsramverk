import { defineStore } from 'pinia'
import { router } from '../router/index.js'
import socket from '../services/socket.service.js'
import { customAlert, toast } from '../services/alert.service.js'
import { loader } from '../services/loader.service.js'
import { getCodes } from '../services/api.service.js'

/**
 * Handles logic related to admin
 */
export const useAuthStore = defineStore('store', {
    state: () => ({
        data: {
            // JWT
            token: '',
            //username
            userEmail: '',
            // codes represent different reasons for a train delay
            reasoncodes: []
        }
    }),
    actions: {
        /**
         * Logs in user to give access to admin route
         * and ticket administration
         * @param {string} username
         * @param {string} password
         * @returns {void}
         */
        async login(username, password) {
            // show a spinner while waiting for the fetch to resolve
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

            // if logging in wasn't successful
            if ('errors' in result) {
                // hide the spinner
                loader.hide()

                // display an alert message to user
                // with reason to failed login
                customAlert(result.errors.detail)
                return
            }
            this.token = result.data.token
            this.userEmail = result.data.user.email

            // when token expires backend will emit a message to socket
            this.listenForExpired()
            this.reasonCodes = await getCodes()

            // redirect from login view to admin view
            router.push('/admin')

            // send token to backend to join the
            // "tickets room" for admin updates
            socket.emit('logged-in', this.token)

            // hide the spinner
            loader.hide()
            toast(`Välkommen tillbaka ${result.data.user.name}!`)
        },
        /**
         * This method is probably not neccessary as
         * no getter is needed, but too late to remove as other code
         * may already be using it
         * @returns {string} token
         */
        getToken() {
            return this.token
        },
        /**
         * Removes token from state and also informs backend
         * to remove token attribute from socket and remove socket from
         * "tickets room"
         */
        logout() {
            this.token = ''
            socket.emit('logged-out')
        },
        /**
         * When backend sends message that token has expired, removes saved token from state
         * redirects to login and display alertmessage to user if token expires
         */
        listenForExpired() {
            socket.on('unauthorized', () => {
                this.token = ''
                router.push('/login')
                customAlert('Your token expired, please login again')
            })
        },
        /**
         * Registers new user in backend database
         * @param {string} username
         * @param {string} password
         * @param {string} name
         * @returns { void }
         */
        async register(username, password, name) {
            // show spinner while waiting for fetch
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
                // different messages depending on reason for failed registration
                if (result.errors.detail.includes('duplicate key')) {
                    message = `Det finns redan en användare med användarnamn ${username}`
                } else {
                    message = 'Något gick fel, försök igen om en stund'
                }
                // hide the spinner
                loader.hide()

                // display alert message to user
                customAlert(message)
                return
            }
            // spinner will be hidden in the login function after failed or successful login
            await this.login(username, password)
        },
        /**
         * @param result - the returned object from
         * backend, to check if token has expired.
         * This function is used in the ticket service
         */
        isTokenValid(result) {
            if ('errors' in result) {
                // this.token = ''
                this.logout()
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
                // if the registration of new ticket went well
                // inform backend to send updated tickets list to
                // self and other users, better solution would maybe be
                // to only send the updated ticket to add to local tickets list
                socket.emit('refresh-tickets')
                // confirm to user the id of the new ticket
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
                // if everything went well with ticket update,
                // send the updated ticket data to backend to be forwarded to
                // all users (maybe not the best solution, a better way would be
                // to send to all sockets in tickets room directly from ticketsModel
                // update )
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
                // if everything went with delete inform backend to send
                // updated tickets list to all users (better solution would maybe be to
                // only inform the other user of the ticket id to remove from local list)
                socket.emit('refresh-tickets')
                toast(`Du har raderat ärende ${result.data.deleteTicket._id}`)
            }
        },

        /**
         * Gets all the current tickets from backend database
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
