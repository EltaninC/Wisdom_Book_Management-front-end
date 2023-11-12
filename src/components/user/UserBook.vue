<template>
  <div class="mt-4">

    <el-row :gutter="0">
      <el-button type="primary" @click="dialogFormVisible = true">借书</el-button>
      <el-button type="primary" @click="bookingFormVisible = true">预定</el-button>
    </el-row>
    <BorrowBook :dialogFormVisible=dialogFormVisible @close="close"></BorrowBook>
    <Booking :bookingFormVisible=bookingFormVisible @close="close"></Booking>
    <el-input
      v-model="msg"
      placeholder="Please input"
      class="input-with-select"
    >
      <template #prepend>
        <el-select v-model="select" placeholder="Select" style="width: 115px">
          <el-option label="BookName" value="1" />
          <el-option label="Order No." value="2" />
          <el-option label="Writer" value="3" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" @click="search"/>
      </template>
    </el-input>
  </div>
  <div>
    <el-table :data="books" style="width: 100%">
      <el-table-column fixed prop="book_id" label="book_id" width="100" sortable/>
      <el-table-column prop="type_id" label="type_id" width="120" />
      <el-table-column prop="book_name" label="book_name" width="120" />
      <el-table-column prop="writer" label="writer" width="120" />
      <el-table-column prop="publication" label="publication" width="120" />
      <el-table-column prop="publication_date" label="publication_date" width="200" />
      <el-table-column prop="language" label="language" width="120" />
      <el-table-column prop="single_book_state" label="languasingle_book_statege" width="120" />
      <el-table-column prop="total" label="total" width="120" />
      <el-table-column prop="shelf_code" label="shelf_code" width="120" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default>
          <el-button link type="primary" size="small" @click=""
            >Detail</el-button
          >
          <el-button link type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>

  import Axios from "axios"
  import { ref, onMounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import BorrowBook from '@/components/user/BorrowBook.vue'
  import { useCookies } from "vue3-cookies"
  import Booking from "./Booking.vue"

  const msg = ref("")
  const select = ref('BookName')
  let books = ref([])
  const dialogFormVisible = ref(false)
  const bookingFormVisible = ref(false)
  const filterTableData = ref([])

  const { cookies } = useCookies();

  function close() {
    dialogFormVisible.value=false
    bookingFormVisible.value=false
    getFilterTableData()
  }

  onMounted(() => {
    getFilterTableData()
  })

  function getFilterTableData(){
    Axios.get('http://localhost:8080/book/all',
        {
            headers: {
            'content-type': 'application/json',
            "token": cookies.get('token')  //token换成从缓存获取
            }
        }
      )
      .then(function (response) {
          books.value=response.data.data
          filterTableData.value=response.data.data
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  //可以优化为前端处理
  const search = () => {
    //判断search的值不为空
    if (msg.value !== '') {
      if(select.value=='1'){
        filterTableData.value = books.value.filter(item => item.book_name.indexOf(msg.value) !== -1)
      }
      else if(select.value=='2'){
        filterTableData.value = books.value.filter(item => item.book_id.indexOf(msg.value) !== -1)
      }
      else if(select.value=='3'){
        filterTableData.value = books.value.filter(item => item.writer.indexOf(msg.value) !== -1)
      }
    }
    // if(select.value=='BookName'){
    //   Axios.get('http://localhost:8080/book/name', {params:{book_name: msg.value}})
    //       .then(function (response) {
    //           books.value=response.data.data
    //       })
    //       .catch(function (error) {
    //           console.log(error);
    //       });
    // }
  }

</script>

<style>
  .input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
  }

  .el-row {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
</style>