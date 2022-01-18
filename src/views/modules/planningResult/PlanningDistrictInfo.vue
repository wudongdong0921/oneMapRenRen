<template>
<div class="nameAddress">
    <div class="querybox">
        <div class="form-item">
            <el-input v-model="param.adName" placeholder="请输入行政区划名称" clearable></el-input>
        </div>
        <div class="form-item" style="width: 60%;">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="danger" @click="deleteItem">删除</el-button>
        </div>
    </div>
    <div class="tableBox" v-loading="showLoading">
        <el-table ref="multipleTable" @select="select" @selection-change='selectChange' @select-all='selectAll' :data="tableData" tooltip-effect="dark" style="width: 100%" row-key="ghxzqhId" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <!-- <el-table-column label="编号" prop="ghxzqhId"> </el-table-column> -->
            <el-table-column prop="xzqhId" label="行政区划编号">
            </el-table-column>
            <el-table-column prop="adName" label="行政区划名称">
            </el-table-column>
            <!-- <el-table-column prop="ghcglxId" label="规划成果类型编号">
            </el-table-column> -->
            <el-table-column prop="cgxxbhId" label="成果信息编号">
            </el-table-column>
            <el-table-column prop="versionNumber" label="版本号">
            </el-table-column>
            <!-- <el-table-column prop="sort" label="排序"> </el-table-column> -->

            <el-table-column prop="createDate" label="创建时间"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="update(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="deleteSingle(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- <div class="tableBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
    </div> -->
    <el-dialog title="修改" :visible.sync="dialogVisible" width="40%" destroy-on-close>
        <planningDupdate @closeE="closeEvent" ref="planningDupdate" />
    </el-dialog>
</div>
</template>

<script>
import apis from './apis'
import planningDupdate from './planningD-update'


export default {
    //import引入的组件
    components: {
        planningDupdate
    },
    data() {
        return {
            param: {
                adName: "",
                // pageNum: 1,
                // pageSize: 10,
                ghcglxId: '0'
            },
            currentPage: 1,
            totalNum: 0,
            tableData: [],
            multipleSelection: [],
            showLoading: false,
            dialogVisible: false,
            ghcglxId: 0,
            deleteList: [],
            selectRowList: [],
            selectItem: {}
        };
    },
    //方法集合
    methods: {
        
        initData() {
            this.showLoading=true;
            apis.getplanningDistrictListNew(this.param).then(result => {
                
                this.showLoading = false;
                this.tableData = this.getTree(result.data);
              

            })
        },
        getTree(res) {
            var _data = {}; // 递归源对象
            var treeData = [];
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                _data[element.xzqhId] = element;
            };
            for (let i = 0; i < res.length; i++) {
                const child = res[i];
                if (_data.hasOwnProperty(child.pid)) {
                    const parent = _data[child.pid];
                    if (!parent.hasOwnProperty('children')) parent['children'] = [];
                    parent['children'].push(child);
                } else {
                    treeData.push(child);
                }
            };

            return treeData;
        },
        search() {
            this.initData()
        },
        select(data,e) {
            this.selectItem = e
        },
        // 子级
        selectChange(e) {
            let xzqhIds = []
            this.multipleSelection = []
            for(let item of e) {
                if(item.children && item.children.length) {
                    for(let it of item.children) {
                        this.$refs.multipleTable.toggleRowSelection(it,true)
                    }
                }
                xzqhIds.push(item.xzqhId)
            }
            if(this.selectItem.children && this.selectItem.children.length) {
                if(xzqhIds.indexOf(this.selectItem.xzqhId) < 0) {
                    for(let item of this.selectItem.children) {
                        this.$refs.multipleTable.toggleRowSelection(item,false)
                    }
                }
            }
            this.multipleSelection = e
        },
        selectAll(e) {
            if(this.selectRowList.length === 0) {
                this.getTreeChildrenId(e)
                this.deleteList = []
                for(let item of this.selectRowList) {
                    this.$refs.multipleTable.toggleRowSelection(item,true)
                }
            }else {
                this.selectRowList = []
                this.$refs.multipleTable.clearSelection()
            }
        },
        getTreeChildrenId(data) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                this.selectRowList.push(element)
                this.deleteList.push(element.ghxzqhId)
                if(element.children) {
                    this.getTreeChildrenId(element.children)
                }
            }
        },
        deleteItem() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请选择要删除的选项！',
                    type: 'warning'
                });
                return
            }
            this.deleteList = []
            this.getTreeChildrenId(this.multipleSelection)
            this.$confirm("是否删除该条数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                apis.deletePlanningDistrict({
                    "ghxzqhId": this.deleteList
                }).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.initData()
                })
            })
        },
        deleteSingle(data) {
            // console.log(data);
            this.$confirm("是否删除该条数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                this.deleteList = []
                this.getTreeChildrenId([data])
                apis.deletePlanningDistrict({
                    "ghxzqhId": this.deleteList
                }).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.initData()
                })
            })
        },
        update(data) {
            this.dialogVisible = true;
            
            setTimeout(() => {
                this.$refs.planningDupdate.initData(data)
            }, 20)

        },
        currentPageChange(e) {
            this.param.pageNum = e;
            this.initData();
        },
        handleSizeChange(val) {
            this.param.pageSize = val;
            this.initData();
        },
        handleClick(data) {
            console.log(data)
        },
        handleCurrentChange(val) {
            this.param.pageNum = val;
            this.initData();
        },
        closeEvent() {
            this.dialogVisible = false;
            this.initData();
        }
    },
    created() {
        //console.log(this.$route.params.ghcglxId)
        this.param.ghcglxId = this.$route.params.ghcglxId || '0';

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.initData()
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
