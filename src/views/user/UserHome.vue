<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 首页user信息 -->
            <el-card shadow= 'hover'>
              <div class="userCard">
                <el-avatar :size="150" :src=imgUrl></el-avatar>
                <div class="userInfo">
                  <p class="important-font">User</p>
                  <p class="secondary-font">用户</p>
                </div>
              </div>
              <div class="login-info">
                <p>上次登录时间: 2022/07/06 18:16</p>
              </div>
            </el-card>
            <!-- 首页表格 -->
            <el-card shadow= 'hover' class="tableInfo">
              <div slot="header">
                <span class="important-font">通知信息</span>
              </div>
              <div>
                <el-table
                  :data="tableData"
                  stripe
                  border
                  height="450px"
                  style="width: 100%">
                  <el-table-column
                    prop="time"
                    label="日期"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="msg"
                    label="描述信息"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="money"
                    label="金额">
                  </el-table-column>
                </el-table>
              </div> 
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <!-- 个人信息 -->
          <div class="num">
            <el-card shadow= 'hover' v-for="item in countData" :key="item.name" :body-style="{ display: 'flex',padding: 0 }" class="OrderCard">
              <i class="icon" :class="'el-icon-'+item.icon" :style="{ background: item.color}"></i>
              <div>
                <p class="important-font">{{item.value}}</p>
                <p class="secondary-font">{{item.name}}</p>
              </div>
            </el-card>
          </div>

          <h3>书籍推荐</h3>
          <!-- 推荐书籍 -->
            <el-row>
              
              <el-col
                v-for="(o, index) in recommendedData"
                :key="o"
                :span="8"
                :offset="index > 0 ? 2 : 0"
              >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px">
                    <h4>书籍id:  {{ o.book_id }}</h4>
                    <h4>书籍名称:  {{ o.book_name }}</h4>
                    <h4>作者:  {{ o.writer }}</h4>
                    <h4>语言:  {{ o.language }}</h4>
                    <h4>层架码:  {{ o.shelf_code }}</h4>
                    <div class="bottom">
                      
                      <el-button text class="button">详情</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          <div class= "num graph">
            <el-card style="width: 34%;height: 265px;marginRight: 1%">
              <div style="width: 100%;height: 265px;" id="pieEcharts" ref="pieEcharts">{{ initPieEcharts() }}</div>
            </el-card>
            <el-card style="width:65%;height: 265px"><div style="height: 265px"><el-calendar v-model="value"></el-calendar></div></el-card>
          </div>
        </el-col>
      </el-row>
    </div>
</template>
     
<script setup>
    import * as echarts from 'echarts'
    import { ref, onMounted, reactive } from 'vue'
    import Axios from "axios"
    import { useCookies } from "vue3-cookies"
    import imgUrl from "@/assets/login.jpg"
     
    const currentDate = ref(new Date())
    const { cookies } = useCookies()
    const tableData = ref([])
    const pieData = ref([])
    const recommendedData = ref([])
    const countData = reactive([
            {
              name: '总可借阅数',
              value: 0,
              icon: 'success',
              color: '#2ec7c9'
            },
            {
              name: '已借阅数',
              value: 0,
              icon: 'star-on',
              color: '#ffb980'
            }
          ])

    onMounted (() => {
      //个人信息
      Axios.get('http://localhost:8080/account/byId',
            {
              headers: {
              'content-type': 'application/json',
              "token": cookies.get('token')  //token换成从缓存获取
              },
              params:{user_id:cookies.get('user_id')}
            }
          )
        .then(function (response) {
          countData[0].value=response.data.data.borrowed_quantity
        })
        .catch(function (error) {
          console.log(error);
        }
      );

      Axios.get('http://localhost:8080/borrow/countByID',
            {
              headers: {
              'content-type': 'application/json',
              "token": cookies.get('token')  //token换成从缓存获取
              },
              params:{user_id:cookies.get('user_id')}
            }
          )
        .then(function (response) {
            countData[1].value=response.data
        })
        .catch(function (error) {
              console.log(error);
        }
      );


      //推荐书籍
      Axios.get('http://localhost:8080/statistics/recommendedItem',
          {
            headers: {
            'content-type': 'application/json',
            "token": cookies.get('token')  //token换成从缓存获取
            },
            params:{user_id:cookies.get("user_id")}
          }
        )
        .then(function (response) {
          recommendedData.value=response.data
        })
        .catch(function (error) {
              console.log(error);
      });

      //通知信息
      Axios.get('http://localhost:8080/refund-byId',
          {
            headers: {
            'content-type': 'application/json',
            "token": cookies.get('token')  //token换成从缓存获取
            },
            params:{user_id:cookies.get("user_id")}
          }
        )
        .then(function (response) {
          for(let i = 0; i < response.data.data.length; i++){
            tableData.value.push({
              msg: '退款',
              money: response.data.data[i].money,
              time: response.data.data[i].refund_time
            })
          }
        })
        .catch(function (error) {
              console.log(error);
      });

      Axios.get('http://localhost:8080/recharge/byId',
          {
            headers: {
            'content-type': 'application/json',
            "token": cookies.get('token')  //token换成从缓存获取
            },
            params:{user_id:cookies.get("user_id")}
          }
        )
        .then(function (response) {
          console.log(response)
          for(let i = 0; i < response.data.data.length; i++){
            tableData.value.push({
              msg: '充值',
              money: response.data.data[i].money,
              time: response.data.data[i].recharge_time
            })
          }
        })
        .catch(function (error) {
              console.log(error);
      });

    })

    //饼图
    function initPieEcharts () {
        let p = new Promise((resolve) => {
          resolve()
        })
        //然后异步执行echarts的初始化函数
        p.then(() => {
        let myChart = echarts.init(document.getElementById("pieEcharts"));
        let option= {
            tooltip: {
            trigger: 'item'
            },
            legend: {
            top: '0%',
            left: 'left'
            },
            series: [
            {
                name: '类别借阅数量',
                type: 'pie',
                radius: ['20%', '65%'],
                avoidLabelOverlap: false,
                label: {
                show: false,
                position: 'left'
                },
                labelLine: {
                show: false,
                },
                data: pieData.value
                // [
                // { value: 1048, name: '成交订单量' },
                // { value: 735, name: '退款订单量' },
                // { value: 580, name: '浏览量' },
                // { value: 484, name: '加购量' },
                // { value: 300, name: '预购量' }
                // ]
            }
            ]
        }
        myChart.setOption(option);
        })
    }
</script>
     
<!-- Add "scoped" attribute to limit CSS to this component only -->
 <style lang="less" scoped>
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