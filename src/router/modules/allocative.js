import Layout from '@/views/layout/Layout'

const allocativeRouter = {
  path: '/config',
  component: Layout,
  redirect: 'noredirect',
  name: '配置中心',
  meta: {
    title: 'configCenter',
    icon: 'system'
  },
  children: [
    {
      path: 'environment',
      name: 'environment',
      meta: { title: 'environment' },
      redirect: 'noredirect',
      children: [
        {
          path: 'environment',
          component: () => import('@/views/auth/user/index'),
          name: 'environment',
          meta: { title: 'environment', icon: 'env' }
        },
        {
          path: 'environmentParam',
          component: () => import('@/views/auth/role/index'),
          name: 'environmentParam',
          meta: { title: 'environmentParam', icon: 'config' }
        },
        {
          path: 'encryption',
          component: () => import('@/views/auth/permission/index'),
          name: 'encryption',
          meta: { title: 'encryption', icon: 'system_permission' }
        }
      ]
    },
    {
      path: 'configCenter',
      name: 'configCenter',
      meta: { title: 'configCenter' },
      redirect: 'noredirect',
      children: [
        {
          path: 'project',
          component: () => import('@/views/auth/user/index'),
          name: 'project',
          meta: { title: 'project', icon: 'project' }
        },
        {
          path: 'config',
          component: () => import('@/views/auth/role/index'),
          name: 'config',
          meta: { title: 'config', icon: 'param' }
        }
      ]
    }
  ]
}

export default allocativeRouter
