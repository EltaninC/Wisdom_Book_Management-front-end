<template>
<div class="mt-4">
    
    <el-row :gutter="0">
      <el-button type="primary" @click="addFormVisible = true">待完成</el-button>
    </el-row>

    <el-input
      v-model="msg"
      placeholder="Please input"
      class="input-with-select"
    >
      <template #prepend>
        <el-select v-model="select" placeholder="Select" style="width: 115px">
          <el-option label="Recharge" value="1" />
          <el-option label="Order No." value="2" />
          <el-option label="Writer" value="3" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" @click="searched"/>
      </template>
    </el-input>
  </div>
  <el-row>
    <el-col :span="13">
        <el-card shadow= 'hover' class="tableInfo">
            <div slot="header">
                <span class="important-font">充值记录</span>
            </div>
            <div>
                <el-table
                    :data="rechargeData"
                    stripe
                    border
                    height="450px"
                    style="width: 100%">
                    <el-table-row>充值记录</el-table-row>
                    <el-table-column
                    prop="recharge_id"
                    label="单号"
                    width="90">
                    </el-table-column>
                    <el-table-column
                    prop="recharge_time"
                    label="日期"
                    width="160">
                    </el-table-column>
                    <el-table-column
                    prop="user_id"
                    label="姓名"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="money"
                    label="金额"
                    width="80">
                    </el-table-column>
                    <el-table-column fixed="right" label="Operations" width="120">
                    <template #default="scope">
                    <el-button link type="primary" size="small" 
                    @click="refund(scope.row.recharge_id,scope.row.user_id,scope.row.money)">退款</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div> 
        </el-card>
    </el-col>
    <el-col :span="11">
        <el-card shadow= 'hover' class="tableInfo">
            <div slot="header">
                <span class="important-font">退款记录</span>
            </div>
            <div>
                <el-table
                    :data="refundData"
                    stripe
                    border
                    height="450px"
                    style="width: 100%">
                    <el-table-row>退款记录</el-table-row>
                    <el-table-column
                    prop="refund_id"
                    label="退款编号"
                    width="90">
                    </el-table-column>
                    <el-table-column
                    prop="recharge_id"
                    label="单号"
                    width="90">
                    </el-table-column>
                    <el-table-column
                    prop="refund_time"
                    label="日期"
                    width="160">
                    </el-table-column>
                    <el-table-column
                    prop="user_id"
                    label="姓名"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="money"
                    label="金额"
                    width="80">
                    </el-table-column>
                </el-table>
            </div> 
        </el-card>
    </el-col>
    </el-row>
</template>

<script setup>
    import { ref, onMounted, reactive } from 'vue'
    import Axios from "axios"
    import { useCookies } from "vue3-cookies"
    import Message from "../../components/message/Message"

    const { cookies } = useCookies();
    const msg = ref("")
    const select = ref('1')
    const rechargeData = ref([])
    const refundData = ref([])

    onMounted(() => {
        getFilterTableData()
    })

    function getFilterTableData(){
        //充值信息
        Axios.get('http://localhost:8080/recharge/all',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
                rechargeData.value=response.data.data
          })
          .catch(function (error) {
                console.log(error);
        });

        //退款信息
        Axios.get('http://localhost:8080/refund-all',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
                refundData.value=response.data.data

          })
          .catch(function (error) {
                console.log(error);
        });
    }

    function refund(recharge_id, user_id, money){
        Axios.post('http://localhost:8080/refund',
                JSON.stringify({recharge_id:recharge_id,user_id:user_id,money:money}),
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
            if(response.data.code==10000){
                Message({type:"success",text:response.data.msg})
                getFilterTableData()
            }
            else{
                Message({type:"error",text:response.data.msg})
            }
          })
          .catch(function (error) {
                console.log(error);
        });
    }

</script>

<style>
    .tableInfo{
      margin: 20px 0 0 0;
    }
    .important-font{
        font-weight: 900;
        font-size: 25px;
    }
</style>