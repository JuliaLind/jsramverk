<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { getCodes, getTrainNumbers } from '../services/api.service.js'

let trainnumbers = ref([])
let reasoncodes = ref([])
let code = ''
let trainnumber = ''

onMounted(async () => {
    reasoncodes.value = await getCodes()
    trainnumbers.value = await getTrainNumbers()
})

/**
 * Assigns the initial values for the form
 * list as a default value for the new ticket
 */

let traindate = new Date().toJSON().slice(0, 10)


const emit = defineEmits(['form-submitted'])
const store = useAuthStore()

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
    /**
     * Sends signal to tickets-component to re-render
     */
    emit('form-submitted')
}
</script>

<template>
    <div class="col-md-3 new-ticket">
        <div class="card shadow-sm">
            <div class="card-header h5 bg-primary text-light">Lägg till ärende</div>
            <div class="card-body">
                <form v-on:submit.prevent="submitForm(code, trainnumber, traindate)">
                    <div class="form-group mb-3">
                        <label class="mb-1">Ärendenummer</label>
                        <input type="text" class="form-control" disabled value="Tilldelas automatiskt" />
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-1">Tågnummer</label>
                        <select name="trainnumber" class="form-control" required v-model="trainnumber">
                            <option :hidden="true" disabled :value="''">Välj tågnummer</option>
                            <option v-for="train in trainnumbers" :key="train" :value="train">
                                {{ train }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-1">Orsakskod</label>
                        <select name="code" required class="form-control" v-model="code">
                            <option disabled hidden :value="''">Välj orsakskod</option>
                            <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                                {{ code.Code }} - {{ code.Level3Description }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-1">Datum</label>
                        <input type="date" disabled name="traindate" class="form-control" v-model="traindate" />
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

.new-ticket {
    flex-direction: row;
    position: sticky;
    top: 0;
}

</style>
