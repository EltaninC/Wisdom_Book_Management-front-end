<template>
  
  <div class="mt-4">
    
    <el-row :gutter="0">
      <el-button type="primary" @click="addFormVisible = true">新建</el-button>
    </el-row>

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
        <el-button :icon="Search" @click="searched"/>
      </template>
    </el-input>
  </div>
  <div>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column fixed prop="book_id" label="book_id" width="100" sortable/>
      <el-table-column prop="type_id" label="type_id" width="120" />
      <el-table-column prop="book_name" label="book_name" width="120" />
      <el-table-column prop="writer" label="writer" width="120" />
      <el-table-column prop="publication" label="publication" width="120" />
      <el-table-column prop="publication_date" label="publication_date" width="200"/>
      <el-table-column prop="language" label="language" width="120" />
      <el-table-column prop="single_book_state" label="languasingle_book_statege" width="120" />
      <el-table-column prop="total" label="total" width="120" />
      <el-table-column prop="shelf_code" label="shelf_code" width="120" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" 
          @click="updateFormVisible = true, book=scope.row">更新</el-button>
          

          <el-button link type="primary" size="small" @click="remove(scope.row.book_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <UpdateBook :updateFormVisible=updateFormVisible :book=book @carried="close"></UpdateBook>
  <AddBook :addFormVisible=addFormVisible @carried="close"></AddBook>
</template>
  
<script setup>
  import Axios from "axios"
  import { ref, onMounted, watch } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import UpdateBook from "../../components/admin/UpdateBook.vue"
  import AddBook from "../../components/admin/AddBook.vue"
  import { useCookies } from "vue3-cookies"
  import Message from "../../components/message/Message"

  const msg = ref("")
  const select = ref('1')
  let books = ref([])
  const updateFormVisible = ref(false)
  const addFormVisible = ref(false)
  const book = ref([])
  const { cookies } = useCookies()

  const close = () => {
    updateFormVisible.value=false
    addFormVisible.value=false
    //刷新数据
    getfilterTableData()
  }

  //组件加载后获取数据
  onMounted(() => {
      getfilterTableData()
  })

  //请求后端表单数据
  function getfilterTableData(){
    Axios.get('http://localhost:8080/book/all',
        {
            headers: {
            'content-type': 'application/json',
            "token": cookies.get('token')  //token换成从缓存获取
            }
        }
      )
      .then(function (response) {
          console.log(response)
          books.value=response.data.data
          filterTableData.value=response.data.data
          // 转化时间格式
          // for(let i = 0; i < response.data.length; i++){
          //   books.value[i].publication_date=response.data[i].publication_date[0]+'-'+
          //   response.data[i].publication_date[1]+'-'+response.data[i].publication_date[2];
          // }
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  // 绑定的表格数据
  let filterTableData = ref();
  

  //确认按钮点击事件
  const searched = () => {
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
  }
 
  //监听输入框的值，当值为空时调用表格原始数据的函数
  watch( msg, (newName, oldName) => {
    if (newName == '') {
      filterTableData.value = books.value
    }
  });


  //删除
  const remove = (book_id) => {
    Axios.delete('http://localhost:8080/book/delete',
      {
        headers: {
          'content-type': 'application/json',
          "token": cookies.get('token')
        },
        params:{book_id: book_id}
      }
    )
    .then(function (response) {
      if(response.data.code==10000){
        Message({type:"success",text:response.data.msg})
      }
      else{
        Message({type:"error",text:response.data.msg})
      }
      //刷新数据
      getfilterTableData()
    })
    .catch(function (error) {
      console.log(error);
    });
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