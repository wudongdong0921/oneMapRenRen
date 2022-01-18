<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <!-- start -->
      <el-form-item prop="parentName" label="上级字典" class="menu-list">
        <el-popover v-model="menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="dataList"
            :props="{ label: 'dictValue', children: 'children' }"
            node-key="id"
            ref="menuListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="menuListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" :placeholder="$t('menu.parentName')">
          <i v-if="dataForm.pid !== '0'" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
        </el-input>
      </el-form-item>
      <!-- end -->
      <el-form-item prop="dictValue" :label="$t('dict.dictValue')">
        <el-input v-model="dataForm.dictValue" :placeholder="$t('dict.dictValue')"></el-input>
      </el-form-item>
      <el-form-item prop="dictLabel" :label="$t('dict.dictLabel')">
        <el-input v-model="dataForm.dictLabel" :placeholder="$t('dict.dictLabel')"></el-input>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('dict.sort')">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('dict.sort')"></el-input-number>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dict.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('dict.remark')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  props: {
    dataList: Array
  },
  data () {
    return {
      menuListVisible: false,
      visible: false,
      dataForm: {
        parentName: '',
        pid: 0,
        id: '',
        dictTypeId: '',
        dictLabel: '',
        dictValue: '',
        sort: 0,
        remark: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        dictLabel: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.parentName = '一级菜单'
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 上级菜单树, 设置默认值
    deptListTreeSetDefaultHandle () {
      this.dataForm.pid = 0
      this.dataForm.parentName = '一级菜单'
    },
    // 上级菜单树, 选中
    menuListTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.dictValue
      this.menuListVisible = false
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/dict/data/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.$refs.dataList.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/dict/data', this.dataForm).then(({ data: res }) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
