import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '@/layouts/admin/index.vue'
import UserLayout from '@/layouts/user/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/user',
      component: UserLayout,
      redirect: 'userHome',
      children: [
        {
          path: "/userHome",
          name: "userHome",
          meta: {
            title: '首页',
            icon: 'House'
          },
          /** 在src/views 文件下创建home文件 */
          component: () => import("@/views/user/UserHome.vue"),
        },
        { path: '/book', name: 'book', component: () => import('@/components/user/UserBook.vue'), 
          meta: {
            title: '书刊查询',
            icon: 'Grid'
          },
        },
        { path: '/borrow', component: () => import('@/components/user/UserBorrow.vue'),
          meta: {
            title: '借阅记录',
            icon: 'TakeawayBox'
          },
        },
        { path: '/back', component: () => import('@/components/user/UserBack.vue'),
          meta: {
            title: '归还记录',
            icon: 'TakeawayBox'
          },
        }
      ],
    },
    {
      component: AdminLayout,
      path: "/admin",
      redirect: 'adminHome',
      children: [{
          path: "/adminHome",
          name: "adminHome",
          meta: {
            title: '首页',
            icon: 'House'
          },
          /** 在src/views 文件下创建home文件 */
          component: () => import("@/views/admin/AdminHome.vue"),
        },
        {
          path: "/bookManagement",
          name: "bookManagement",
          meta: {
            title: '书刊管理',
            icon: 'Grid'
          },
          children: [
            {
              path: "/bookInfoManagement",
              name: 'bookInfoManagement',
              meta: {
                title: '基本信息',
                icon: 'TakeawayBox'
              },
              component: () => import("@/views/admin/BookManagement.vue"),
            },
            {
              path: "/bookTypeManagement",
              name: 'bookTypeManagement',
              meta: {
                title: '类别信息',
                icon: 'TakeawayBox'
              },
              component: () => import("@/views/admin/TypeManagement.vue"),
            }
          ]
        },
        {
          path: "/productManagement",
          name: "productManagement",
          meta: {
            title: '会员管理',
            icon: 'TakeawayBox'
          },
          component: () => import("@/views/admin/MemberManagement.vue"),
        },
        
        {
          path: "/borrowingReturning",
          name: "borrowingReturning",
          meta: {
            title: '借阅管理',
            icon: 'ChatLineSquare'
          },
          /** 在src/views 文件下创建information文件 */
          children: [{
            path: "/borrowManagement",
            name: "borrowManagement",
            meta: {
              title: '借阅',
              icon: 'TakeawayBox'
            },
            /** 在src/views 文件下创建productAdministrator文件 */
            component: () => import("@/views/admin/BorrowManagement.vue"),
          },
          {
            path: "/returnManagement",
            name: "returnManagement",
            meta: {
              title: '归还',
              icon: 'TakeawayBox'
            },
            /** 在src/views 文件下创建productAdministrator文件 */
            component: () => import("@/views/admin/BackManagement.vue"),
          }]
        },
        {
          path: "/contract",
          name: "contract",
          meta: {
            title: '书架管理',
            icon: 'Tickets'
          },
          /** 在src/views 文件下创建information文件 */
          component: () => import("@/views/admin/ShelfManagement.vue"),
        },
        {
          path: "/financialManagement",
          name: "financialManagement",
          meta: {
            title: '财务管理',
            icon: 'Tickets'
          },
          /** 在src/views 文件下创建information文件 */
          component: () => import("@/views/admin/FinancialManagement.vue"),
        },
        {
          path: "/operation",
          name: "operation",
          meta: {
            title: '报表查询',
            icon: 'Pointer'
          },
          /** 在src/views 文件下创建information文件 */
          component: () => import("@/views/admin/ReportQuery.vue"),
        },
        {
          path: "/conLog",
          name: "conLog",
          meta: {
            title: '登录日志',
            icon: 'Document'
          },
          /** 在src/views 文件下创建information文件 */
          component: () => import("@/views/111.vue"),
        },
        {
          path: "/setting",
          name: "setting",
          meta: {
            title: '系统设置',
            icon: 'Setting'
          },
          /** 在src/views 文件下创建information文件 */
          component: () => import("@/views/admin/ShelfManagement.vue"),
        }
      ]
   
    },
  ]
})

export default router
