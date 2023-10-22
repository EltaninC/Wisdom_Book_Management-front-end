<template>
    <el-dialog 
      :modelValue="updateFormVisible" 
      title="书架更新"
      width="30%"
      center
      :before-close="close"
    >
      <el-form :model="form">
        <el-form-item label="shelf_code" :label-width="formLabelWidth">
          <el-input v-model="props.shelf.shelf_code" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="location" :label-width="formLabelWidth">
          <el-input v-model="props.shelf.location" autocomplete="off"/>
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
        updateFormVisible: {
            type: Boolean,
            default: false,
            required: false
        },
        shelf: {
            type: Object,
            default: false,
            required: false
        }
    })
  
  const emit = defineEmits(['carried'])
   
   function close() {
     emit('close')
   }
  
  const formLabelWidth = '90px'
  const { cookies } = useCookies();
  
  
    function confirm(){
        Axios.put('http://localhost:8080/shelf/update',
            JSON.stringify(props.shelf),
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