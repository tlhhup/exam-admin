<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.userName')" v-model="listQuery.userName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.userType" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
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
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{(listQuery.page-1)*listQuery.size+scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.userName')" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.userType')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.userType | userTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.active">{{ $t('table.enable') }}</span>
          <span v-else>{{ $t('table.disable') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="450" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleModifyPwd(scope.row)">{{ $t('table.modifyPwd') }}</el-button>
          <el-button type="danger" @click="handleResetPwd(scope.row)">{{ $t('table.resetPwd') }}</el-button>
          <el-button type="danger" @click="handleActive(scope.row)">{{ scope.row.active? $t('table.prohibit'): $t('table.active')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="$t('table.modifyPwd')" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="160px" style="width: 420px; margin-left:50px;">
        <el-form-item :label="$t('table.userName')" prop="userName">
          <el-input :disabled="true" v-model="temp.userName"/>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input v-model="temp.pwd"/>
        </el-form-item>
        <el-form-item :label="$t('table.newPwd')" prop="newPwd">
          <el-input v-model="temp.newPwd"/>
        </el-form-item>
        <el-form-item :label="$t('table.confirmPwd')" prop="confirmPwd">
          <el-input v-model="temp.confirmPwd"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updatePwd()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, updatePassword, resetPassword, activeOne} from '@/api/auth/user'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const statusOptions = [
    { key: true, display_name: '可用' },
    { key: false, display_name: '禁用' }
  ]

  const userTypeOptions = [
    { key: 1, display_name: '管理员' },
    { key: 2, display_name: '教师' },
    { key: 3, display_name: '学生' }
  ]

  // arr to obj
  const userTypeOptionsKeyValue = userTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      userTypeFilter(userType){
        return userTypeOptionsKeyValue[userType]
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
          size: 10,
          userName: undefined,
          userType: undefined,
          sort: 'id'
        },
        statusOptions,
        userTypeOptions,
        temp: {
          userName: '',
          pwd: '',
          newPwd:'',
          confirmPwd:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          password: [{ required: true, message: 'Old Password is required', trigger: 'blur' }],
          newPwd: [{ required: true, message: 'New Password is required', trigger: 'blur' }],
          confirmPwd: [{ required: true, message: 'Confirm Password is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
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
        this.listQuery.userName = undefined
        this.listQuery.userType = undefined
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
      handleModifyPwd(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updatePwd() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            //todo 校验两次输入密码
            updatePassword(tempData).then(response => {
              this.dialogFormVisible = false
              const data=response.data
              if(data.data){
                this.$notify({
                  title: '成功',
                  message: '修改密码成功',
                  type: 'success',
                  duration: 1500
                })
              }else{
                this.$notify.error({
                  title: '失败',
                  message: '修改密码失败',
                  duration: 2000
                });
              }
            })
          }
        })
      },
      handleResetPwd(row) {
        resetPassword(row.id).then(response=>{
          const data=response.data
          if(data.data){
            this.$notify({
              title: '成功',
              message: '重置密码成功',
              type: 'success',
              duration: 1500
            })
            this.getList()
          }else{
            this.$notify.error({
              title: '失败',
              message: '重置密码失败',
              duration: 2000
            });
          }
        })
      },
      handleActive(row) {
        const tempData={
          id:row.id,
          active:!row.active
        }
        activeOne(tempData).then(response=>{
          const data=response.data
          if(data.data){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getList()
          }else{
            this.$notify.error({
              title: '失败',
              message: '操作失败',
              duration: 2000
            });
          }
        })
      }
    }
  }
</script>
