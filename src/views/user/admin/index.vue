<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.userName')" v-model="listQuery.userName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{(listQuery.page-1)*listQuery.size+scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.realName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.userName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.national')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.national }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.email')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.tel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" align="center">
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
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="medium" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="medium" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          <el-button type="danger" @click="handleActive(scope.row)">{{ scope.row.active? $t('table.prohibit'): $t('table.active')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 420px; margin-left:50px;">
        <el-form-item :label="$t('table.realName')" prop="realName">
          <el-input v-model="temp.realName"/>
        </el-form-item>
        <el-form-item :label="$t('table.userName')" prop="userName">
          <el-input v-model="temp.userName" :disabled="this.dialogStatus==='update'"/>
        </el-form-item>
        <!-- 编辑不可用 -->
        <template v-if="this.dialogStatus==='create'">
          <el-form-item :label="$t('login.password')" prop="password">
            <el-input type="password" v-model="temp.password"/>
          </el-form-item>
          <el-form-item :label="$t('table.confirmPwd')" prop="confirmPwd">
            <el-input type="password" v-model="temp.confirmPwd"/>
          </el-form-item>
        </template>
        <!-- 编辑不可用 -->
        <el-form-item :label="$t('table.national')" prop="national">
          <el-input v-model="temp.national"/>
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item :label="$t('table.tel')" prop="tel">
          <el-input v-model="temp.tel"/>
        </el-form-item>
        <!-- 编辑不可用 -->
        <template v-if="this.dialogStatus==='create'">
          <el-form-item :label="$t('table.status')">
            <el-radio-group v-model="temp.active">
              <el-radio v-for="item in statusOptions" :label="item.key">{{item.display_name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, createOne, deleteOne, activeOne, updateOne} from '@/api/user/admin'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const statusOptions = [
    { key: true, display_name: '可用' },
    { key: false, display_name: '禁用' }
  ]

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
    },
    data() {
      var validateConfirmPwd = (rule, value, callback) => {
        if (value==undefined||value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.temp.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
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
          sort: 'id,ASC'
        },
        statusOptions,
        temp: {
          realName: '',
          userName: '',
          national: '',
          email: '',
          tel: '',
          active: true,
          pwd: '',
          confirmPwd:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          realName: [{ required: true, message: 'RealName is required', trigger: 'blur' }],
          userName: [{ required: true, message: 'UserName is required', trigger: 'blur' }],
          national: [{ required: true, message: 'National is required', trigger: 'blur' }],
          email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
          tel: [{ required: true, message: 'Tel is required', trigger: 'blur' }],
          password: [
            { required: true, message: 'Password is required', trigger: 'blur' }
          ],
          confirmPwd: [
            { validator: validateConfirmPwd, trigger: 'blur' },
            { required: true, message: 'Confirm Password is required', trigger: 'blur' }
          ]
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
          realName: '',
          userName: '',
          national: '',
          email: '',
          tel: '',
          active: true,
          password: '',
          confirmPwd:''
        }
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
      },
      handleCreate(){
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
            tempData.confirmPwd=undefined
            createOne(tempData).then(response => {
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
      handleUpdate(row){
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
            tempData.confirmPwd=undefined
            updateOne(tempData).then(() => {
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
      handleDelete(row){
        deleteOne(row.id).then(response=>{
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
