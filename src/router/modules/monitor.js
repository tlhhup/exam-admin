import Layout from '@/views/layout/Layout'

const monitorRouter = {
  path: 'monitor',
  component: Layout,
  name: 'monitor',
  meta: {
    title: 'monitor',
    icon: 'monitor'
  },
  children: [
    {
      path: 'http://localhost:10011',
      name: 'registerCenter',
      meta: { title: 'registerCenter', icon: 'eureka' }
    },
    {
      path: 'http://localhost:10015/#/applications',
      name: 'monitorApp',
      meta: { title: 'monitorApp', icon: 'monitor_app' }
    },
    {
      path: 'http://localhost:10015/#/wallboard',
      name: 'monitorTrace',
      meta: { title: 'monitorTrace', icon: 'monitor_trace' }
    }
  ]
}

export default monitorRouter
