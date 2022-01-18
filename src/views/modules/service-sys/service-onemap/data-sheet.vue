<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params" v-loading="loading">
      <el-form :inline="true">
        <el-form-item>
          <el-input clearable v-model="searchnName" placeholder="流程分类"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search">{{ $t('query') }}</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="onAdd">{{ $t('add') }}</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="danger" @click="onDelet">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%" @select-all='selectAll' @selection-change='selectChange'>
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="lclxId" label="流程分类" header-align="center" align="center"></el-table-column>
          <el-table-column prop="databaseName" label="数据库名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="storageDt" label="存储数据表" header-align="center" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="saveEvent(scope)">{{ $t("update") }}</el-button>
            <el-button type="text" size="small" @click="deleteEvent(scope)">{{ $t("delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="dialogVisible" :title="type ? '添加':'修改'" :destroy-on-close="true" :before-close="dialogClose">
          <addDataSheet ref="addDataSheet" :options='options' v-if="dialogVisible" @getList='getList' @dialogClose='dialogClose' />
      </el-dialog>
      <el-pagination
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="changePageSize"
        @current-change="currentChange"
        >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import addDataSheet from './addDataSheet'
// import apis from './apis'

export default {
  components:{
    addDataSheet
  },
  data() {
    return {
      loading:false,
      tableData:[],
      pagination:{
        page: 1,
        pageSize: 10,
        total: 0
      },
      searchnName: '',
      selectionList: [],
      dialogVisible: false,
      options: [],
      type: true
    };
  },
  mounted(){
    this.getList()
    this.getDict()
  },
  methods: {
    //更改每页显示条数
    changePageSize(e) {
      this.pagination.pageSize = e;
    },
    //切换当前页
    currentChange(e) {
      this.pagination.page = e;
    },
    //获取列表
    getList(){},
    getDict(){},
    //查询
    search(){
      this.pagination.page = 1
      this.getList()
    },
    onAdd() {
      this.type = true
      this.dialogVisible = true
      this.$nextTick(()=>{
        this.$refs.addDataSheet.init()
      })
    },
    delet(list){},
    //批量删除
    onDelet() {
      if(this.selectionList.length <= 0) return this.$message({ type: 'warning',message: '请选择要删除的选项'})
       this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(res=> {
          let list = this.selectionList.join(',')
          this.delet(list)
        })
        .catch(err=> {
          this.$message({ message: "已取消", type: "info" });
        })
    },
    //选中行
    selectChange(selection){
      this.selectionList = []
      if(selection.length === 0) return
      for(let item of selection){
        this.selectionList.push(item.id)
      }
      console.log(this.selectionList);
    },
    //全选
    selectAll(selection){
      this.selectionList = []
      if(selection.length === 0) return
      for(let item of selection){
        this.selectionList.push(item.id)
      }
    },
    //修改
    saveEvent(saveData){
    },
    deleteEvent(deleteData){
      // console.log(deleteData.row.id);
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(res=>{
        let list = deleteData.row.id
        this.delet(list)
      })
      .catch(err=>{
         this.$message({ message: "已取消", type: "info" });
      })
    },
    //关闭新增弹窗
    dialogClose() {
      this.dialogVisible = false
    }
  },
};
</script>
