<!-- 资料模板 -->
<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row class="tac">
      <el-col :span="4" class="leftTree">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>统计类别</span>
          </div>
          <div v-for="(item,index) in categoryList" :key="index" class="text item" style="text-align: center;">
            <el-button style="width:90%;margin-bottom:10px;" :id="'category_button_'+index" @click="categorySwitch(item,index)">{{item.label}}</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19" class="rightTable" v-loading="loading">
        <el-card shadow="never" class="aui-card--fill">
          <div class="mod-sys__role">
            <el-form :inline="true" :model="dataForm">
              <el-form-item>
                <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" row-key="id" :tree-props="{children: 'children'}" border style="width: 100%;">
              <el-table-column prop="indexName" label="指标名称" header-align="center" align="left"></el-table-column>
              <el-table-column prop="dataSheetName" label="数据表名称" header-align="center" align="center"></el-table-column>
              <el-table-column prop="fieldName" label="字段名称" header-align="center" align="center"></el-table-column>
              <el-table-column prop="statisticsType" label="统计类型" header-align="center" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.statisticsType === '0'">计数</span>
                  <span v-else>求和</span>
                </template>
              </el-table-column>
              <el-table-column prop="chart" label="是否统计图表" header-align="center" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.chart === '0'">是</span>
                  <span v-else>不是</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" header-align="center" align="center"></el-table-column>
              <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
              <el-table-column label="操作" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="updateHandle1(scope.row)">{{ $t('update') }}</el-button>
                  <el-button type="text" size="small" @click="deleteHandle1(scope.row)">{{ $t('delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <add-or-update ref="addOrUpdate" @refreshDataList="initData()"></add-or-update>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import addOrUpdate from './add-or-update'
import apis from "./apis";

export default {
  data() {
    return {
      dataListLoading: false,
      loading: false,
      dataList: [],
      categoryList: [{
        label: '',
        value: ''
      }],
      dataForm: {
        workflowId: '',
        enclosureName: ''
      },
      categoryKey: '',
      categoryItem: '',
      currentCategory: '',
    }
  },
  mounted() {
    this.queryCategory();
  },
  components: {
    addOrUpdate
  },
  methods: {
    initData(){
      apis.queryStatisticsConfig(this.categoryKey).then((res) => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        };
        this.dataList = res.data;
      });
    },
    categorySwitch(item,index){
      document.getElementById(this.currentCategory).classList.remove("custom-select");
      this.currentCategory = 'category_button_'+index;
      document.getElementById(this.currentCategory).classList.add("custom-select");

      this.categoryKey = item.value;
      this.categoryItem = item;
      this.initData();

    },
    queryCategory(){
      apis.queryCategory().then((res) => {
        this.categoryList = res.data;
        if(res.data && res.data.length > 0){
           this.categoryKey = res.data[0].value
           this.categoryItem = res.data[0]
          setTimeout(() =>{
            this.currentCategory = 'category_button_0';
            document.getElementById("category_button_0").classList.add("custom-select");
          },10);
          this.initData();
        }
      });
    },
    addOrUpdateHandle(){
      this.$refs.addOrUpdate.init(null,this.categoryItem);
    },
    updateHandle1(data){
      this.$refs.addOrUpdate.init(data.id,this.categoryItem);
    },
    deleteHandle1(data){
      if (data.children.length) {
        this.$message({
          message: '该指标存在下级节点, 请先删除下级节点',
          type: 'warning',
          duration: 500
        })
        return;
      }
      this.$confirm("是否删除该条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        apis.deleteStatisticsConfig(data.id).then((res) => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.initData()
        });
      })

    },
  }

}
</script>

<style scope>
.tac { height: 80vh;}
.leftTree { height: 80vh; padding: 0 20px 0 0; border-right: 1px solid #ccc ;}
.rightTable { margin: 0 0 0 20px;}
.custom-select{
  color: #FFF;
  background-color: #409eff;
  border-color: #409eff;
}
.item > .el-button:focus, .item > .el-button:hover {
  color: #FFF;
  border-color: #409eff;
  background-color: #409eff;
}
</style>