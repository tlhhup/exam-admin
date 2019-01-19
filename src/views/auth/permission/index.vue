<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('table.menuName')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <tree-table :data="list" :columns="columns" border>
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
      <el-table-column :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </tree-table>

  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime} from '@/utils'
  import {fetchList, fetchMenu, createMenu, deleteMenu, updateMenu} from '@/api/auth/menu'

  export default {
    name: '权限列表',
    components: {treeTable},
    directives: { waves },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        fetchList().then(response => {
          this.list = response.data.data
        })
      },
      handleFilter(){
        this.$message.info("搜索")
      },
      handleCreate(){
        this.$message.info("新增")
      },
      handleDelete(row) {
        this.$message.info('删除')
      },
      handleUpdate(row) {
        this.$message.info('编辑')
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
        list: [],
        listQuery:{
          name:undefined
        }
      }
    }
  }
</script>
