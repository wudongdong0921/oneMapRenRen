<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable v-model="param.dicName" placeholder="查询名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelet">删除</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="inquiryList" border style="width: 100%" @select-all='selectAll' @selection-change='selectChange'>
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="sort" label="排序" header-align="center" width="50" align="center"></el-table-column>
                <el-table-column prop="dicName" label="目录名称" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div style="cursor: pointer;color: #17B3A3;" @click="toChild(scope.row)">{{scope.row.dicName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="250" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="saveEvent(scope)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="param.page" :page-sizes="[10, 20, 50, 100]" :page-size="param.limit" :total="Number(busunessUbqyuryData.total)" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
            </el-pagination>

            <el-dialog :visible="addManageFlag" title="文档管理配置" :destroy-on-close="true" :before-close="addManageClose">
                <add-manage v-if="addManageFlag" ref="addManage" @resetInquiryData="postInquiryList" @clickClose="addManageClose"></add-manage>
            </el-dialog>
        </div>
    </el-card>
</template>

<script>
import addManage from './add-manage.vue'
import { addDynamicRoute } from '@/router'

export default {
    components: {
        addManage
    },
    data() {
        return {
            dataListLoading: false,
            addManageFlag: false,
            inquiryList: [],
            busunessUbqyuryData: {},
            param: {
                dicName: '',
                page: 1,
                limit: 10,
            },
            selectionList: []
        }
    },
    methods: {
        // 子路由跳转
        toChild(row) {
            const routeParams = {
                routeName: `${this.$route.name}__${row.id}`,
                title: '文档管理 - ' + row.dicName,
                path: 'onemap/mapDocument/documentManage/edit/edit-field',
                params: {
                    dictId: row.id,
                    id: row.id,
                    dicName: row.dicName
                }
            };
            // 动态路由
            addDynamicRoute(routeParams, this.$router)
        },

        // 查询数据列表
        postInquiryList() {
            this.inquiryList = [];
            this.$api.getStatisList(this.param,res => {
                this.busunessUbqyuryData = res;
                this.inquiryList = this.busunessUbqyuryData.list;
                this.dataListLoading = false;
                this.addManageFlag = false;
            })
        },

        // 查询
        onSubmit(page) {
            if (!page) {
                this.param.page = 1
            } else {
                this.param.page = page
            }

            this.$api.getStatisList(this.param, res => {   
                this.busunessUbqyuryData = res;
                this.inquiryList = this.busunessUbqyuryData.list;
                this.dataListLoading = false;
                this.addManageFlag = false;
            })

        },

        // 添加
        onAdd() {
            this.addManageFlag = true;
        },

        // 批量删除
        onDelet() {
            if (this.selectionList.length <= 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择要删除的数据'
                })
            } else {
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$api.deleteDocuments(this.selectionList, (res) => {
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.postInquiryList();
                    }).catch(err => {
                        this.$message.error(err.response.data.msg)
                    });
                }).catch(err => {
                    // this.$message({ message: "已取消", type: "info" });
                })
            }
        },

        // 数据全选
        selectAll(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.id)
            }
        },

        // 选择数据
        selectChange(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.id)
            }
        },

        // 修改
        saveEvent(saveData) {
            this.addManageFlag = true;
            this.$nextTick(() => {
                this.$refs.addManage.init(saveData.row)
            })
        },

        // 单个删除
        deleteEvent(deleteData) {
            this.$confirm("此操作将删除该数据,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = [deleteData.row.id];
                this.$api.deleteDocuments(data, (res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.postInquiryList();
                }).catch(err => {
                    this.$message.error(err.response.data.msg)
                })
            })
        },

        //更改每页显示条数
        changePageSize(e) {
            this.param.limit = e;
            this.postInquiryList();
        },
        //切换当前页
        currentChange(e) {
            this.param.page = e;
            this.postInquiryList()
        },

        //关闭业务查询弹窗
        addManageClose() {
            this.addManageFlag = false;
            this.postInquiryList();
        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
        this.postInquiryList()
    }
}
</script>
