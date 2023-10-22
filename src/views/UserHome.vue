<template>
  <el-container>
    <el-aside style="width:180px;">
      <el-menu>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>导航一</template>
          <RouterLink to="/user/home"><el-menu-item index="1-1">查询图书</el-menu-item></RouterLink>
          <RouterLink to="/user/home/borrow"><el-menu-item index="1-2">借阅记录</el-menu-item></RouterLink>
          <RouterLink to="/user/home/back"><el-menu-item index="1-3">归还记录</el-menu-item></RouterLink>
          <el-menu-item index="1-4">预约记录</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>导航二</template>
          <el-menu-item index="2-1" @click="dialogFormVisible = true">借书</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-setting"></i>导航三</template>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>图书管理系统</el-header>
      <el-main>
        <RouterView></RouterView>
        <BorrowBook :dialogFormVisible=dialogFormVisible @close="close"></BorrowBook>
      </el-main>
      <el-footer>HQU</el-footer>
    </el-container>
  </el-container>
</template>


<script setup>
    import { RouterLink, RouterView } from 'vue-router'
    import { ref } from 'vue'
    import BorrowBook from '../components/user/BorrowBook.vue'

    const dialogFormVisible = ref(false)

    function close() {
      dialogFormVisible.value=false
    }

</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-menu {
  background-color: #d3dce6;
}
</style>
