//import BookList from '@/components/BookList'
// import Login from '@/components/Login.v2'
import Login from './views/Login'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Page6 from './views/Page6.vue'
import Form from './views/Form.vue'
// import Register from '@/components/Register'

let routes = [
  {
    path: '/login',
        component: Login,
        name: '',
        hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '导航一',
    iconCls: 'el-icon-message',//图标样式class
    children: [
        // { path: '/main', component: Main, name: '主页', hidden: true },
        // { path: '/table', component: Table, name: 'Table' },
        { path: '/form', component: Form, name: 'Form' },
        // { path: '/user', component: user, name: '列表' },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
        { path: '/page6', component: Page6, name: '导航三' }
    ]
  }, 
  //,
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: Register
  // },
  // {
  //   path: '/',
  //   name: 'BookList',
  //   component: BookList
  // }
];

export default routes;
