<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const store = useAuthStore()
let username = ''
let password = ''
let name = ''
let innerText = ref('visibility')
let fieldType = ref('password')

function toggleVisibility() {
    if (innerText.value === 'visibility' && fieldType.value === 'password') {
        innerText.value = 'visibility_off'
        fieldType.value = 'text'
    } else {
        innerText.value = 'visibility'
        fieldType.value = 'password'
    }
}
</script>

<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header h5">Registrering</div>
                    <div class="card-body">
                        <form v-on:submit.prevent="store.register(username, password, name)">
                            <div class="form-group">
                                <label for="name" class="mb-2">Namn</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    name="name"
                                    required="required"
                                    v-model="name"
                                /><br />
                            </div>
                            <div class="form-group mb-3">
                                <label class="mb-2" for="userName">E-postadress</label>
                                <input
                                    class="form-control"
                                    type="email"
                                    name="username"
                                    required="required"
                                    v-model="username"
                                />
                            </div>
                            <div class="form-group mb-3">
                                <label class="mb-2" for="password">Lösenord</label> <br />
                                <div class="password-container">
                                    <input
                                        class="form-control"
                                        v-bind:type="fieldType"
                                        required="required"
                                        name="password"
                                        v-model="password"
                                    />
                                    <span
                                        class="material-symbols-outlined"
                                        @click="toggleVisibility()"
                                    >
                                        {{ innerText }}
                                    </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="submit" value="Registrera" class="btn btn-dark mt-3" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.material-symbols-outlined {
    cursor: pointer;
    padding-left: 0.7rem;
}

.container {
    padding-bottom: 4.5rem;
}

.password-container {
    display: flex;
    align-items: center;
}
</style>
