// // import axios from 'axios'
// import { useAuthStore } from '../stores/auth'
// const store = useAuthStore()
// const token = store.getToken()

// /**
//  *
//  * @param {Object} newTicketObject An object containing reasoncode,
//  * trainnumber and traindate
//  * @returns {Promise<array>} response - contains
//  * the document number for the submitted ticket
//  * @example {
//  *    "data": {
//  *        "acknowledged": true,
//  *        "insertedId": "6504bccfa00196da499d69d1"
//  *    }
//  * }
//  */
// export const submitNewTicket = async (newTicketObject) => {
//     // const res = await axios.post(`${import.meta.env.VITE_URL}/tickets`, newTicketObject)
//     // return res.data
//     const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
//         body: JSON.stringify(newTicketObject),
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json',
//             'x-access-token': token,
//         }
//     });
//     const result = await response.json();
//     console.log(result);
//     if (store.isTokenExpired(result)) {
//         return result.data;
//     }
//     return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
// }

// /**
//  *
//  * @param {Object} updatedTicketObject An object containing
//  * _id, reasoncode,
//  * trainnumber and traindate
//  * @returns {Promise<array>} response - contains
//  * the document number for the submitted ticket
//  * }
//  */
// export const updateTicket = async (updatedTicketObject) => {
//     // const res = await axios.post(`${import.meta.env.VITE_URL}/tickets`, newTicketObject)
//     // return res.data
//     const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
//         body: JSON.stringify(updatedTicketObject),
//         method: 'PUT',
//         headers: {
//             'content-type': 'application/json',
//             'x-access-token': token,
//         }
//     });
//     const result = await response.json();
//     console.log(result);
//     if (store.isTokenExpired(result)) {
//         return result.data;
//     }
//     return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
// }

// /**
//  *
//  * @param {string} ticketid - _id of the ticket
//  * @returns {Promise<array>} response - contains
//  * the document number for the submitted ticket
//  * @example {
//  *    "data": {
//  *    }
//  * }
//  */
// export const deleteTicket = async (ticketid) => {
//     // const res = await axios.post(`${import.meta.env.VITE_URL}/tickets`, newTicketObject)
//     // return res.data
//     const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
//         delete: JSON.stringify({
//             _id: ticketid
//         }),
//         method: 'DELETE',
//         headers: {
//             'content-type': 'application/json',
//             'x-access-token': token,
//         }
//     });
//     const result = await response.json();

//     console.log(result);
//     if (store.isTokenExpired(result)) {
//         return result.data;
//     }
//     return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
// }

// /**
//  * @returns {Promise<array>} previous tickets
//  */
// export const getTickets = async () => {
//     // const res = await axios.get(`${import.meta.env.VITE_URL}/tickets`)
//     // return res.data.data
//     const response = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
//         method: 'GET',
//         headers: {
//             'content-type': 'application/json',
//             'x-access-token': token,
//         }
//     });
//     const result = await response.json();

//     console.log(result);
//     if (store.isTokenExpired(result)) {
//         return result.data;
//     }
//     return undefined //?? not sure what to return, the view should update to display login-form instead of tickets list
// }
