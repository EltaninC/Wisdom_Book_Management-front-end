<template>
    <el-table :data="borrow" style="width: 98%">
      <el-table-column fixed label="borrow_id" width="170">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.borrow_id }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="user_id" width="170" />
      <el-table-column prop="book_code" label="book_code" width="200" />
      <el-table-column prop="borrow_date" label="borrow_date"  />
      <el-table-column prop="expect_return_date" label="expect_return_date"  />
      <el-table-column prop="renew" label="renew" width="120" />
      <el-table-column fixed="right" label="Operations" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" 
          @click="dialogFormVisible = true,borrow_id=scope.row.borrow_id">还书</el-button>
          <el-button link type="primary" size="small" @click="renew(scope.row.borrow_id)">续借</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ReturnBook @close="close" :dialog-form-visible=dialogFormVisible :borrow_id=borrow_id></ReturnBook>
</template>

<script setup>

import Axios from "axios"
import { ref, onMounted, } from 'vue'
import { useCookies } from "vue3-cookies"
import ReturnBook from "./ReturnBook.vue"
import qs from 'querystring'


const { cookies } = useCookies();
let borrow = ref([])
const dialogFormVisible = ref(false)
const borrow_id = ref(0)

function close() {
  dialogFormVisible.value=false
  getFilterTableData()
}

function renew(borrow_id) {
  Axios.post('http://localhost:8080/borrow/renew',
    qs.stringify({borrow_id: borrow_id}),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        "token": cookies.get('token')
      }
    }
  )
  .then(function(response)
    {
      getFilterTableData()
    }
  )
  .catch(function(error)
    {
      console.log(error)
    }
  )
}

onMounted(() => {
  getFilterTableData()
})

function getFilterTableData(){
  Axios.get('http://localhost:8080/borrow/recordById',{
      headers: {
          'content-type': 'application/json',
          "token": cookies.get('token')
      }
    })
      .then(function (response) {
          borrow.value=response.data.data
      })
      .catch(function (error) {
          console.log(error);
      });
}

</script>