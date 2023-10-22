<template>
    <el-dialog 
      :modelValue="addFormVisible" 
      title="新建书架"
      width="30%"
      center
      :before-close="close"
    >
      <el-form :model="form">
        <el-form-item label="shelf_code" :label-width="formLabelWidth">
          <el-input v-model="form.shelf_code" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="location" :label-width="formLabelWidth">
          <el-input v-model="form.location" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click=close>Cancel</el-button>
          <el-button type="primary" @click=confirm>
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { useCookies } from "vue3-cookies"
  import Axios from "axios"
  import Message from '../message/Message'
  
  const props = defineProps({
      addFormVisible: {
            type: Boolean,
            default: false,
            required: false
          }
        }
    )
  
  const emit = defineEmits(['carried'])
   
   function close() {
     emit('close')
   }
  
  const formLabelWidth = '90px'
  const { cookies } = useCookies();
  const form = reactive({
    shelf_code: '',
    location: ''
  })
  
  
    function confirm(){
        Axios.post('http://localhost:8080/shelf/add',
            JSON.stringify(form),
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
                }
                else{
                  Message({type:"error",text:response.data.msg})
                }
                close()
            })
            .catch(function (error) {
                console.log(error);
            });
    }
  
  
  </script>
  
  <style scoped>
  .el-button--text {
    margin-right: 15px;
  }
  .el-select {
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>