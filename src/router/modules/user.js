import Layout from '@/views/layout/Layout'

const userRouter = {
  path: '/userCenter',
  component: Layout,
  redirect: 'noredirect',
  name: 'userCenter',
  meta: {
    title: 'userCenter',
    icon: 'system'
  },
  children: [
    {
      path: 'admin',
      component: () => import('@/views/user/admin/index'),
      name: 'admin',
      meta: { title: 'admin', icon: 'system_user' }
    },
    {
      path: 'teacher',
      component: () => import('@/views/user/admin/index'),
      name: 'teacher',
      meta: { title: 'teacher', icon: 'system_user' }
    },
    {
      path: 'student',
      component: () => import('@/views/user/admin/index'),
      name: 'student',
      meta: { title: 'student', icon: 'system_user' }
    }
  ]
}

export default userRouter
