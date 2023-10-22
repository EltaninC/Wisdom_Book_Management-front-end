import {
	createRouter,
	createWebHistory,
} from "vue-router";
import Layout from '@/layout/index.vue'
const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		name: 'login',
		path: '/login',
		component: () => import('@/views/login/index.vue')
	},
	{
		component: Layout,
		path: "/",
		children: [{
				path: "/home",
				name: "home",
				meta: {
					title: '首页',
					icon: 'House'
				},
				/** 在src/views 文件下创建home文件 */
				component: () => import("@/views/home/index.vue"),
			},
			{
				path: "/system",
				name: "system",
				meta: {
					title: '系统概况',
					icon: 'Grid'
				},
				/** 在src/views 文件下创建system文件 */
				component: () => import("@/views/system/index.vue"),
			},
			{
				path: "/userManagement",
				name: "userManagement",
				meta: {
					title: '用户管理',
					icon: 'Avatar'
				},
				/** 在src/views 文件下创建userManagement文件 */
				// component: () => import("@/views/userManagement/index.vue"),
				children: [{
						path: "/productAdministrator",
						name: "productAdministrator",
						meta: {
							title: '产品1',
							icon: 'TakeawayBox'
						},
						/** 在src/views 文件下创建productAdministrator文件 */
						component: () => import("@/views/userManagement/productAdministrator/index.vue"),
					},
					{
						path: "/prod",
						name: "productAdministrator",
						meta: {
							title: '产品2',
							icon: 'TakeawayBox'
						},
						/** 在src/views 文件下创建productAdministrator文件 */
						component: () => import("@/views/userManagement/productAdministrator/index.vue"),
					}
				]
			},
			{
				path: "/productManagement",
				name: "productManagement",
				meta: {
					title: '产品管理',
					icon: 'TakeawayBox'
				},
				/** 在src/views 文件下创建productManagement文件 */
				component: () => import("@/views/productManagement/index.vue"),
			},
			{
				path: "/information",
				name: "information",
				meta: {
					title: '消息管理',
					icon: 'ChatLineSquare'
				},
				/** 在src/views 文件下创建information文件 */
				component: () => import("@/views/information/index.vue"),
			},
			{
				path: "/contract",
				name: "contract",
				meta: {
					title: '合同管理',
					icon: 'Tickets'
				},
				/** 在src/views 文件下创建information文件 */
				component: () => import("@/views/contract/index.vue"),
			},
			{
				path: "/operation",
				name: "operation",
				meta: {
					title: '操作日志',
					icon: 'Pointer'
				},
				/** 在src/views 文件下创建information文件 */
				component: () => import("@/views/operation/index.vue"),
			},
			{
				path: "/conLog",
				name: "conLog",
				meta: {
					title: '登录日志',
					icon: 'Document'
				},
				/** 在src/views 文件下创建information文件 */
				component: () => import("@/views/conLog/index.vue"),
			},
			{
				path: "/setting",
				name: "setting",
				meta: {
					title: '系统设置',
					icon: 'Setting'
				},
				/** 在src/views 文件下创建information文件 */
				component: () => import("@/views/setting/index.vue"),
			}
		]
 
	},
];
 
const router = createRouter({
	history: createWebHistory(),
	routes,
});
 
export default router;