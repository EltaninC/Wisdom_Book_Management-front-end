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
                  <p class="important-font">Admin</p>
                  <p class="secondary-font">管理员</p>
                </div>
              </div>
              <div class="login-info">
                <p>上次登录时间: 2022/07/06 18:16</p>
              </div>
            </el-card>
            <!-- 首页表格 -->
            <el-card shadow= 'hover' class="tableInfo">
              <div slot="header">
                <span class="important-font">充值记录</span>
              </div>
              <div>
                <el-table
                  :data="tableData"
                  stripe
                  border
                  height="450px"
                  style="width: 100%">
                  <el-table-column
                    prop="recharge_time"
                    label="日期"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="user_id"
                    label="姓名"
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
          <!-- 六个订单信息 -->
          <div class="num">
            <el-card shadow= 'hover' v-for="item in countData" :key="item.name" :body-style="{ display: 'flex',padding: 0 }" class="OrderCard">
              <i class="icon" :class="'el-icon-'+item.icon" :style="{ background: item.color}"></i>
              <div>
                <p class="important-font">{{item.value}}</p>
                <p class="secondary-font">{{item.name}}</p>
              </div>
            </el-card>
          </div>
          <!-- 柱状图 -->
          <el-card style="height: 280px">
            <div style="height:280px;" id="barEcharts" ref="barEcharts">{{ initBarEcharts() }}</div>
          </el-card>
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
     
    const { cookies } = useCookies();
    const tableData = ref([])
    const pieData = ref([])
    const barDataX = reactive([])
    const barDataY = reactive([])
    const countData = reactive([
            {
              name: '待归还数',
              value: 0,
              icon: 'success',
              color: '#2ec7c9'
            },
            {
              name: '今日借出',
              value: 0,
              icon: 'star-on',
              color: '#ffb980'
            },
            {
              name: '已完成借还数',
              value: 0,
              icon: 's-goods',
              color: '#5ab1ef'
            },
            {
              name: '今日归还数',
              value: 1200,
              icon: 'success',
              color: '#2ec7c9'
            }
          ])

    onMounted (() => {
        //四个订单信息
        Axios.get('http://localhost:8080/borrow/countAll',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
                countData[0].value=response.data
          })
          .catch(function (error) {
                console.log(error);
          });

        Axios.get('http://localhost:8080/borrow/countByDay',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
                countData[1].value=response.data
          })
          .catch(function (error) {
                console.log(error);
        });

        Axios.get('http://localhost:8080/back/countAll',
            {
                headers: {
                'content-type': 'application/json',
                "token": cookies.get('token')  //token换成从缓存获取
                }
            }
        )
        .then(function (response) {
            countData[2].value=response.data.data
        })
        .catch(function (error) {
            console.log(error);
        });

        Axios.get('http://localhost:8080/back/countByDay',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
                countData[3].value=response.data.data
          })
          .catch(function (error) {
                console.log(error);
        });

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
            console.log(response)
                tableData.value=response.data.data
          })
          .catch(function (error) {
                console.log(error);
        });

        //饼图信息
        Axios.get('http://localhost:8080/statistics/proportion',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
                pieData.value=response.data
                //刷新饼图数据
                initPieEcharts ()
          })
          .catch(function (error) {
                console.log(error);
        });
        //柱状图信息
        Axios.get('http://localhost:8080/statistics/ranking',
                {
                    headers: {
                    'content-type': 'application/json',
                    "token": cookies.get('token')  //token换成从缓存获取
                    }
                }
            )
          .then(function (response) {
            for( let i=0; i<response.data.length ; i++)
                {
                  barDataX.push(response.data[i].name)
                  barDataY.push(response.data[i].value)

                };
                //刷新柱状图数据
                initBarEcharts ()
          })
          .catch(function (error) {
                console.log(error);
        });
    })

    //柱状图
    const initBarEcharts = () => {
    // 新建一个promise对象
        let p = new Promise((resolve) => {
        resolve()
        })
        //然后异步执行echarts的初始化函数
        p.then(() => {
        //	此dom为echarts图标展示dom
        let myChart = echarts.init(document.getElementById('barEcharts'))
        let option = {
            title: {
            text: '借阅排行'
            },
            tooltip: {},
            legend: {
            data: ['总借出数']
            },
            xAxis: {
            data: barDataX
            },
            yAxis: {},
            series: [
            {
                name: '总借出数',
                type: 'bar',
                data: barDataY
            }
            // ,
            // {
            //     name: '昨日销量',
            //     type: 'bar',
            //     data: [10, 18, 34, 8, 12, 21]
            // }
            ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        })
    }
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