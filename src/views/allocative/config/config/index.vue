<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.selectProjectId" :placeholder="$t('table.projectName')" @change="changeProject" class="filter-item" style="width: 130px">
        <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>

    <el-row :gutter="40">
      <el-col :span="17">
        <el-container :min-height="600" style="border: 1px solid #eee">
          <el-header style="border-bottom: 1px solid #eee">{{ $t('table.projectInfo') }}</el-header>
          <el-main style="border-bottom: 1px solid #eee">
            <el-form ref="form">
              <el-form-item :label="$t('table.deployEnv')">
                <el-radio-group v-model="listQuery.selectEnvName" @change="handleEnvChange">
                  <el-radio-button :label="item.name" size="mini" v-for="item in envs" ></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('table.deployLabel')">
                <el-radio-group v-model="listQuery.selectLabelName" @change="handleLabelChange">
                  <el-radio-button :label="item.name" size="mini" v-for="item in labels"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-col :span="11" style="padding-left: 0px">
                  <span>{{ $t('table.configDetail') }}</span>
                </el-col>
                <el-col :span="11" style="float:right;text-align: right;">
                  <el-button type="text" @click="fetchConfigFromServer">{{$t('table.fetchConfig')}}</el-button>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :min-height="240">
                  <el-tab-pane :label="$t('table.tableModel')" name="first">
                    <el-table
                      :data="persistent"
                      border
                      style="width: 100%">
                      <el-table-column align="center" label="key" width="180">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.key" placeholder="请输入key..."></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="value" :min-width="180">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.value" placeholder="请输入value..."></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="address" :label="$t('table.actions')">
                        <template slot-scope="scope">
                          <el-button type="primary" round icon="el-icon-view" @click="isLock(scope.item)?unLock(scope.item):lock(scope.item)"/>
                          <el-button type="danger"  round icon="el-icon-delete" @click="handleDelete(scope.$index)"/>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button type="text" @click="addConfig">{{$t('table.addConfig')}}</el-button>
                  </el-tab-pane>
                  <el-tab-pane name="second">
                    <span slot="label"><i class="el-icon-upload"></i> {{$t('table.yamlModel')}}</span>
                    <MonacoEditor
                      :min-height="240"
                      width="100%"
                      v-model="code"
                      :editorOptions="editorOptions"
                      @mounted="onMounted"
                      @codeChange="onCodeChange">
                    </MonacoEditor>
                  </el-tab-pane>
                  <el-tab-pane name="third">
                    <span slot="label"><i class="el-icon-tickets"></i> {{$t('table.iniModel')}}</span>
                    <MonacoEditor
                      width="500"
                      :min-height="240"
                      v-model="code_properties"
                      :editorOptions="editorOptionsProperties"
                      @mounted="onMounted"
                      @codeChange="onCodeChange">
                    </MonacoEditor>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
            </el-form>
          </el-main>
          <el-footer>
            <el-button type="primary" @click="handleSave">{{$t('table.save')}}</el-button>
          </el-footer>
        </el-container>
      </el-col>
      <el-col :span="7">
        <el-row>
          <el-container style="border: 1px solid #eee;line-height: 0">
            <el-header style="border-bottom: 1px solid #eee">
              <el-col :span="11" style="padding-left: 0px">
                <span>{{listQuery.selectEnvName}}{{$t('table.envParam')}}</span>
              </el-col>
              <el-col :span="11" style="float:right;text-align: right;">
                <el-button type="primary" icon="el-icon-check" @click="handleReplaceAll">{{$t('table.replaceAll')}}</el-button>
              </el-col>
            </el-header>
            <el-main>
              <el-table
                :data="envParamsTemList"
                border
                style="width: 100%">
                <el-table-column align="center" label="key" :min-width="80">
                  <template slot-scope="scope">
                    <span>{{scope.row.pKey}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="value" :min-width="80">
                  <template slot-scope="scope">
                    <span>{{scope.row.pValue}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" :label="$t('table.actions')">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="handleReplace(scope.row)">{{$t('table.replace')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-row>
        <el-row>
          <el-container style="border: 1px solid #eee;line-height: 0">
            <el-header style="border-bottom: 1px solid #eee">
              <el-col :span="11" style="padding-left: 0px">
                <span>{{$t('table.encryptionKeyList')}}</span>
              </el-col>
              <el-col :span="11" style="float:right;text-align: right;">
                <el-button type="primary" icon="el-icon-check" @click="handleEncryptionAll">{{$t('table.encryptionAll')}}</el-button>
              </el-col>
            </el-header>
            <el-main>
              <el-table
                :data="encryptKeyList"
                border
                style="width: 100%">
                <el-table-column align="center" :label="$t('table.encryptionKeyList')" :min-width="80">
                  <template slot-scope="scope">
                    <span>{{scope.row.ekey}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>
<script>

  import { findList as findProjectList } from '@/api/allocative/project'
  import { findProperties, saveProperties, encryptProperty, decryptProperty, fetchFromConfigServer } from '@/api/allocative/config'
  import { findList as encryList } from '@/api/allocative/encryption'
  import { findEnvParams } from '@/api/allocative/param'
  import MonacoEditor from 'vue-monaco-editor'
  import * as yaml from 'js-yaml'
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
        envParamsTemList:[],
        encryptKeyList:[],
        configFromConfigServerList:[],
        persistentList:[],
        persistent:[],
        listQuery:{
          selectProject:null,
          selectEnv:null,
          selectLabel:null,
          selectProjectId:undefined,
          selectEnvName:undefined,
          selectLabelName:undefined
        },
        code: '// Type away! \\n',
        code_properties:'// Type away! \\n',
        editorOptions:{
          theme: 'vs-dark',
          language: 'yaml',
          automaticLayout: true
        },
        editorOptionsProperties: {
          theme: 'vs-dark',
          language: 'ini',
          automaticLayout: true
        },
        activeName: 'first',
        configType: 1
      };
    },
    created(){
      this.getProjects()
      this.getEncryList()
    },
    methods: {
      getEncryList(){
        encryList().then(response => {
          this.encryptKeyList=response.data.data
        })
      },
      getEnvParams(){
        findEnvParams(this.listQuery.selectEnv.id).then(response => {
          this.envParamsTemList = response.data.data
        })
      },
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
            this.listQuery.selectEnvName=this.envs[0].name
          }
          if(this.labels!=null&&this.labels.length>0){
            this.listQuery.selectLabel=this.labels[0]
            this.listQuery.selectLabelName=this.labels[0].name
          }
        }
        this.getEnvParams()
        this.handleFilter()
      },
      handleEnvChange(value){
        this.listQuery.selectEnv=this.listQuery.selectProject.envs.filter(item=>{
          return item.name==value
        })[0]
        //加载环境参数
        this.getEnvParams()
        //加载该环境的项目配置信息
        this.handleFilter()
      },
      handleLabelChange(value){
        this.listQuery.selectLabel=this.listQuery.selectProject.labels.filter(item=>{
          return item.name==value
        })[0]
        //加载配置信息
        this.handleFilter()
      },
      handleReplaceAll(){
        //将该环境下和该项目同名的key替换为环境参数
        for (let i = 0; i < this.envParamsTemList.length; i++) {
          for (let j = 0; j < this.persistent.length; j++) {
            if (this.persistent[j].key === this.envParamsTemList[i].pKey) {
              this.persistent[j].value = this.envParamsTemList[i].pValue;
            }
          }
        }

        this.save();
      },
      handleReplace(item){
        console.info(item)
        for (let i = 0; i < this.persistent.length; i++) {
          if (this.persistent[i].key === item.pKey) {
            this.persistent[i].value = item.pValue;
            this.save();
            break;
          }
        }
      },
      handleEncryptionAll(){
        for (let j = 0; j < this.encryptKeyList.length; j++) {
          for (let i = 0; i < this.persistent.length; i++) {
            if (this.encryptKeyList[j].eKey === this.persistent[i].key) {
              if (this.persistent[i].value.indexOf('{cipher}') < 0) {
                this.lock(this.persistent[i]);
                break;
              }
            }
          }
        }
      },
      lock(item) {
        encryptProperty(this.listQuery.selectEnv.id,item.value).then(response=>{
          if(response.data==200) {
            this.$notify({
              title: '成功',
              message: '加密成功',
              type: 'success'
            })
            item.value = '{cipher}' + response.data.data;
          }
        })
      },
      unLock(item){
        decryptProperty(this.listQuery.selectEnv.id,item.value).then(response=>{
          if(response.data==200) {
            this.$notify({
              title: '成功',
              message: '解密成功',
              type: 'success'
            })
            item.value = response.data.data;
          }
        })
      },
      isLock(item) {
        if (item.value.indexOf('{cipher}') >= 0) {
          return true;
        } else {
          return false;
        }
      },
      handleTabClick(){
        switch (this.activeName){
          case 'first':
            this.configType=1
            break;
          case 'second':
            this.configType=2
            break;
          case 'third':
            this.configType=3
            break;
        }
        console.info(this.configType)
        this.handleFilter()
      },
      handleFilter(){
        findProperties(this.listQuery.selectProject.name,this.listQuery.selectEnvName,this.listQuery.selectLabelName).then(response=>{
          this.persistentList=response.data.data
          this.persistent=[]
          let keys = Object.keys(this.persistentList);
          for (let i = 0; i < keys.length; i++) {
            this.persistent.push({
              key: keys[i],
              value: this.persistentList[keys[i]],
            });
          }
          this.code = yaml.safeDump(this.translateToYaml(this.persistentList));
          this.code_properties = '';
          keys.map(item => {
            this.code_properties +=
              item + '=' + this.persistentList[item] + '\n';
          });
        })
      },
      fetchConfigFromServer(){
        fetchFromConfigServer(this.listQuery.selectProject.name,this.listQuery.selectEnvName,this.listQuery.selectLabelName).then(response=>{
          let result=response.data.data
          let tmp = result.filter(item => {
            if (item.name.substring(item.name.lastIndexOf('-') + 1) ===this.listQuery.selectEnv.name &&
              item.name.substring(0, item.name.lastIndexOf('-')) ===this.listQuery.selectProject.name) {
              return true;
            } else {
              return false;
            }
          })[0].source;
          let keys = Object.keys(tmp);
          this.configFromConfigServerList = [];
          keys.map(item => {
            this.configFromConfigServerList.push({
              name: item,
              value: tmp[item],
            });
          });
        })
        // todo 合并本地数据
      },
      addConfig(){
        this.persistent.push({
          key: '',
          value: '',
        });
      },
      handleDelete(index){
        this.$confirm('你确定删除这个配置参数吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: action=>{
            if(action==='confirm'){
              this.persistent.splice(index, 1);
            }
          }
        });
      },
      handleSave(){
        // todo 表单数据校验
        this.save()
      },
      save(){
        let params = {};
        if (this.configType == 1) {
          for (let i = 0; i < this.persistent.length; i++) {
            params[this.persistent[i].key] = this.persistent[i].value;
            if (
              this.persistent[i].key === '' ||
              this.persistent[i].value === ''
            ) {
              this.$notify({
                title: '提示',
                type:'error',
                message: '当前存储配置不能为空，请进行补全!'
              });
              return;
            }
          }
        } else if (this.configType == 2) {
          let tmp = yaml.safeLoad(this.code);
          let result = false;
          while (!result) {
              let tmpResult = this.YamlToJSON(tmp);
            result = tmpResult.bEnd;
            tmp = tmpResult.result;
          }
          params = tmp;
        } else if (this.configType == 3) {
          let result = this.code_properties.split('\n');
          for (let i = 0; i < result.length; i++) {
            let item = result[i].replace(/\s+/g, '');
            if (item.length === 0) {
              continue;
            }
            let tmps = item.split('=');
            if (tmps.length !== 2) {
              this.$notify({
                title: '提示',
                type:'error',
                message: 'properties请都按照对应的键值对配置!'
              });
              return;
            }
            if (tmps[0].indexOf('#') == 0) {
              continue;
            }
            params[tmps[0]] = tmps[1];
          }
        }
        saveProperties(this.listQuery.selectProject.name,this.listQuery.selectEnv.name,this.listQuery.selectLabel.name,params).then(response=>{
          if(response.data.code==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 1500
            })
          }
        })
      },
      /**
       * 由于后端存储是key value的格式，并不是yaml转成json即可，或者json转成yaml，需要把key通过.进行split分割
       * @param json
       */
      translateToYaml(json) {
        let yamlJson = {};
        let keys = Object.keys(json);
        for (let i = 0; i < keys.length; i++) {
          let tmps = keys[i].split('.');
          let result = {};
          for (let j = tmps.length - 1; j >= 0; j--) {
            if (j === tmps.length - 1) {
              if (parseInt(json[keys[i]]) + '' == json[keys[i]]) {
                result[tmps[j]] = parseInt(json[keys[i]]);
              } else if (
                json[keys[i]].indexOf('[') == 0 &&
                json[keys[i]].lastIndexOf(']') ==
                json[keys[i]].length - 1
              ) {
                result[tmps[j]] = JSON.parse(json[keys[i]]);
              } else {
                result[tmps[j]] = json[keys[i]];
              }
            } else {
              let tmp = {};
              tmp[tmps[j]] = result;
              result = tmp;
            }
          }
          let resultTmp = JSON.parse(JSON.stringify(result));
          this.mergeJSON(resultTmp, yamlJson);
        }
        return yamlJson;
      },
      /**
       * 判断是否是JSON对象
       * @param obj
       */
      isJson(obj) {
        var isjson =
          typeof obj == 'object' &&
          Object.prototype.toString.call(obj).toLowerCase() ==
          '[object object]' &&
          !obj.length;
        return isjson;
      },
      /**
       * 从yaml格式的json转成后端需要的json
       * @param ymlJson
       */
      YamlToJSON(ymlJson) {
        let keys = Object.keys(ymlJson);
        let result = {};
        let bEnd = true;
        for (let i = 0; i < keys.length; i++) {
          if (ymlJson[keys[i]] instanceof Array) {
            result[keys[i]] = JSON.stringify(ymlJson[keys[i]]);
          } else if (!this.isJson(ymlJson[keys[i]])) {
            result[keys[i]] = ymlJson[keys[i]];
          } else {
            let tmp_keys = Object.keys(ymlJson[keys[i]]);
            for (let j = 0; j < tmp_keys.length; j++) {
              result[keys[i] + '.' + tmp_keys[j]] =
                ymlJson[keys[i]][tmp_keys[j]];
            }
            bEnd = false;
          }
        }
        return {bEnd, result};
      },
      mergeJSON(minor, main) {
        for (var key in minor) {
          if (main[key] === undefined) {
            // 不冲突的，直接赋值
            main[key] = minor[key];
            continue;
          }
          // 冲突了，如果是Object，看看有么有不冲突的属性
          // 不是Object 则以（minor）为准为主，
          if (this.isJSON(minor[key]) || this.isArray(minor[key])) {
            // arguments.callee 递归调用，并且与函数名解耦
            //arguments.callee(minor[key], main[key]);
            this.mergeJSON(minor[key], main[key]);
          } else {
            main[key] = minor[key];
          }
        }
      },
      isJSON(target) {
        return typeof target == 'object' && target.constructor == Object;
      },
      isArray(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
      },
      onMounted(editor) {
        this.editor = editor;
      },
      onCodeChange(editor) {
        console.log(editor.getValue());
      }
    }
  }
</script>
<style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }

  .el-header, .el-footer {
    color: #333;
    text-align: left;
    line-height: 60px;
  }

  .el-main {
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
