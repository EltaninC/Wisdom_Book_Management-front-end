<template>
    <el-table :data="appointments" height="500" style="width: 95%">
      <el-table-column prop="appointment_id" label="appointmentId" width="170" />
      <el-table-column prop="user_id" label="userId" width="170" />
      <el-table-column prop="book_id" label="bookId" />
      <el-table-column prop="start_date" label="startDate"  />
      <el-table-column prop="end_date" label="endDate" />
      <el-table-column prop="state" label="status" />
    </el-table>
</template>

<script setup>

import Axios from "axios"
import { ref, onMounted, } from 'vue'
import { useCookies } from "vue3-cookies"


const { cookies } = useCookies();
const appointments = ref([])

onMounted(() => {
    Axios.get('http://localhost:8080/appointment',{
        headers: {
           'content-type': 'application/json',
           "token": cookies.get('token')  //token换成从缓存获取
        }
      })
        .then(function (response) {
            appointments.value=response.data.data
        })
        .catch(function (error) {
            console.log(error);
        });
})

</script>