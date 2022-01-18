<template>
    <el-dialog :visible.sync="visible" title="流程信息" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="dataForm" label-width="100px">
            <el-form-item prop="parentName" label="上级目录" class="menu-list">
                <el-popover v-model="menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
                    <el-tree :data="dataList" :props="{ label: 'indexName', children: 'children' }" node-key="id" ref="menuListTree" :default-expanded-keys="defaultExpandedKeys"
                             :highlight-current="true" :expand-on-click-node="false" @node-click="handleFileList" accordion> </el-tree>
                </el-popover>
                <el-input v-model="dataForm.pname" v-popover:menuListPopover :readonly="true" placeholder="请选择上级目录">
                    <i slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="指标名称" prop="processName">
                <el-input v-model="dataForm.indexName" placeholder="请输入指标名称"></el-input>
            </el-form-item>
            <el-form-item label="数据表名称" prop="processType">
                <el-input v-model="dataForm.dataSheetName" placeholder="请输入数据表名称"></el-input>
            </el-form-item>
            <el-form-item label="字段名称" prop="remark">
                <el-input v-model="dataForm.fieldName" placeholder="请输入字段名称"></el-input>
            </el-form-item>
            <el-form-item label="统计类型" prop="remark">
                <el-radio-group v-model="dataForm.statisticsType">
                  <el-radio label="0">计数</el-radio>
                  <el-radio label="1">求和</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否统计图表" prop="remark">
                <el-radio-group v-model="dataForm.chart">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">不是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="过滤条件" prop="remark">
              <el-input v-model="dataForm.whereCondition" placeholder="请输入单位"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="remark">
                <el-input v-model="dataForm.unit" placeholder="请输入单位"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="remark">
                <el-input v-model="dataForm.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center;">
                <el-button type="primary" @click="testSql()">测试SQL</el-button>
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
                pid: '',
                pname: '',
                indexName: '',
                dataSheetName: '',
                fieldName: '',
                statisticsType: '0',
                chart: '1',
                category: '',
                categoryLabel: '',
                unit: '',
                whereCondition: '',
                sort: '',
            },
            visible: false,
            flowList: [],
            categorys: [],
            menuListVisible: false,
            dataList: [{
              id: 0,
              indexName: '',
              children: [],
            }],
            defaultExpandedKeys: [0],
        }
    },
    methods: {
        init(id,category) {
            this.visible = true;
            this.$nextTick(() => {
                this.dataForm = {
                  id: '',
                  pid: '',
                  pname: '',
                  indexName: '',
                  dataSheetName: '',
                  fieldName: '',
                  statisticsType: '0',
                  chart: '1',
                  category: '',
                  categoryLabel: '',
                  unit: '',
                  whereCondition: '',
                  sort: '',
                };
                this.dataForm.id = '';
                this.dataForm.category = category.value;
                this.dataForm.categoryLabel = category.label;

                if(id){
                  this.getInfoData(id,category);
                } else {
                  this.getParent(category)
                }

            })
        },
        getInfoData(id,category){
          apis.queryStatisticsConfigById(id).then((res) => {
            this.dataForm = res.data;
            this.dataForm.categoryLabel = category.label;
            this.getParent(category);
          });
        },
        getParent(category){
          this.dataList = [{
            id: 0,
            indexName: '',
            children: [],
          }];
          apis.queryStatisticsConfig(category.value).then((res) => {
            if(res.data){
              var obj = {};
              for(var i = 0; i < res.data.length; i++){
                var item = res.data[i];
                obj[item.id] = item;
                var childrenList = res.data[i].children;
                var children = [];
                for(var j = 0; j < childrenList.length; j++){
                  var childrenItem = childrenList[j];
                  obj[childrenItem.id] = childrenItem;
                  children.push({
                    id: childrenItem.id,
                    indexName: childrenItem.indexName,
                    children: [],
                  });
                }
                this.dataList[0].children.push({
                  id: item.id,
                  indexName: item.indexName,
                  children: children,
                });
              }
            }
            this.dataList[0].indexName = category.label;
            setTimeout(() => {
              if (this.dataForm.pid != '0' && obj.hasOwnProperty(this.dataForm.pid)) {
                this.dataForm.pname = obj[this.dataForm.pid].indexName;
                this.defaultExpandedKeys = [this.dataForm.pid];
                this.$refs['menuListTree'].setCurrentKey(this.dataForm.pid);
              } else {
                this.dataForm.pname = category.label;
                this.dataForm.pid = '0';
                this.defaultExpandedKeys = ["0"];
                this.$refs['menuListTree'].setCurrentKey('0');
              }
            }, 50);

          });
        },
        saveData(){
          apis.saveStatisticsConfig(this.dataForm).then((res) => {
            if(res.code == 200){
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.visible = false;
              this.$emit('refreshDataList')
            }
          });
        },
        deptListTreeSetDefaultHandle() {
          this.dataForm.pid = 0;
          this.menuListVisible = false;
          this.dataForm.pname = this.dataList[0].indexName;
        },
        handleFileList(obj) {
          this.dataForm.pid = obj.id;
          this.dataForm.pname = obj.indexName;
        },
        testSql(){
          apis.testStatisticsConfig(this.dataForm).then((res) => {
            if(res.code == 200){
              this.$message({
                message: '测试成功！',
                type: 'success'
              });
            } else {
              this.$alert(res.msg, this.$t('logError.errorInfo'), {
                customClass: 'mod-sys__log-error-view-info'
              })
            }
          });
        }
    }
}
</script>
