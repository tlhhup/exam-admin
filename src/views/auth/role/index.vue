<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.roleName')" v-model="listQuery.roleName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.creator')" v-model="listQuery.creator" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{(listQuery.page-1)*listQuery.size+scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.roleName')" width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.description')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.creator')" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.roleValue')" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.roleValue | roleValueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.active')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.active">{{ $t('table.enable') }}</span>
          <span v-else>{{ $t('table.disable') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 420px; margin-left:50px;">
        <el-form-item :label="$t('table.roleName')" prop="roleName">
          <el-input v-model="temp.roleName"/>
        </el-form-item>
        <el-form-item :label="$t('table.roleValue')" prop="roleValue">
          <el-select v-model="temp.roleValue" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.active')">
          <el-select v-model="temp.active" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchRole, createRole, deleteRole, updateRole } from '@/api/auth/role'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const statusOptions = [
  { key: true, display_name: '可用' },
  { key: false, display_name: '禁用' }
]

const roleOptions = [
  { key: -1, display_name: 'admin' },
  { key: 0, display_name: 'normal' }
]

// arr to obj
const roleOptionsKeyValue = roleOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    roleValueFilter(roleValue){
      return roleOptionsKeyValue[roleValue]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        roleName: undefined,
        creator: undefined,
        sort: 'id'
      },
      statusOptions,
      roleOptions,
      temp: {
        roleName: '',
        description: '',
        roleValue: 0,
        active: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        roleName: [{ required: true, message: 'roleName is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // todo 会导致修改pageSize时，第二次才生效
      const tempData = Object.assign({}, this.listQuery)
      tempData.page = tempData.page - 1
      fetchList(tempData).then(response => {
        const data=response.data.data
        this.list = data.items
        this.total = data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.listQuery.creator = undefined
      this.listQuery.roleName = undefined
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'id,ASC'
      } else {
        this.listQuery.sort = 'id,DESC'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        roleName: '',
        description: '',
        roleValue: 0,
        active: true
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.createTime = new Date()
          createRole(tempData).then(response => {
            this.dialogFormVisible = false
            const data=response.data
            if(data.data){
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 1500
              })
              this.getList()
            }else{
              this.$notify.error({
                title: '失败',
                message: '删除失败',
                duration: 2000
              });
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRole(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 1500
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteRole(row.id).then(response=>{
        const data=response.data
        if(data.data){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.getList()
        }else{
          this.$notify.error({
            title: '失败',
            message: '删除失败',
            duration: 2000
          });
        }
      })
    }
  }
}
</script>
