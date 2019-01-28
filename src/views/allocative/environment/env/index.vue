<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.envName')" v-model="listQuery.envName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column type="index" :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80"/>
      <el-table-column :label="$t('table.envName')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.registryAddress')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registryAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.configServerName')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configServerName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.contextPath')" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.contextPath}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="medium" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="medium" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="45%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 550px; margin-left:50px;">
        <el-form-item :label="$t('table.envName')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('table.registryAddress')" prop="registryAddress">
          <el-input v-model="temp.registryAddress"/>
        </el-form-item>
        <el-form-item :label="$t('table.configServerName')" prop="configServerName">
          <el-input v-model="temp.configServerName"/>
        </el-form-item>
        <el-form-item :label="$t('table.contextPath')" prop="contextPath">
          <el-input v-model="temp.contextPath"/>
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
  import { findAllEnv, createEnv, deleteEnv, updateEnv, findEnvDetail } from '@/api/allocative/env'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'

  export default {
    name: 'ComplexTable',
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          envName: undefined,
          sort: 'id,ASC'
        },
        temp: {
          name: '',
          registryAddress: '',
          configServerName: '',
          contextPath: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          name: [{ required: true, message: 'Env Name is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        findAllEnv().then(response => {
          this.list=response.data.data

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.getList()
        this.listQuery.envName = undefined
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
          name: '',
          registryAddress: '',
          configServerName: '',
          contextPath: ''
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
            createEnv(tempData).then(response => {
              this.dialogFormVisible = false
              const data=response.data
              if(data.code==200){
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
            updateEnv(tempData).then(() => {
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
        deleteEnv(row.id).then(response=>{
          const data=response.data
          if(data.code=200){
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
