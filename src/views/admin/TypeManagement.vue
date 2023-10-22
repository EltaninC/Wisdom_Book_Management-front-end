<template>
    <el-row :gutter="0">
      <el-button type="primary" @click="addFormVisible = true">新建</el-button>
    </el-row>
    <AddType :addFormVisible=addFormVisible @close="close"></AddType>
    <UpdateType :updateFormVisible=updateFormVisible :type=type @close="close"></UpdateType>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="父类编号" prop="parent_id" />
      <el-table-column label="父类名称" prop="parent_name" />
      <el-table-column label="类别编号" prop="type_id" />
      <el-table-column label="类别名称" prop="type_name" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
          <el-button size="small" @click="searched">搜索</el-button>
        </template>
        <template #default="scope">
          <el-button size="small" @click="updateFormVisible = true, type=scope.row"
            >更新</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.type_id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
</template>
  
<script lang="ts" setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import Axios from "axios"
  import { useCookies } from "vue3-cookies"
  import AddType from '../../components/admin/AddType.vue';
  import UpdateType from '../../components/admin/UpdateType.vue'
  import Message from '../../components/message/Message'
  
  let types:any = ref([])
  const { cookies } = useCookies()
  const addFormVisible = ref(false)
  const updateFormVisible = ref(false)
  const type = ref([])

  function close(){
    addFormVisible.value = false;
    updateFormVisible.value=false;
    getfilterTableData();
  }

  onMounted(() => {
      getfilterTableData()
  })

  //请求后端数据
  function getfilterTableData(){
    Axios.get('http://localhost:8080/type/all',
      {
          headers: {
          'content-type': 'application/json',
          "token": cookies.get('token')  //token换成从缓存获取
          }
      }
    )
    .then(function (response) {
        types.value=response.data.data
        filterTableData.value = response.data.data
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  
  const handleDelete = (type_id: number) => {

    Axios.delete('http://localhost:8080/type/deleteSon',
          {
            headers: {
              'content-type': 'application/json',
              "token": cookies.get('token')
            },
            params:{type_id: type_id}
          })
          .then(function (response) {
            if(response.data.code==10000){
                Message({type:"success",text:response.data.msg})
            }
            else{
                Message({type:"error",text:response.data.msg})
            }
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
        filterTableData.value = types.value.filter(item => item.type_name.indexOf(search.value) !== -1)
      }
  }
 
  //监听输入框的值，当值为空时调用表格原始数据的函数
  watch(search, (newName, oldName) => {
    if (newName == '') {
      filterTableData.value = types.value
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
  