<template>
  <div class="app-container">

    <eHeader :menus="menus" :query="listQuery"/>

    <tree-table :treeLoading="treeLoading" :data="list" :columns="columns" border>
      <el-table-column prop="icon" :label="$t('tree.icon')" align="center" width="80px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" :label="$t('tree.sort')">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="url" :label="$t('tree.url')"/>
      <el-table-column :show-overflow-tooltip="true" prop="permission" :label="$t('tree.permission')"/>
      <el-table-column prop="iframe" width="100px" :label="$t('tree.iframe')">
        <template slot-scope="scope">
          <span v-if="scope.row.iframe">{{ $t('tree.yes') }}</span>
          <span v-else>{{ $t('tree.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="230" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <edit :menus="menus" :data="scope.row" :sup_this="sup_this"/>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </tree-table>

  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import eHeader from './module/header'
  import edit from './module/edit'
  import {parseTime} from '@/utils'
  import {fetchList, fetchMenu, createMenu, deleteMenu, updateMenu} from '@/api/auth/menu'

  export default {
    name: '权限列表',
    components: {treeTable, eHeader, edit},
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.treeLoading=true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.data
          //选择菜单
          const menu = { id: 0, label: '顶级类目', children: [] }
          menu.children = this.list
          this.menus=[]
          this.menus.push(menu)

          setTimeout(() => {
            this.treeLoading = false
          }, 1.5 * 1000)
        })
      },
      handleDelete(row) {
        // todo 删除
        this.$message.info('删除')
      }
    },
    data() {
      return {
        columns: [
          {
            text: '权限名称',
            value: 'name',
            width: 200
          }
        ],
        menus:[],
        list: [],
        treeLoading: true,
        sup_this:this,
        listQuery:{
          name:undefined
        }
      }
    }
  }
</script>
