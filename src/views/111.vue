<template>
    <p>Child options expand when clicked (default)</p>
    <el-cascader v-model="value" :options="types" @click="aa"/>
    {{ value }}
    {{ t }}
    <button @click="aa"></button>
</template>
<script setup lang="ts">
    import { reactive, ref, onMounted } from 'vue'
    import Axios from "axios"
    import { useCookies } from "vue3-cookies"

    const types = ref([])
    const value = ref([])
    let t = ref("")

    function aa(){
        console.log(value.value[1])
        t.value=value.value[1]
    }

    onMounted(() => {
        Axios.get('http://localhost:8080/type/cascadeType')
          .then(function (response) {
              types.value=response.data
          })
          .catch(function (error) {
              console.log(error);
          });
    })
</script>