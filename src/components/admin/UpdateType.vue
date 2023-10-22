<template>
    <el-dialog 
      :modelValue="updateFormVisible" 
      title="类别更新"
      width="30%"
      center
      :before-close="close"
    >
      <el-form :model="form">
        <el-form-item label="parent_id" :label-width="formLabelWidth">
            <el-select v-model="props.type.parent_id" placeholder="Activity zone">
            <el-option label="小说" value="1" />
            <el-option label="教育" value="2" />
            <el-option label="科技" value="3" />
            <el-option label="人文社科" value="4" />
            </el-select>
        </el-form-item>
        <el-form-item label="type_id" :label-width="formLabelWidth">
          <el-input v-model="props.type.type_id" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="type_name" :label-width="formLabelWidth">
          <el-input v-model="props.type.type_name" autocomplete="off"/>
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
        type: {
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
      Axios.put('http://localhost:8080/type/updateSon',
        JSON.stringify(props.type),
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