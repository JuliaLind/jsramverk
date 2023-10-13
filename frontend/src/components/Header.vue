<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
<!--Navbar-->
<header id="header">
    <nav id="nav">
        <ul>
            <li>
                <RouterLink to="/" @click="store.current = ''"> Start </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin" @click="store.current = ''"> Admin </RouterLink>
            </li>
        </ul>
    </nav>
</header>
<!-- End Header -->
</template>

<style scoped>
#header {
    /* position: fixed; */
    /* display: flex; */
    background-color: #f6f6f6;
    border-bottom: solid 1px rgba(144, 144, 144, 0.25);
    box-shadow: 0px 0.0375em 0.125em 0px rgba(0,0,0,0.05);
    color: #484848;  
    width: 100%; 
    text-transform: uppercase;
    height: 4.5em;
    font-size: 1.25em;
}

#header h1 {
    color: #484848;
    font-weight: 400;
    float:left;
    margin-left: 2em;
    line-height: 4.5em;
    height: inherit;
}

#header nav{
    float: right;
    margin-right:2em;
    line-height: 4.5em;
}
#header nav ul li {
    display: inline-block;
    border-radius: 4px;
    margin-left: 2.5em;
}
#header nav ul li a {
    color: #3e3e3e;
    text-decoration: none;
}

#header nav ul li a:hover {
    color: #2d2c2c;
}
</style>