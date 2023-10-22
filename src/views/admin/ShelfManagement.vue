<template>
    <el-row :gutter="0">
      <el-button type="primary" @click="addFormVisible = true">新建</el-button>
    </el-row>
    <AddShelf :addFormVisible=addFormVisible @close="close"></AddShelf>
    <UpdateShelf :updateFormVisible=updateFormVisible :shelf=shelf @close="close"></UpdateShelf>
    <el-table :data="filterTableData" style="width: 100%" max-height="500">
      <el-table-column label="层架码" prop="shelf_code" />
      <el-table-column label="位置信息" prop="location" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
          <el-button size="small" @click="searched">搜索</el-button>
        </template>
        <template #default="scope">
          <el-button size="small" @click="updateFormVisible = true, shelf=scope.row"
            >更新</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.shelf_code)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
</template>
  
<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import Axios from "axios"
  import { useCookies } from "vue3-cookies"
  import AddShelf from '../../components/admin/AddShelf.vue'
  import UpdateShelf from '../../components/admin/UpdateShelf.vue'
  import Message from "../../components/message/Message"
  
  let shelfs:any = ref([])
  const { cookies } = useCookies()
  const addFormVisible = ref(false)
  const updateFormVisible = ref(false)
  const shelf = ref([])

  function close(){
    addFormVisible.value = false
    updateFormVisible.value=false
    //刷新数据
    getfilterTableData()
  }

  onMounted(() => {
    getfilterTableData()
  })

  //请求后端数据
  function getfilterTableData(){
    Axios.get('http://localhost:8080/shelf/all',
      {
          headers: {
          'content-type': 'application/json',
          "token": cookies.get('token')  //token换成从缓存获取
          }
      })
    .then(function (response) {
        shelfs.value=response.data.data
        filterTableData.value = response.data.data
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  
  const handleDelete = (shelf_code: number) => {

    Axios.delete('http://localhost:8080/shelf/delete',
          {
            headers: {
              'content-type': 'application/json',
              "token": cookies.get('token')
            },
            params:{shelf_code: shelf_code}
          })
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
  
  const search = ref('')
  // 绑定的表格数据
  let filterTableData = ref();
  

  //确认按钮点击事件
  const searched = () => {
      //判断search的值不为空
      if (search.value !== '') {
        filterTableData.value = shelfs.value.filter(item => item.shelf_code.indexOf(search.value) !== -1)
      }
  }
 
  //监听输入框的值，当值为空时调用表格原始数据的函数
  watch(search, (newName, oldName) => {
    if (newName == '') {
      filterTableData.value = shelfs.value
    }
  });
</script>

<style>
    .el-row {
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
    }
</style>
  