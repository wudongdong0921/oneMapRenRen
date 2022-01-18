<template>
    <el-dialog :visible.sync="visible" title="流程信息" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="dataForm" label-width="100px">
            <el-form-item label="名称" prop="processName">
                <el-input v-model="dataForm.processName" placeholder="请输入流程名称"></el-input>
            </el-form-item>
            <el-form-item label="模块" prop="processType">
                <el-select v-model="dataForm.processType" placeholder="请选择功能模块" style="width:100%;">
                  <el-option v-for="item in processTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="选择流程" prop="remark">
                <el-tree :data="flowList" :props="{ label: 'flowname', children: 'children' }" show-checkbox node-key="id" ref="flowListTree"></el-tree>
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center;">
                <el-button type="primary" @click="saveData()">确定</el-button>
                <el-button @click="visible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

import apis from "./apis";

export default {
    data() {
        return {
            dataForm: {
                id: '',
                processType: '',
                processName: '',
                remark: '',
                flowdefids: []
            },
            visible: false,
            flowList: [],
            processTypeList: [{
              value: '选项1',
              label: '黄金糕'
            }],
        }
    },
    methods: {
        init(id) {
            this.visible = true;
            this.$nextTick(() => {
                this.dataForm.id = '';
                this.$refs['form'].resetFields()
                this.getFlowLists();
                if(id){
                  this.getInfoData(id);
                } else {
                  this.$refs.flowListTree.setCheckedKeys([]);
                  this.getModular();
                }
            })
        },
        getModular(){
          this.processTypeList = [];
          apis.queryAllProcess().then((res) => {
            var selected = res.data;
            apis.queryModular().then((res) => {
              this.processTypeList = res.data;
              for(var i = 0; i < selected.length; i++){
                this.processTypeList = this.removeAaary(this.processTypeList,selected[i].processType);
              }
            });
          });
        },
        removeAaary(arr,value){
          var len = arr.length;
          for(var i = 0; i < len; i++){
            if(arr[i].value == value && this.dataForm.processType != value){
              if (i == 0) {
                arr.shift(); //删除并返回数组的第一个元素
                break;
              } else if (i == length - 1) {
                arr.pop();  //删除并返回数组的最后一个元素
                break;
              } else {
                arr.splice(i, 1); //删除下标为i的元素
                break;
              }
            }
          }
          return arr;
        },
        getInfoData(id){
          apis.getProcessInfoById(id).then((res) => {
            this.dataForm = res.data;
            this.$refs.flowListTree.setCheckedKeys(this.dataForm.flowdefids == null ? []: this.dataForm.flowdefids);
            this.getModular();
          });
        },
        saveData(){
          this.dataForm.flowdefids = this.$refs.flowListTree.getCheckedKeys(true)
          apis.saveProcessInfo(this.dataForm).then((res) => {
            if(res.code == 200){
              this.visible = false;
              this.$emit('refreshDataList')
            }
          });
        },
        // 流程栏
        getFlowLists() {
          return this.$http.post('/public/getFlowDefList').then(({data: res}) => {
            if (res.code != 200) {
              return this.$message.error(res.msg)
            }
            this.flowList = this.getTreeClass(res.data)
          }).catch(() => { })
        },
        // 封装tree
        getTreeClass(data) {
          let obj = {}
          let dataList = []
          data.forEach((key) => {
            if (key.typename && !obj.hasOwnProperty(key.typename)) {
              obj[key.typename] = []
              obj[key.typename].push({
                flowid: key.flowid,
                flowname: key.flowname,
                id: key.id
              })
            } else if (key.typename && obj.hasOwnProperty(key.typename)) {
              obj[key.typename].push({
                flowid: key.flowid,
                flowname: key.flowname,
                id: key.id
              })
            } else {
              if (!obj.hasOwnProperty('其他')) {
                obj['其他'] = []
              }
              obj['其他'].push({
                flowid: key.flowid,
                flowname: key.flowname,
                id: key.id
              })
            }
          })
          for (let item in obj) {
            dataList.push({
              flowname: item,
              children: obj[item]
            })
          }
          return dataList
        },
    }
}
</script>
