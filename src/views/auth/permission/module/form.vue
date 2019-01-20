<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? $t('common.addMenu') : $t('common.editMenu')" width="650px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item :label="$t('table.menuIcon')">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected"/>
          <el-input slot="reference" v-model="form.icon" style="width: 460px;" :placeholder="$t('common.chooseIcon')" readonly>
            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon"
                      style="height: 32px;width: 16px;"/>
            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item :label="$t('table.menuName')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('table.menuName')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="$t('table.menuSort')" prop="sort">
        <el-input v-model.number="form.sort" :placeholder="$t('common.sort')" style="width: 460px;" type="number"/>
      </el-form-item>
      <el-form-item :label="$t('table.iframe')" prop="iframe">
        <el-radio v-model="form.iframe" label="true">{{ $t('tree.yes') }}</el-radio>
        <el-radio v-model="form.iframe" label="false">{{ $t('tree.no') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('table.permission')" prop="permission">
        <el-input v-model="form.permission" :placeholder="$t('table.permission')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="$t('table.url')" prop="url">
        <el-input v-model="form.url" :placeholder="$t('table.url')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="$t('table.parent')" prop="parentId">
        <treeselect v-model="form.parentId" :options="menus" style="width: 460px;" :placeholder="$t('common.chooseParent')"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">{{ $t('table.cancel') }}</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {createMenu, updateMenu} from '@/api/auth/menu'
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from '@/components/IconSelect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {Treeselect, IconSelect},
    props: {
      menus: {
        type: Array,
        required: true
      },
      isAdd: {
        type: Boolean,
        required: true
      },
      sup_this: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        loading: false, dialog: false,
        form: {
          name: '',
          sort: 999,
          url: '',
          permission: '',
          iframe: 'false',
          parentId: 0,
          icon: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          permission: [
            {required: true, message: '请输入权限', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入序号', trigger: 'blur', type: 'number'}
          ],
          iframe: [
            {required: true, message: '请选择菜单类型', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      cancel() {
        this.resetForm()
      },
      doSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            return false
          }
        })
      },
      doAdd() {
        const tempData = Object.assign({}, this.form)
        tempData.createTime = new Date()
        createMenu(tempData).then(res => {
          this.resetForm()
          // 结果处理
          const data=res.data
          if(data.data){
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 1500
            })
            this.$parent.$parent.getList()
          }else{
            this.$notify.error({
              title: '失败',
              message: '添加失败',
              duration: 2000
            });
          }
        })
        this.loading = false
      },
      doEdit() {
        const tempData = Object.assign({}, this.form)
        updateMenu(tempData).then(res => {
          this.resetForm()
          // 结果处理
          const data=res.data
          if(data.data){
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 1500
            })
            this.sup_this.getList()
          }else{
            this.$notify.error({
              title: '失败',
              message: '修改失败',
              duration: 2000
            });
          }
        })
        this.loading = false
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.form = {
          name: '',
          sort: 999,
          url: '',
          permission: '',
          iframe: 'false',
          parentId: 0,
          icon: ''
        }
      },
      selected(name) {
        this.form.icon = name
      }
    }
  }
</script>

<style scoped>

</style>
