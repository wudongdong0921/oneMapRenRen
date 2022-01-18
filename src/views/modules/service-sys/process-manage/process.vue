<template>
    <el-card shadow="never" class="aui-card--fill">
        <div>
            <el-form :inline="true" :model="param" @keyup.enter.native="">
                <el-form-item>
                    <el-input v-model="param.processName" placeholder="请输入流程名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add()">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="deleteBatch()">删除</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%;" @selection-change="dataListSelectionChangeHandle">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="processName" label="名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="processTypeFormat" label="模块" header-align="center" align="center" ></el-table-column>
                <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row.id)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteData(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tableBox">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
              </el-pagination>
            </div>
            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update ref="addOrUpdate" @refreshDataList="initData"></add-or-update>
        </div>
    </el-card>
</template>

<script>
import addOrUpdate from './add-or-update.vue'
import apis from "./apis";

export default {
    data() {
        return {
            dataListLoading: false,
            currentPage: 1,
            totalNum: 0,
            param: {
                processName: '',
                pageNum: 1,
                pageSize: 10,
            },
            dataList: [],
            addOrUpdateVisible: false,
            multipleSelection: [],
            processTypeFormat: []
        }
    },
    components: {
      addOrUpdate
    },
    methods:{
      initData() {
        apis.queryModular().then((res) => {
          this.processTypeFormat = res.data;
          this.dataListLoading = true;
          apis.getProcessPage(this.param).then((res) => {
            this.dataList = res.data.list;
            for(var i = 0; i < this.dataList.length; i++){
              var index = this.getIndex(this.processTypeFormat,this.dataList[i].processType);
              if(index != -1){
                this.dataList[i]["processTypeFormat"] = this.processTypeFormat[index].label;
              } else {
                this.dataList[i]["processTypeFormat"] = "";
              }
            }
            this.totalNum = parseInt(res.data.total);
            this.dataListLoading = false
          });
        });

      },
      getIndex (arr,value) {
        var len = arr.length;
        for(var i = 0; i < len; i++){
          if(arr[i].value == value){
            return parseInt(i);
          }
        }
        return -1;
      },
      deleteBatch(){
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: '请勾选要删除的流程！',
            type: 'warning'
          });
          return
        }
        var deleteList = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const element = this.multipleSelection[i];
          deleteList.push(element.id)
        }
        this.$confirm("是否删除该条数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(() => {
          apis.deleteProcessInfoById(deleteList).then((res) => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initData()
          });
        })
      },
      deleteData(id){
        this.$confirm("是否删除该条数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(() => {
          apis.deleteProcessInfoById([id]).then((res) => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initData()
          });
        })

      },
      dataListSelectionChangeHandle(val) {
        this.multipleSelection = val;
      },
      search() {
        this.initData()
      },
      handleSizeChange(val) {
        this.param.pageSize = val;
        this.initData();
      },
      handleCurrentChange(val) {
        this.param.pageNum = val;
        this.initData();
      },
      add(){
        this.$refs.addOrUpdate.init();
      },
      update(id){
        this.$refs.addOrUpdate.init(id);
      }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      this.initData();
    },
}
</script>
