import Layout from '@/views/layout/Layout'

const questionRouter = {
  path: '/questionCenter',
  component: Layout,
  redirect: 'noredirect',
  name: 'questionCenter',
  meta: {
    title: 'questionCenter',
    icon: 'system'
  },
  children: [
    {
      path: 'subject',
      component: () => import('@/views/question/subject/index'),
      name: 'subject',
      meta: { title: 'subject', icon: 'system_user' }
    },
    {
      path: 'point',
      component: () => import('@/views/question/point/index'),
      name: 'point',
      meta: { title: 'point', icon: 'system_user' }
    },
    {
      path: 'type',
      component: () => import('@/views/question/type/index'),
      name: 'type',
      meta: { title: 'type', icon: 'system_user' }
    },
    {
      path: 'tag',
      component: () => import('@/views/question/tag/index'),
      name: 'tag',
      meta: { title: 'tag', icon: 'system_user' }
    },
    {
      path: 'question',
      component: () => import('@/views/question/question/index'),
      name: 'question',
      meta: { title: 'question', icon: 'system_user' }
    }
  ]
}

export default questionRouter
