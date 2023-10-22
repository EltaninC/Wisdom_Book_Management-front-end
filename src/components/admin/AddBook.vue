<template>
    <el-dialog 
        :modelValue="addFormVisible" 
        title="新增书刊"
        width="30%"
        center
        :before-close="close"
    >
        <el-form
        ref="ruleFormRef"
        :model="bookForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
        >
        <el-form-item label="书本编号" prop="book_id">
            <el-input v-model="bookForm.book_id" />
        </el-form-item>
        <el-form-item label="书本类型" prop="type_id">
            <el-cascader v-model="typeValue" :options="types" />
        </el-form-item>
        <el-form-item label="书本名称" prop="book_name">
            <el-input v-model="bookForm.book_name" />
        </el-form-item>
        <el-form-item label="作者" prop="writer">
            <el-input v-model="bookForm.writer" />
        </el-form-item>
        <el-form-item label="出版社" prop="publication">
            <el-input v-model="bookForm.publication" />
        </el-form-item>
        <el-form-item label="出版日期" required>
            <el-form-item prop="publication_date">
                <el-date-picker
                v-model="bookForm.publication_date"
                type="date"
                label="Pick a date"
                placeholder="Pick a date"
                style="width: 100%"
                value-format="YYYY-MM-DD" 
                />
            </el-form-item>
        </el-form-item>
        <el-form-item label="语言" prop="language">
            <el-input v-model="bookForm.language" />
        </el-form-item>
        <el-form-item label="单册状态" prop="single_book_state">
            <el-radio-group v-model="bookForm.single_book_state">
            <el-radio label="普通外接" value="普通外接"/>
            <el-radio label="仅供阅览" value="仅供阅览"/>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="总数" prop="total">
            <el-input v-model="bookForm.total" />
        </el-form-item>
        <el-form-item label="书架位置" prop="shelf_code">
            <el-input v-model="bookForm.shelf_code" />
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="submitForm">
            Confirm
        </el-button>
            <el-button @click="resetForm(bookFormRef)">Reset</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
  </template>

<script lang="ts" setup>
    import { reactive, ref, onMounted } from 'vue'
    import type { FormInstance, FormRules } from 'element-plus'
    import Axios from "axios"
    import { useCookies } from "vue3-cookies"
    import Message from '../message/Message'

    const types = ref([])
    const typeValue = ref([])
    const { cookies } = useCookies()

    const props = defineProps({
        addFormVisible: {
            type: Boolean,
            default: false,
            required: false
        }
    })

    const emit = defineEmits(['carried'])

    function close() {
        emit('carried','close')
    }

    onMounted(() => {
        Axios.get('http://localhost:8080/type/cascadeType',
                {
                headers: {
                'content-type': 'application/json',
                "token": cookies.get('token')  //token换成从缓存获取
                },
                params:{user_id:cookies.get('user_id')}
                }
            )
            .then(function (response) {
                types.value=response.data
            })
            .catch(function (error) {
                console.log(error);
            });
    })

    interface BookForm {
        book_id: string
        type_id: string
        book_name: string
        writer: string
        publication: string
        publication_date: String
        language: string
        single_book_state: string
        total: string
        shelf_code: string
    }

    const formSize = ref('default')
    const bookFormRef = ref<FormInstance>()
    const bookForm = reactive<BookForm>({
        book_id: "",
        type_id: "",
        book_name: "",
        writer: "",
        publication: "",
        publication_date: '',
        language: "",
        single_book_state: '',
        total: '',
        shelf_code: ''
    })
    
    const rules = reactive<FormRules<BookForm>>({
        // book_name: [
        // { required: true, message: 'Please input Activity name', trigger: 'blur' },
        // { min: 3, max: 15, message: 'Length should be 3 to 5', trigger: 'blur' },
        // ],
        
        // publication_date: [
        // {
        //     type: 'date',
        //     required: true,
        //     message: 'Please pick a date',
        //     trigger: 'change',
        // },
        // ],
        
        // type_id: [
        // {
        //     type: 'array',
        //     required: true,
        //     message: 'Please select at least one activity type',
        //     trigger: 'change',
        // },
        // ],
    
    })

    const submitForm = () => {
        bookForm.type_id=typeValue.value[1]
        Axios.post('http://localhost:8080/book/add',
            JSON.stringify(bookForm),
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
    
    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
</script>
