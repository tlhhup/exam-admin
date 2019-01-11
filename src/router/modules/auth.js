import Layout from '@/views/layout/Layout'

const authRouter = {
  path: '/auth',
  component: Layout,
  redirect: 'noredirect',
  name: 'auth',
  meta: {
    title: 'auth',
    icon: 'system'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/auth/user/index'),
      name: 'user',
      meta: { title: 'user', icon: 'system_user' }
    },
    {
      path: 'role',
      component: () => import('@/views/auth/role/index'),
      name: 'role',
      meta: { title: 'role', icon: 'system_role' }
    },
    {
      path: 'permission',
      component: () => import('@/views/auth/permission/index'),
      name: 'permission',
      meta: { title: 'permission', icon: 'system_permission' }
    }
  ]
}

export default authRouter
