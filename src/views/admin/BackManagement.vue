<template>
    <el-table :data="back" height="550" style="width: 100%">
      <el-table-column prop="back_id" label="back_id" width="170" />
      <el-table-column prop="user_id" label="user_id" width="170" />
      <el-table-column prop="book_code" label="book_code" width="250" />
      <el-table-column prop="borrow_date" label="borrow_date"  />
      <el-table-column prop="return_date" label="return_date"  />
    </el-table>
</template>

<script setup>

import Axios from "axios"
import { ref, onMounted, } from 'vue'
import { useCookies } from "vue3-cookies"


const { cookies } = useCookies();
let back = ref([])

onMounted(() => {
    Axios.get('http://localhost:8080/back/all',
        {
          headers: {
            'content-type': 'application/json',
            "token": cookies.get('token')
          }
        }
      )
      .then(function (response) {
        //提示信息
        if(response.data.code!=10000){
          Message({type:"error", text:response.data.msg})
        }
        back.value=response.data.data
      })
      .catch(function (error) {
        console.log(error);
      });
})




</script>