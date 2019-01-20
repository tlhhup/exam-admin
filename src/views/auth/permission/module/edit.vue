<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" @click="handleUpdate">{{ $t('table.edit') }}</el-button>
    <eForm ref="form" :menus="menus" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
  import eForm from './form'

  export default {
    components: {eForm},
    props: {
      data: {
        type: Object,
        required: true
      },
      sup_this: {
        type: Object,
        required: true
      },
      menus: {
        type: Array,
        required: true
      }
    },
    methods: {
      handleUpdate() {
        const _this = this.$refs.form
        _this.form = {
          id: this.data.id,
          permission: this.data.permission,
          name: this.data.name,
          sort: this.data.sort,
          parentId: this.data.parentId,
          url: this.data.url,
          iframe: String(this.data.iframe),
          icon: this.data.icon
        }
        _this.dialog = true
      }
    }
  }
</script>

<style scoped>
  div {
    display: inline-block;
    margin-right: 3px;
  }
</style>
