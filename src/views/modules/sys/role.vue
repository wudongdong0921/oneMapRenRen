<template>
    <el-card shadow="never" class="aui-card--fill coordinate">
        <div class="mod-sys__role">
            <el-form :inline="true" :model="param" @keyup.enter.native="initData()">
                <el-form-item>
                    <el-input v-model="param.name" :placeholder="$t('role.name')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="initData()">{{ $t('query') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="$hasPermission('sys:role:save')" type="primary" @click="add()">{{ $t('add') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="$hasPermission('sys:role:delete')" type="danger" @click="deleteRole()">{{ $t('deleteBatch') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="name" :label="$t('role.name')" header-align="center" align="center"></el-table-column>
                <el-table-column prop="remark" :label="$t('role.remark')" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
                <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="$hasPermission('sys:role:update')" type="text" size="small" @click="update(scope.row.id)">{{ $t('update') }}</el-button>
                        <el-button v-if="$hasPermission('sys:role:delete')" type="text" size="small" @click="deleteSingelRole(scope.row.id)">{{ $t('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tableBox">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
                </el-pagination>
            </div>
            <!-- 弹窗, 新增 / 修改 -->
            <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
            <el-dialog :title="(type==0?'新增':'修改')" :visible.sync="dialogVisible" top="8vh" width="50%" destroy-on-close>
                <addRole v-if="dialogVisible" @closeE="closeEvent" ref="addRole" :type="type" />
            </el-dialog>
        </div>
    </el-card>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './role-add-or-update'
import apis from "./apis"
import addRole from './addRole'
export default {
    //mixins: [mixinViewModule],
    data() {
        return {
            param: {
                name: "",
                pageNum: 1,
                pageSize: 10,
            },
            currentPage: 1,
            totalNum: 0,
            type: 0,
            dialogVisible: false,
            dataList: [],
            multipleSelection: [],
            dataListLoading: true
        };
    },
    components: {
        addRole
    },
    //方法集合
    methods: {

        initData() {
            this.dataListLoading = true;
            apis.getRoleList(this.param).then((res) => {
                this.dataList = res.data.list;
                this.totalNum = parseInt(res.data.total);
                this.dataListLoading = false
            });
        },
        search() {
            this.initData()
        },
        add() {
            this.type = 0
            this.dialogVisible = true
        },
        closeEvent() {
            this.dialogVisible = false
            this.initData()
        },
        deleteRole() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请勾选要删除的角色！',
                    type: 'warning'
                });
                return
            }
            var deleteList = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
                const element = this.multipleSelection[i];
                deleteList.push(element.id)
            }
            this.$confirm("是否确定删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                apis.deleteRole(deleteList).then(() => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.initData()
                })
            })

        },
        deleteSingelRole(data) {
            //console.log(data)
            this.$confirm("是否删除该条数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                apis.deleteRole([data]).then(() => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.initData()
                })
            })

        },
        update(id) {
            //console.log(this.multipleSelection)
            this.type = 1
            this.dialogVisible = true;
            setTimeout(() => {
                this.$refs.addRole.init(id)
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
        handleCurrentChange(val) {
            this.param.pageNum = val;
            this.initData();
        },
        dataListSelectionChangeHandle(val) {
            this.multipleSelection = val;
        },
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.initData();
    },
}
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
</style>>
