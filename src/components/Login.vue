<template>
    <div class="loginbody">
    <div class="logindata">
      <div class="logintext">
        <h2>Welcome</h2>
      </div>
      <div class="formdata">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="user_id"
              clearable
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="password"
              clearable
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="my-2 flex items-center text-sm">
        <el-radio-group v-model="role" class="ml-4">
          <el-radio label="u">学生</el-radio>
          <el-radio label="a">管理员</el-radio>
        </el-radio-group>
      </div>
      <div class="tool">
        <div>
          <el-checkbox v-model="checked" @change="remenber"
            >记住密码</el-checkbox
          >
        </div>
        <div>
          <span class="shou" @click="forgetpas">忘记密码？</span>
        </div>
      </div>
      <div class="butt">
        <el-button type="primary" @click.native.prevent="login"
          >登录</el-button
        >
        <el-button class="shou" @click="register">注册</el-button>
      </div>
    </div>
  </div>
    
</template>

<script setup>

import Axios from "axios"
import { ref } from 'vue'
import qs from 'querystring'
import { useCookies } from "vue3-cookies"
import { useRouter,useRoute } from 'vue-router'
import Message from '@/components/message/Message'

const { cookies } = useCookies();
const user_id = ref("")
const password = ref("")
const router = useRouter()
const route = useRoute()
const role = ref("u")

cookies.set('token', 'v3', '1h')

const login = () => {
    Axios.post('http://localhost:8080/login',
                qs.stringify({user_id:user_id.value,password:password.value,role:role.value})
        )
        .then(function (response) {
          if(response.data.code==10000){
            //cookies 6h 过期
            cookies.set('token',response.data.data,'6h')
            cookies.set('user_id',user_id.value,'6h')
            if(role.value=='u'){
              router.push('/user')
            }
            else if(role.value=='a'){
              router.push('/admin')
            }
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

<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  background-image: url("../assets/login.jpg");
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 200px;
}

.logintext {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}

.logindata {
  width: 400px;
  height: 300px;
  transform: translate(-50%);
  margin-left: 50%;
}

.tool {
  display: flex;
  justify-content: space-between;
  color: #606266;
}

.butt {
  margin-top: 10px;
  text-align: center;
}

.shou {
  cursor: pointer;
  color: #606266;
}

/*ui*/
/* /deep/ .el-form-item__label {
  font-weight: bolder;
  font-size: 15px;
  text-align: left;
}

/deep/ .el-button {
  width: 100%;
  margin-bottom: 10px;

} */
</style>

