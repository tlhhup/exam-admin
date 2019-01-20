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
        <el-input v-model.number="form.sort" :placeholder="$t('common.sort')" style="width: 460px;"/>
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
      <el-form-item :label="$t('table.parent')">
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
        createMenu(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          setTimeout(() => {
            this.$parent.getList()
          }, 200)
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      },
      doEdit() {
        updateMenu(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          setTimeout(() => {
            this.sup_this.getList()
          }, 200)
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
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
