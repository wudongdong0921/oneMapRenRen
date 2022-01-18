<template>
  <div class="nameAddress">
    <div class="querybox">
      <div class="form-item">
        <el-input v-model="param.planResultName" placeholder="请输入查询名称" clearable></el-input>
      </div>
      <div class="form-item" style="width: 60%;">
        <el-button @click="search">查询</el-button>
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="danger" @click="deleteItem">删除</el-button>
      </div>
    </div>
    <div class="tableBox" v-loading="showLoading">
      <el-table
        border
        :header-cell-style="{textAlign: 'center'}"
        :cell-style="{ textAlign: 'center' }"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="dataListSortChangeHandle"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="sort" label="排序" width="55" sortable="custom"></el-table-column>
        <!-- <el-table-column label="编号" prop="ghcglxId"> </el-table-column> -->
        <el-table-column prop="planResultName" label="规划成果名称">
          <template slot-scope="scope">
            <el-button type="text" @click="childHandle(scope.row)">{{ scope.row.planResultName }}</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteSingle(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableBox">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="param.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <el-dialog
      :title="type==0?'添加':'修改'"
      :visible.sync="dialogVisible"
      width="40%"
      destroy-on-close
    >
      <planningRupdate @closeE="closeEvent" ref="planningRupdate" />
    </el-dialog>
  </div>
</template>

<script>
import apis from "./apis";
import planningRupdate from "./planningR-update";
import { addDynamicRoute } from "@/router";
export default {
  //import引入的组件
  components: {
    planningRupdate,
  },
  data() {
    return {
      param: {
        planResultName: "",
        pageNum: 1,
        pageSize: 10,
        orderField: "sort",
        order: "asc",
      },
      totalNum: 0,
      tableData: [],
      multipleSelection: [],
      showLoading: true,
      dialogVisible: false,
      type: 0,
    };
  },
  //方法集合
  methods: {
    initData() {
      apis.getPlanResultList(this.param).then((result) => {
      
        this.showLoading = false;
        this.tableData = result.data.list;
        this.totalNum = parseInt(result.data.total);
      });
    },
    add() {
      this.type = 0;
      this.dialogVisible = true;
    },
    search() {
      this.param.pageNum = 1;
      console.log(this.param.pageNum);
      this.initData();
    },
    // 子级
    childHandle(row) {
      // 路由参数
      const routeParams = {
        routeName: `${this.$route.name}__${row.ghcglxId}`,
        title: `${this.$route.meta.title} - ${row.planResultName}`,
        path: "planningResult/PlanningDistrictInfo",
        params: {
          ghcglxId: row.ghcglxId,
        },
      };
      // 动态路由
      addDynamicRoute(routeParams, this.$router);
    },
    dataListSortChangeHandle(val) {
      //console.log(val)
      if (!val.order || !val.prop) {
        this.param.order = ''
        this.param.orderField = ''
        return false
      }
      this.param.order = val.order.replace(/ending$/, "");
      this.param.orderField = val.prop.replace(/([A-Z])/g, "_$1").toLowerCase();

      this.initData();
    },
    deleteItem() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择要删除的选项",
          type: "warning",
        });
        return;
      }
      var deleteList = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const element = this.multipleSelection[i];
        deleteList.push(element.ghcglxId);
      }
      this.$confirm("是否删除该条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        apis
          .deleteRramsPlanResultType({
            ghcglxIds: deleteList,
          })
          .then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.initData();
          });
      });
    },
    deleteSingle(data) {
      this.$confirm("是否删除该条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        apis
          .deleteRramsPlanResultType({
            ghcglxIds: [data.ghcglxId],
          })
          .then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.initData();
          });
      });
    },
    currentPageChange(e) {
      this.param.pageNum = e;
      this.initData();
    },
    handleSizeChange(val) {
      this.param.pageSize = val;
      this.initData();
    },
    update(data) {
      this.type = 1;
      this.dialogVisible = true;
      console.log(data);
      setTimeout(() => {
        this.$refs.planningRupdate.initData(data);
      }, 20);
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.initData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeEvent() {
      this.dialogVisible = false;
      this.initData();
    },
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>
.nameAddress {
  background: #fff;
  padding: 20px;
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 15px;
  top: 15px;
  overflow-y: auto;
}

.nameAddress .querybox {
  display: flex;
}

.nameAddress .form-item {
  width: 15%;
  margin-right: 20px;
}

.nameAddress .tableBox {
  margin-top: 20px;
}
</style>
