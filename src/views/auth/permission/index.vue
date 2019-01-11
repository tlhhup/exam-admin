<template>
  <div class="app-container">

    <tree-table :data="data" :columns="columns" border/>

  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'

  export default {
    name: '权限列表',
    components: { treeTable },
    data() {
      return {
        columns: [
          {
            text: '权限名称',
            value: 'event',
            width: 200
          },
          {
            text: '权限',
            value: 'id'
          },
          {
            text: '排序',
            value: 'timeLine'
          },
          {
            text: '创建人',
            value: 'comment'
          }
        ],
        data: [
          {
            id: 0,
            event: '事件1',
            timeLine: 50,
            comment: '无'
          },
          {
            id: 1,
            event: '事件1',
            timeLine: 100,
            comment: '无',
            children: [
              {
                id: 2,
                event: '事件2',
                timeLine: 10,
                comment: '无'
              },
              {
                id: 3,
                event: '事件3',
                timeLine: 90,
                comment: '无',
                children: [
                  {
                    id: 4,
                    event: '事件4',
                    timeLine: 5,
                    comment: '无'
                  },
                  {
                    id: 5,
                    event: '事件5',
                    timeLine: 10,
                    comment: '无'
                  },
                  {
                    id: 6,
                    event: '事件6',
                    timeLine: 75,
                    comment: '无',
                    children: [
                      {
                        id: 7,
                        event: '事件7',
                        timeLine: 50,
                        comment: '无',
                        children: [
                          {
                            id: 71,
                            event: '事件71',
                            timeLine: 25,
                            comment: 'xx'
                          },
                          {
                            id: 72,
                            event: '事件72',
                            timeLine: 5,
                            comment: 'xx'
                          },
                          {
                            id: 73,
                            event: '事件73',
                            timeLine: 20,
                            comment: 'xx'
                          }
                        ]
                      },
                      {
                        id: 8,
                        event: '事件8',
                        timeLine: 25,
                        comment: '无'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
</script>
