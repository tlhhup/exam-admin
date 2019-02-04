import Layout from '@/views/layout/Layout'

const allocativeRouter = {
  path: '/config',
  component: Layout,
  redirect: '/config/environment/env',
  name: '配置中心',
  meta: {
    title: 'configCenter',
    icon: 'system'
  },
  children: [
    {
      path: 'environment',
      component: () => import('@/views/allocative/environment/index'),
      name: 'environment',
      meta: { title: 'environment' },
      redirect: '/config/environment/env',
      children: [
        {
          path: 'env',
          component: () => import('@/views/allocative/environment/env'),
          name: 'environment',
          meta: { title: 'environment', icon: 'env' }
        },
        {
          path: 'environmentParam',
          component: () => import('@/views/allocative/environment/param'),
          name: 'environmentParam',
          meta: { title: 'environmentParam', icon: 'config' }
        },
        {
          path: 'encryption',
          component: () => import('@/views/allocative/environment/encryption'),
          name: 'encryption',
          meta: { title: 'encryption', icon: 'system_permission' }
        }
      ]
    },
    {
      path: 'configCenter',
      component: () => import('@/views/allocative/config/index'),
      name: 'configCenter',
      meta: { title: 'configCenter' },
      redirect: '/config/configCenter/project',
      children: [
        {
          path: 'project',
          component: () => import('@/views/allocative/config/project'),
          name: 'project',
          meta: { title: 'project', icon: 'project' }
        },
        {
          path: 'configParam',
          component: () => import('@/views/allocative/config/config'),
          name: 'config',
          meta: { title: 'config', icon: 'param' }
        }
      ]
    }
  ]
}

export default allocativeRouter
