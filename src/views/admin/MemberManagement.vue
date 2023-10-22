<template>
    <div class="mt-4">
        <el-row :gutter="0">
        <el-button type="primary" @click="addFormVisible = true">新建</el-button>
        </el-row>
        <AddUser :addFormVisible="addFormVisible" @carried="close"></AddUser>
        <UpdateUser :updateFormVisible="updateFormVisible" :userForm="user" @carried="close"></UpdateUser>
        <el-input
        v-model="search"
        placeholder="Please input"
        class="input-with-select"
        >
        <template #prepend>
            <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option label="UserName" value="1" />
            <el-option label="Order No." value="2" />
            </el-select>
        </template>
        <template #append>
            <el-button :icon="Search" @click="searched"/>
        </template>
        </el-input>
    </div>
    <el-table
        :data=filterTableData
        :default-sort="{ prop: 'date', order: 'descending' }"
        style="width: 100%"
    >
        <el-table-column prop="user_id" label="user_id" sortable width="120" />
        <el-table-column prop="user_name" label="user_name" width="120" />
        <el-table-column prop="password" label="password" width="120" />
        <el-table-column prop="email" label="email" width="120" />
        <el-table-column prop="phone" label="phone" width="120" />
        <el-table-column prop="role_id" label="role_id" width="120" />
        <el-table-column prop="real_name" label="real_name" width="120" />
        <el-table-column prop="borrow_limit" label="borrow_limit" width="120" />
        <el-table-column prop="borrowed_quantity" label="borrowed_quantity" width="120" />
        <el-table-column prop="deposit" label="deposit" width="120" />
        <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" 
          @click="updateFormVisible = true, user=scope.row">更新</el-button>
          
          <el-button link type="primary" size="small" @click="remove(scope.row.user_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
    import Axios from "axios"
    import { ref, onMounted, watch } from 'vue'
    import { useCookies } from "vue3-cookies"
    import { Search } from '@element-plus/icons-vue'
    import AddUser from "../../components/admin/AddUser.vue"
    import UpdateUser from "../../components/admin/UpdateUser.vue"
    import Message from '../../components/message/Message'

    const { cookies } = useCookies()
    let users : any = ref([])
    const addFormVisible = ref(false)
    const updateFormVisible = ref(false)
    const search = ref("")
    const select = ref("1")
    const filterTableData = ref([])
    const user = ref([])

    function close(){
        addFormVisible.value=false
        updateFormVisible.value=false
        getFilterTableData()
    }

    function remove(user_id){
        Axios.delete('http://localhost:8080/account/delete',
                {
                  headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')
                  },
                  params:{user_id: user_id}
                })
          .then(function (response) {
                if(response.data.code==10000){
                    Message({type:"success",text:response.data.msg})
                }
                else{
                    Message({type:"error",text:response.data.msg})
                }
                getFilterTableData()
          })
          .catch(function (error) {
                console.log(error);
          });
    }

    //确认按钮点击事件
    const searched = () => {
        //判断search的值不为空
        if (select.value !== '') {
            if(select.value=='1'){
            filterTableData.value = users.value.filter(item => item.user_name.indexOf(search.value) !== -1)
            }
            else if(select.value=='2'){
            filterTableData.value = users.value.filter(item => item.book_id.indexOf(search.value) !== -1)
            }
        }
    }
 
    //监听输入框的值，当值为空时调用表格原始数据的函数
    watch( search, (newName, oldName) => {
        if (newName == '') {
        filterTableData.value = users.value
        }
    });

    onMounted(() => {
        getFilterTableData()
    })

    //请求后端数据
    function getFilterTableData(){
        Axios.get('http://localhost:8080/account/all',
        {
            headers: {
                'content-type': 'application/json',
                "token": cookies.get('token')
            }
        })
        .then(function(response){
            users.value=response.data.data
            filterTableData.value=response.data.data
        })
        .catch(function(error){
            console.log(error);
        })
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
