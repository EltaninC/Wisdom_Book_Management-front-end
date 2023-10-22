<template>
  <div class="mt-4">
    <el-row>
      <!-- 2个订单信息 -->
      <div class="num" >
            <el-card shadow= 'hover' v-for="item in countData" :key="item.name" :body-style="{ display: 'flex',padding: 0 }" class="OrderCard">
              <i class="icon" :class="'el-icon-'+item.icon" :style="{ background: item.color}"></i>
              <div>
                <p class="important-font">{{item.value}}</p>
                <p class="secondary-font">{{item.name}}</p>
              </div>
            </el-card>
          </div>
    </el-row>
    <el-row >
      <el-table 
        :data="borrows"
        style="width: 99%"
        :row-class-name="tableRowClassName"
        height="550"
      >
        <el-table-column prop="borrow_id" label="borrow_id" width="170" />
          <!-- <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.borrow_id }}</span>
            </div>
          </template> -->
          <el-table-column prop="user_id" label="user_id" width="170" />
          <el-table-column prop="book_code" label="book_code" width="250" />
          <el-table-column prop="borrow_date" label="borrow_date"  />
          <el-table-column prop="expect_return_date" label="expect_return_date"  />
      </el-table>
    </el-row>
  </div>
</template>

<script setup lang="ts"> 

import Axios from "axios"
import { ref, onMounted, reactive } from 'vue'
import { useCookies } from "vue3-cookies"
import Message from '../../components/message/Message'

const { cookies } = useCookies();
const borrows = ref([])
const dialogFormVisible = ref(false)

function close() {
      dialogFormVisible.value=false
}

const over = ref(0)
const countData = reactive([
  {
    name: '待归还数',
    value: 0,
    icon: 'success',
    color: '#2ec7c9'
  },
  {
    name: '逾期未还',
    value: over,
    icon: 'star-on',
    color: '#ffb980'
  }
])

const tableRowClassName = ({
  row
}: {
  row: any
}) => {
  var expect_return_date = new Date(row.expect_return_date).getTime()
  if (expect_return_date < new Date().getTime()) {
    return 'warning-row'
  } else if (expect_return_date >= new Date().getTime()) {
    return ''
  }
  return ''
}

onMounted(() => {
    Axios.get('http://localhost:8080/borrow/all',
      {
        headers: {
          'content-type': 'application/json',
          "token": cookies.get('token')  //token换成从缓存获取
        }
      })
      .then(function (response) {
        //提示信息
        if(response.data.code!=10000){
          Message({type:"error", text:response.data.msg})
        }
        borrows.value=response.data.data

        //得到总借阅数
        countData[0].value =  borrows.value.length
        //得到逾期未归还数
        for(let i = 0; i < borrows.value.length; i++){
            var expect_return_date = new Date(response.data.data[i].expect_return_date).getTime()
            if (expect_return_date < new Date().getTime()) {
              over.value = over.value+1
            } 
        }
      })
      .catch(function (error) {
          console.log(error);
      });

      // Axios.get('http://localhost:8080/borrow/countAll',
      //       {
      //           headers: {
      //           'content-type': 'application/json',
      //           "token": cookies.get('token')  //token换成从缓存获取
      //           }
      //       }
      //   )
      // .then(function (response) {
      //       countData[0].value=response.data
      // })
      // .catch(function (error) {
      //       console.log(error);
      // });
})

</script>

<style lang="less">


.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-card__body {
  padding: 10px;
}
.userCard{
  height: 180px;
  display: flex;
  border-bottom: 2px solid #DCDFE6;
  border-radius: 2px;
}
.userInfo{
  width: auto;
  padding: 6% 0 0 6%;
}
.important-font{
    font-weight: 900;
    font-size: 25px;
}
.secondary-font{
  color: #909399;
}
.login-info{
  height: 40px;
  text-align: left;
  color: #909399;
}
.tableInfo{
  margin: 20px 0 0 0;
}
.OrderCard{
    margin: 0 0 30px 30px;
    border: #DCDFE6 1px solid;
    border-radius: 10px;
    i{
      width: 30%;
      line-height: 120px;
      font-size: 30px;
      color:#fff
    }
    div{
      width: 300px;
    }
}
.el-card{
  border: none;
}
.num{
  display: flex;
  flex-wrap: wrap;
}
.graph{
  margin: 15px 0 0 0;
}
.el-calendar{
  height: 265px ;
}
</style>