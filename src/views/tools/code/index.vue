<template>
  <div class="app-container">

    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="选择操作的数据库">
        <template slot="description">
          <el-select v-model="temp.dbName" placeholder="请选择">
            <el-option
              v-for="item in dbs"
              :key="item.dbName"
              :label="item.dbName"
              :value="item.dbName">
            </el-option>
          </el-select>
        </template>
      </el-step>
      <el-step title="选择需要的数据库"></el-step>
      <el-step title="确认生成代码"></el-step>
    </el-steps>

    <!-- 视图 -->
    <router-view class="view"></router-view>

    <div class="but-group">
      <el-button style="margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>

  </div>
</template>

<script>
  import { fetchDbList, fetchTableList, generate } from '@/api/generator/generate'
  import waves from '@/directive/waves' // Waves directive

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
    },
    data() {
      return {
        active: 0,
        dbs:null,
        tables:null,
        temp: {
          dbName: '',
          tableName: ''
        },
        dialogFormVisible: true
      }
    },
    created() {
      this.getDbList()
    },
    methods:{
      previous(){
        if (this.active-- < 0) this.active = 0;
      },
      next() {
        if (this.active++ > 2) this.active = 0;
      },
      getDbList(){
        fetchDbList().then(response=>{
          const data=response.data.data
          this.dbs=data
        })
      },
      getTableList(){
        fetchTableList(this.temp.dbName).then(response=>{
          const data=response.data.data
          this.tables=data
        })
      }
    }
  }
</script>
