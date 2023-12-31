<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { getTrainNumbers, extractTrainNumbers } from '../services/api.service.js'
import socket from '../services/socket.service.js'

let trainnumbers = ref([])
let reasoncodes = ref([])
let code = ''
let trainnumber = ''
const store = useAuthStore()

onMounted(async () => {
    reasoncodes.value = store.reasonCodes
    trainnumbers.value = await getTrainNumbers()
})

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    trainnumbers.value = extractTrainNumbers(updatedTrains)
})

/**
 * Assigns the initial values for the form
 * list as a default value for the new ticket
 */

let traindate = new Date().toJSON().slice(0, 10)

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code, trainnumber, traindate) {
    const newTicket = `
        mutation {
            createTicket(code: "${code}", trainnumber: "${trainnumber}", traindate: "${traindate}") {
                _id
                code
            }
        }
    `
    await store.submitNewTicket(newTicket)
}
</script>

<template>
    <div class="col-md-3 new-ticket">
        <div class="card shadow-sm">
            <div class="card-header h5 bg-primary text-light">Lägg till ärende</div>
            <div class="card-body">
                <form v-on:submit.prevent="submitForm(code, trainnumber, traindate)">
                    <div class="form-group mb-3">
                        <label for="ticketNumber" class="mb-1">Ärendenummer</label>
                        <input
                            name="ticketnumber"
                            id="ticketNumber"
                            type="text"
                            class="form-control"
                            disabled
                            value="Tilldelas automatiskt"
                        />
                    </div>
                    <div class="form-group mb-3">
                        <label for="trainNumber" class="mb-1">Tågnummer</label>
                        <select
                            id="trainNumber"
                            name="trainnumber"
                            class="form-control"
                            required
                            v-model="trainnumber"
                        >
                            <option :hidden="true" disabled :value="''">Välj tågnummer</option>
                            <option v-for="train in trainnumbers" :key="train" :value="train">
                                {{ train }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label for="reasonCode" class="mb-1">Orsakskod</label>
                        <select
                            name="reasoncode"
                            id="reasonCode"
                            required
                            class="form-control"
                            v-model="code"
                        >
                            <option disabled hidden :value="''">Välj orsakskod</option>
                            <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                                {{ code.Code }} - {{ code.Level3Description }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label for="trainDate" class="mb-1">Datum</label>
                        <input
                            id="trainDate"
                            type="date"
                            disabled
                            name="traindate"
                            class="form-control"
                            v-bind:value="traindate"
                        />
                    </div>
                    <input type="submit" class="btn btn-success" value="Skapa" />
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
input:disabled,
select:disabled {
    background: #f8f8f8;
}

.card {
    position: sticky;
    top: 4rem;
}

.new-ticket {
    position: sticky;
    top: 3rem;
}
</style>
