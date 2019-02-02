<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.selectProjectId" :placeholder="$t('table.projectName')" @change="changeProject" class="filter-item" style="width: 130px">
        <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.selectEnvId" :placeholder="$t('table.envName')" class="filter-item" style="width: 130px">
        <el-option v-for="item in envs" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.selectLabelId" :placeholder="$t('table.deployLabel')" class="filter-item" style="width: 130px">
        <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
  </div>
</template>
<script>

  import { findList as findProjectList } from '@/api/allocative/project'
  import { findProperties } from '@/api/allocative/config'
  import MonacoEditor from 'vue-monaco-editor'
  import waves from '@/directive/waves' // Waves directive

  export default {
    components: {
      MonacoEditor
    },
    directives: { waves },
    data() {
      return {
        projects:null,
        envs:null,
        labels:null,
        listQuery:{
          selectProject:null,
          selectEnv:null,
          selectLabel:null,
          selectProjectId:undefined,
          selectEnvId:undefined,
          selectLabelId:undefined
        },
        code: '// Type away! \n',
        options: {
          selectOnLineNumbers: false
        }
      };
    },
    created(){
      this.getProjects()
    },
    methods: {
      getProjects(){
        findProjectList().then(response=>{
          this.projects=response.data.data
          this.changeProject()
        })
      },
      changeProject(){
        if(this.projects!=null&&this.projects.length>0){
          let project=null
          if(this.listQuery.selectProjectId===undefined) {
            project = this.projects[0]
          }else{
            project=this.projects.filter(item=>{
              return item.id==this.listQuery.selectProjectId
            })[0]
          }
          this.listQuery.selectProject=project
          this.listQuery.selectProjectId=project.id
          this.envs=project.envs
          this.labels=project.labels
          if(this.envs!=null&&this.envs.length>0){
            this.listQuery.selectEnv=this.envs[0]
            this.listQuery.selectEnvId=this.envs[0].id
          }
          if(this.labels!=null&&this.labels.length>0){
            this.listQuery.selectLabel=this.labels[0]
            this.listQuery.selectLabelId=this.labels[0].id
          }
        }
      },
      handleFilter(){
        findProperties(this.listQuery.selectProject.name,this.listQuery.selectEnv.name,this.listQuery.selectLabel.name).then(response=>{
          console.info(response.data)
        })
      }
    }
  }
</script>
