<template>
  <el-dialog :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="120px">
      <el-form-item prop="parentName"
        label="上级目录"
        class="menu-list">
        <el-popover v-model="menuListVisible"
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree :data="dataList"
            :props="{ label: 'enclosureName', children: 'children' }"
            node-key="id"
            ref="menuListTree"
            :default-expanded-keys="defaultExpandedKeys"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleFileList"
            accordion>
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName"
          v-popover:menuListPopover
          :readonly="true"
          placeholder="请选择上级目录">
          <i slot="suffix"
            @click.stop="deptListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="enclosureName"
        label="附件名称">
        <el-input v-model="dataForm.enclosureName"
          placeholder="附件名称"></el-input>
      </el-form-item>
      <el-form-item prop="sort"
        label="排序">
        <el-input v-model="dataForm.sort"
          type="number"
          placeholder="0"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="useState"
        label="状态">
        <el-select v-model="dataForm.useState"
          placeholder="请选择状态">
          <el-option label="正常"
            value="0"></el-option>
          <el-option label="删除"
            value="1"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary"
        @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import debounce from 'lodash/debounce'
  import axiosEvent from '@/utils/axiosevent'
  export default {
    data() {
      return {
        visible: false,
        defaultExpandedKeys: [0],
        dataList: [{
          id: 0,
          enclosureName: '',
          children: [],
        }],
        menuListVisible: false,
        dataForm: {
          pid: '0',
          id: '',
          workflowId: '',
          enclosureName: '',
          sort: '',
          useState: '0',
          parentName: '',
        }
      }
    },
    computed: {
      dataRule() {
        return {
          enclosureName: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          sort: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      typename: String
    },
    methods: {
      init(id, formData) {
        console.log(id);
        this.dataForm.workflowId = id;
        if (formData) {
          this.dataForm.id = formData.id;
          this.dataForm.pid = formData.pid;
          this.dataForm.enclosureName = formData.enclosureName;
          this.dataForm.sort = formData.sort;
          // this.useState = formData.useState;
          this.dataForm.parentName = this.typename
        } else {
          this.dataForm.id = '';
          this.dataForm.pid = 0;
          this.dataForm.enclosureName = '';
          this.dataForm.sort = '';
          this.defaultExpandedKeys = [0]
          this.dataForm.parentName = this.typename
        };

        this.getTreeData();
        this.visible = true;
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        //   if (this.dataForm.id) {
        //     this.getInfo()
        //   }
        // })
      },
      getTreeData() {
        axiosEvent({
          type: 'post',
          url: '/sysEnclosure/getEnclosureTree',
          target: 'business',
          data: {
            workflowId: this.dataForm.workflowId
          },
        }).then((res) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          };
          this.dataList[0].children = res.data;
          var obj = {};
          var formatData = function (data, depth) {
            depth = depth || 0;
            obj[data.id] = data;
            if (data.hasOwnProperty('children')) {
              let element = data['children'];
              for (let i = 0; i < element.length; i++) {
                let _element = element[i];
                if (depth == 1) {
                  delete data['children'];
                } else {
                  formatData(_element, depth + 1);
                };
              }
            };
          };
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            formatData(element);
          };
          if (this.dataForm.pid != 0 && obj.hasOwnProperty(this.dataForm.pid)) {
            this.dataForm.parentName = obj[this.dataForm.pid].enclosureName;
            setTimeout(() => {
              this.defaultExpandedKeys = [this.dataForm.pid];
              this.$refs['menuListTree'].setCurrentKey(this.dataForm.pid);
            }, 50);
          } else if (this.dataForm.pid == 0) {
            this.dataForm.parentName = this.typename;
          };
          this.dataList[0].enclosureName = this.typename
        });
      },
      // 获取信息
      // getInfo() {
      //   console.log(this.dataForm.id)
      //   this.$http.post(`/SysEnclosure/querySysEnclosureById?id=${this.dataForm.id}`).then(({ data: res }) => {
      //     console.log(res)
      //     if (res.code !== 200) {
      //       return this.$message.error(res.msg)
      //     }
      //     this.dataForm = {
      //       ...this.dataForm,
      //       ...res.data
      //     }
      //   }).catch(() => { })
      // },
      deptListTreeSetDefaultHandle() {
        this.dataForm.pid = 0;
        this.dataForm.parentName = this.typename;
        this.menuListVisible = false;
      },
      handleFileList(obj) {
        this.dataForm.pid = obj.id;
        this.dataForm.parentName = obj.enclosureName;
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          };
          axiosEvent({
            type: 'post',
            url: '/sysEnclosure/saveSysEnclosure',
            target: 'business',
            data:this.dataForm
          }).then((res) => {
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
          });
        })
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
</script>