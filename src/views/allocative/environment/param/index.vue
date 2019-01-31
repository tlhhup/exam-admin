<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.envId" :placeholder="$t('table.envName')" @change="getList" class="filter-item" style="width: 130px">
        <el-option v-for="item in env" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input :placeholder="$t('table.paramKey')" v-model="listQuery.pKey" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      style="width: 100%;">
      <el-table-column type="index" :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80"/>
      <el-table-column :label="$t('table.paramKey')" width="400px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pKey }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.paramValue')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pValue }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left:20px;">
        <el-form-item :label="$t('table.paramKey')" prop="pKey">
          <el-input v-model="temp.pKey"/>
        </el-form-item>
        <el-form-item :label="$t('table.paramValue')" prop="pValue">
          <el-input v-model="temp.pValue"/>
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
  import { findAllEnv} from '@/api/allocative/env'
  import { findEnvParams, addEnvParam, deleteEnvParam, updateEnvParam, createBatch, deleteBatch } from '@/api/allocative/param'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'

  export default {
    name: 'ComplexTable',
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        env:[],
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          envId:undefined,
          pKey: undefined
        },
        temp: {
          pKey: '',
          pValue: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          pKey: [{ required: true, message: 'Key is required', trigger: 'blur' }],
          pValue: [{ required: true, message: 'Value is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getEnvList()
      setTimeout(() => {
        //查询完之后查询数据
        this.getList()
      }, 0.5 * 1000)
    },
    methods: {
      getEnvList(){
        findAllEnv().then(response => {
          this.env=response.data.data
          if(this.env!=null&&this.env.length>0){
            this.listQuery.envId=this.env[0].id
          }
        })
      },
      getList() {
        this.listLoading = true
        if(this.listQuery.envId!=undefined) {
          findEnvParams(this.listQuery.envId).then(response => {
            this.list = response.data.data
          })
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      },
      handleFilter() {
        if(this.listQuery.pKey==undefined){
          this.getList()
        }else{
          this.list=this.list.filter(item=>{
            return item.pKey.indexOf(this.listQuery.pKey,0)!=-1
          })
          this.listQuery.pKey=undefined
        }
      },
      resetTemp() {
        this.temp = {
          pKey: '',
          pValue: ''
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
            addEnvParam(this.listQuery.envId,tempData).then(response => {
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
            updateEnvParam(tempData).then(() => {
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
        deleteEnvParam(row.id).then(response=>{
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
