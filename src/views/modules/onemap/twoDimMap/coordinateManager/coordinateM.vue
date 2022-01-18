<template>
<div class="coordinate">
    <div class="querybox">
        <div class="form-item">
            <el-input clearable v-model="param.prjName" placeholder="请输入坐标系名称"></el-input>
        </div>
        <div class="form-item">
            <el-select v-model="param.status" style="width: 100%" placeholder="请选择">
                <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="form-item" style="width: 60%;">
            <el-button @click="search">查询</el-button>
            <!-- <el-button type="primary" @click="update(0)">启用</el-button>
            <el-button type="danger" @click="update(1)">禁用</el-button> -->
        </div>
    </div>
    <div class="tableBox" v-loading="showLoading">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="prjName" label="坐标系名称"> </el-table-column>
            <el-table-column prop="prjType" label="坐标系类型"> </el-table-column>
            <el-table-column prop="subband" label="EPSG CODE"> </el-table-column>
            <el-table-column prop="statusTxt" label="启用状态"> </el-table-column>
            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="update(scope.row)">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="tableBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
    </div>
</div>
</template>

<script>
import apis from "./apis.js";
export default {
    //import引入的组件
    components: {},
    data() {
        return {
            param: {
                subband: "",
                status: "",
                pageNum: 1,
                pageSize: 10,
            },
            currentPage: 1,
            totalNum: 0,
            showLoading: false,
            statusList: [{
                    label: "全部",
                    id: "",
                },
                {
                    label: "启用",
                    id: 0,
                },
                {
                    label: "停用",
                    id: 1,
                },
            ],
            tableData: [],
            multipleSelection: [],
        };
    },
    //方法集合
    methods: {

        initData() {
            this.showLoading = true;

            this.$apis.getCoordinateList(this.param, (res) => {
                //console.log(res);
                for (let i = 0; i < res.list.length; i++) {
                    const element = res.list[i];
                    if (element.status == 0) {
                        element.statusTxt = "启用"
                    } else {
                        element.statusTxt = "停用"
                    }

                }
                this.tableData = res.list;
                this.totalNum = parseInt(res.total);
                this.showLoading = false
            }, (err) => {});
        },
        search() {
            this.param.pageNum = 1;
            this.initData()
        },
        update(item) {
            const ids = item.fdhxxbId
            this.$apis.updateStatus({
                fdhxxbId: ids,
            },(res) => {
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                });
                this.initData()
            }, (err) =>{ })
        },
        currentPageChange(e) {
            this.param.pageNum = e;
            this.initData();
        },
        handleSizeChange(val) {
            this.param.pageSize = val;
            this.initData();
        },
        handleCurrentChange(val) {
            this.param.pageNum = val;
            this.initData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
        this.initData();
    },
};
</script>

<style scoped>
.coordinate {
    background: #fff;
    padding: 20px;
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 15px;
    top: 15px;
    overflow-y: auto;
}

.coordinate .querybox {
    display: flex;
}

.coordinate .form-item {
    width: 15%;
    margin-right: 20px;
}

.coordinate .tableBox {
    margin-top: 20px;
}
</style>
