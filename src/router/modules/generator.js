import Layout from '@/views/layout/Layout'

const codeRouter = {
  path: '/codeCenter',
  component: Layout,
  redirect: 'noredirect',
  name: 'toolCenter',
  meta: {
    title: 'toolCenter',
    icon: 'system'
  },
  children: [
    {
      path: 'codeGenerator',
      component: () => import('@/views/tools/code/index'),
      name: 'codeGenerator',
      meta: { title: 'codeGenerator', icon: 'system_user' }
    }
  ]
}

export default codeRouter
