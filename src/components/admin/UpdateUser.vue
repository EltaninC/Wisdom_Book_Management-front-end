<template>
    <el-dialog 
        :modelValue="updateFormVisible" 
        title="新增用户"
        width="30%"
        center
        :before-close="close"
    >
        <el-form
        ref="ruleFormRef"
        :model="userForm"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
        >
        <el-form-item label="用户编号" prop="user_id">
            <el-input v-model="userForm.user_id" />
        </el-form-item>
        <el-form-item label="用户名称" prop="user_name">
            <el-input v-model="userForm.user_name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
            <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="权限类型" required>
            <el-select v-model="userForm.role_id" placeholder="Activity zone">
            <el-option label="a" value="1" />
            <el-option label="u" value="2" />
            </el-select>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="userForm.real_name" />
        </el-form-item>
        <el-form-item label="限制天数" prop="borrow_limit">
            <el-input v-model="userForm.borrow_limit"/>
        </el-form-item>
        <el-form-item label="限制数量" prop="borrowed_quantity">
            <el-input v-model="userForm.borrowed_quantity" />
        </el-form-item>
        <el-form-item label="押金" prop="deposit">
            <el-input v-model="userForm.deposit" />
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="submitForm">
            Confirm
        </el-button>
            <el-button @click="resetForm()">Reset</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
  </template>

<script lang="ts" setup>
    import Axios from "axios"
    import { reactive, ref } from "vue"
    import { useCookies } from "vue3-cookies"
    import Message from '../message/Message'

    const { cookies } = useCookies();

    const props = defineProps({
        updateFormVisible: {
            type: Boolean,
            default: false,
            required: false
        },
        userForm: {
            type: Object,
            default: false,
            required: false
        }
    })

    const emit = defineEmits(['carried'])

    const formSize = ref('default')

    function close() {
        emit('carried','close')
    }

    const submitForm = () => {
        Axios.put('http://localhost:8080/account/update',
            JSON.stringify(props.userForm),
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

    const resetForm = () => {

    }
</script>
