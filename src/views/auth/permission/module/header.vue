<template>
    <div class="filter-container">
      <el-input :placeholder="$t('table.menuName')" v-model="query.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="$refs.form.dialog = true">{{ $t('table.add') }}</el-button>
      <eForm ref="form" :menus="menus" :is-add="true"/>
    </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import eForm from './form'
  import waves from '@/directive/waves' // Waves directive

  export default {
    components: {eForm},
    directives: { waves },
    props: {
      query: {
        type: Object,
        required: true
      },
      menus: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        downloadLoading: false
      }
    },
    methods: {
      checkPermission,
      handleFilter() {
        this.$parent.getList()
        setTimeout(()=>{
          this.query.name = undefined
        },0.5 * 1000)
      }
    }
  }
</script>
