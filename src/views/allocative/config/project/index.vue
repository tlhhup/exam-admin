<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.projectName')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column :label="$t('table.projectName')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deployEnv')" min-width="150px" align="center">
        <template slot-scope="scope">
          <el-tag v-for="env in scope.row.envs" :key="env.name" style="margin-left: 4px;">{{env.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deployLabel')" min-width="150px" align="center">
        <template slot-scope="scope">
          <el-tag v-for="label in scope.row.labels" :key="label.name" style="margin-left: 4px;">{{label.name}}</el-tag>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item :label="$t('table.projectName')" prop="name">
          <el-input v-model="temp.name" :placeholder="$t('table.projectName')"/>
        </el-form-item>
        <el-form-item :label="$t('table.deployEnv')" prop="envs">
          <el-checkbox-group v-model="temp.envs">
            <el-checkbox v-for="env in envs" :label="env.id" :key="env.id" border>{{env.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('table.deployLabel')" prop="labelName">
          <el-tag v-for="label in temp.labels" :key="label.name" style="margin-left: 4px;" :closable="label.name!='master'" @close="handleDeleteLabel(label)">{{label.name}}</el-tag>
          <el-col v-show="dialogStatus==='update'">
            <el-form-item v-show="this.bInAdd">
              <el-input :placeholder="$t('table.labelHint')" style="width: 100px;" v-model="temp.label" ref="saveLabelInput"/>
              <el-button type="primary" @click="createLabel">{{ $t('table.confirm') }}</el-button>
            </el-form-item>
            <el-button type="primary" v-show="!this.bInAdd" @click="handleCreateLabel">{{ $t('table.add') }}</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;bInAdd=false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { findAllEnv } from '@/api/allocative/env'
  import { findList, createProject, deleteProject, updateProject, addProjectLabel, deleteProjectLabel, addProjectEnv, deleteProjectEnv } from '@/api/allocative/project'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'

  export default {
    name: 'ComplexTable',
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: null,
        envs:[],
        listLoading: true,
        bInAdd: false,
        listQuery: {
          name: undefined,
          sort: 'id,ASC'
        },
        temp: {
          name: '',
          labels: [],
          envs: [],
          label: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          name: [{ required: true, message: 'Project Name is required', trigger: 'blur' }],
          envs: [{ required: true, message: 'Env is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getEnvs()
      this.getList()
    },
    methods: {
      getEnvs(){
        findAllEnv().then(response => {
          this.envs=response.data.data
        })
      },
      getList() {
        this.listLoading = true
        findList().then(response => {
          this.list=response.data.data

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        if(this.listQuery.name==undefined){
          this.getList()
        }else{
          this.list=this.list.filter(item=>{
            return item.name.indexOf(this.listQuery.name,0)!=-1
          })
          this.listQuery.name=undefined
        }
      },
      resetTemp() {
        this.temp = {
          name: '',
          labels: [
            {
              name: 'master',
            }
          ],
          envs: [],
          label: ''
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
            const tempData = {
              name: this.temp.name,
              labels: this.temp.labels,
              envs: this.temp.envs.map(item=> {
                return {
                  id: item
                }
              })
            }
            createProject(tempData).then(response => {
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
                  message: '创建失败',
                  duration: 2000
                });
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.envs=this.temp.envs.map(item=>{
          return item.id
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = {
              id: this.temp.id,
              name: this.temp.name,
              labels: this.temp.labels,
              envs: this.temp.envs.map(item=> {
                return {
                  id: item
                }
              })
            }
            updateProject(tempData).then((response) => {
              this.dialogFormVisible = false
              const data=response.data
              if(data.code=200){
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 1500
                })
                this.getList()
              }else{
                this.$notify.error({
                  title: '失败',
                  message: '更新失败',
                  duration: 2000
                });
              }
            })
          }
        })
      },
      handleDelete(row) {
        deleteProject(row.id).then(response=>{
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
      },
      handleCreateLabel(){
        this.bInAdd=true
        this.$nextTick(_ => {
          this.$refs.saveLabelInput.$refs.input.focus();
        });
      },
      createLabel(){
        addProjectLabel(this.temp.id, this.temp.label).then(response=>{
          const data=response.data
          if(data.code=200){
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1500
            })
            this.temp.labels.push({
              name: this.temp.label,
              id: data.data.id,
            })
            this.bInAdd=false
            this.temp.label=''
          }else{
            this.$notify.error({
              title: '失败',
              message: '创建失败',
              duration: 2000
            });
          }
        })
      },
      handleDeleteLabel(label) {
        this.temp.labels.splice(this.temp.labels.indexOf(label),1)
        deleteProjectLabel(label.id).then(response => {
          const data = response.data
          if (data.code = 200) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败',
              duration: 2000
            });
          }
        })
      }
    },
  }
</script>
