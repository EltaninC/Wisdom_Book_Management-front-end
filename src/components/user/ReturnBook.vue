<template>
  <el-dialog 
    :modelValue="dialogFormVisible" 
    title="Return Book"
    width="30%"
    center
    :before-close="close"
  >
    <el-form :model="form">
      <el-form-item label="book_code" :label-width="formLabelWidth">
        <el-input v-model="form.book_code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="borrow_id" :label-width="formLabelWidth">
        <el-input :modelValue="borrow_id" autocomplete="off" readonly="true"/>
      </el-form-item>
      <el-form-item label="user_id" :label-width="formLabelWidth">
        <el-input v-model="form.user_id" autocomplete="off" readonly="true"/>
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
    dialogFormVisible: {
	      type: Boolean,
	      default: false,
	      required: false
	    },
    borrow_id:{
        type: String,
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
  book_code: '',
  user_id: cookies.get('user_id'),
})


function confirm(){
  Axios.get('http://localhost:8080/borrow/delete',{
        headers: {
           'content-type': 'application/json',
           "token": cookies.get('token')  //token换成从缓存获取
        },
        params:{borrow_id: props.borrow_id}
      })
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