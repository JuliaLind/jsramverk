<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const store = useAuthStore()
let username = ''
let password = ''
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
    <div>
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header h5">Logga in</div>
                        <div class="card-body">
                            <form v-on:submit.prevent="store.login(username, password)">
                                <div class="form-group mb-3">
                                    <label class="mb-2" for="userName">E-postadress</label>
                                    <input
                                        class="form-control"
                                        id="userName"
                                        type="email"
                                        name="username"
                                        required="required"
                                        v-model="username"
                                        autocomplete="off"
                                    />
                                </div>
                                <div class="form-group mb-3">
                                    <label class="mb-2" for="passWord">Lösenord</label>
                                    <div class="password-container">
                                        <input
                                            id="passWord"
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
                                    <input
                                        type="submit"
                                        value="Logga in"
                                        class="btn btn-dark mt-3"
                                    />
                                </div>
                            </form>
                        </div>
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

.password-container {
    display: flex;
    align-items: center;
}
</style>
