<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable v-model="searchName" placeholder="查询名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit(1)">{{ $t("query") }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onAdd">{{ $t("add") }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelet">{{
            $t("deleteBatch")
          }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="inquiryList" border style="width: 100%" @select-all='selectAll' @selection-change='selectChange'>
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="sort" label="排序" header-align="center" width="50" align="center"></el-table-column>
                <el-table-column prop="searchName" label="查询名称" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div style="cursor: pointer;color: #17B3A3;" @click="toChild(scope.row)">{{scope.row.searchName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="250" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="saveEvent(scope)">{{ $t("update") }}</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">{{ $t("delete") }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :visible="inquiryPackageFlag" :title="'业务查询配置'" :destroy-on-close="true" :before-close="inquiryPackageClose">
                <business-inquiry-package :changePageSize='changePageSize' v-if="inquiryPackageFlag" ref="businessInquiryPackage" @resetInquiryData="postInquiryList" @clickClose="inquiryPackageClose"></business-inquiry-package>
            </el-dialog>
            <el-pagination :current-page="busunessUbqyuryData.page" :page-sizes="[10, 20, 50, 100]" :page-size="busunessUbqyuryData.pageSize" :total="Number(busunessUbqyuryData.total)" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import businessInquiryPackage from "./businessInquiryPackage.vue";
import { addDynamicRoute } from '@/router'

export default {
    components: {
        businessInquiryPackage
    },
    data() {
        return {
            searchName: "",
            dataListLoading: false,
            busunessUbqyuryData: {},
            inquiryList: [],
            inquiryPackageFlag: false,
            page: 1,
            pageSize: 10,
            selectionList: []
        };
    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
        this.postInquiryList();
    },
    methods: {
        //子路由跳转
        toChild(row) {
            const routeParams = {
                routeName: `${this.$route.name}__${row.ywcxxxbId}`,
                title: '业务流程管理 - ' + row.searchName,
                path: 'onemap/inquiryManage/businessInquiry/edit/edit-field',
                params: {
                    businessQueryId: row.ywcxxxbId,
                    searchName: row.searchName
                }
            }
            // 动态路由
            addDynamicRoute(routeParams, this.$router)
        },
        //更改每页显示条数
        changePageSize(e) {
            this.pageSize = e;
            this.postInquiryList();
        },
        //获取业务查询列表
        postInquiryList() {
            this.inquiryList = []
            this.$api.getPageLists({
                page: this.page,
                limit: this.pageSize
            }, (res) => {
                this.busunessUbqyuryData = res.data;
                for (let item of this.busunessUbqyuryData.list) {
                    this.inquiryList.push(item);
                }
                this.inquiryPackageFlag = false;
            }, (err) => {
                this.$message.error(err.msg);
            })
        },
        //切换当前页
        currentChange(e) {
            this.page = e;
            this.postInquiryList()
        },
        //查询
        onSubmit(page) {
            if (page) this.page = 1
            this.$api.getPageLists({
                page: this.page,
                limit: this.pageSize,
                searchName: this.searchName
            }, (res) => {
                this.inquiryList = [];
                if (res.data.code !== 200) return this.$message.error(res.msg);
                this.busunessUbqyuryData = res.data.data;
                for (let item of this.busunessUbqyuryData.list) {
                    this.inquiryList.push(item);
                }
            })
        },
        //新增查询业务
        onAdd() {
            this.inquiryPackageFlag = true;
        },
        //删除查询业务
        onDelet() {
            if (this.selectionList.length <= 0) return this.$message({ type: 'warning', message: '请选择要删除的选项' })
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(res => {
                    this.$api.deleteSearchs(this.selectionList.toString(), (res) => {
                        // if (res.data.code !== 200) return this.$message.error(res.data.msg)
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.inquiryList = [];
                        this.postInquiryList()
                    }, (err) => {
                        this.$message.error(res.msg)
                    })
                })
                .catch(err => {
                    this.$message({ message: "已取消", type: "info" });
                })
        },
        //修改
        saveEvent(saveData) {
            this.inquiryPackageFlag = true;
            this.$api.queryByIds(saveData.row.ywcxxxbId, (res) => {
                this.$nextTick(() => {
                    this.$refs.businessInquiryPackage.changeSearchName({
                        searchName: res.data.searchName,
                        ywcxxxbId: res.data.ywcxxxbId,
                        sort: res.data.sort,
                        remark: res.data.remark
                    }, true)
                })
            }, (err) => {
                this.$message.error(err.data.msg)
            })
        },
        //删除
        deleteEvent(deleteData) {
            this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then((res) => {
                    this.$api.deleteSearchs(deleteData.row.ywcxxxbId, (res) => {
                        // if (res.data.code !== 200) return this.$message.error(res.data.msg)
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.inquiryList = [];
                        this.postInquiryList()
                    }, (err) => {
                        this.$message.error(err.response.data.msg)
                    })
                })
                .catch((err) => {
                    this.$message({ message: "已取消", type: "info" });
                });
        },
        //选中行
        selectChange(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.ywcxxxbId)
            }
        },
        //全选
        selectAll(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.ywcxxxbId)
            }
        },
        //关闭业务查询弹窗
        inquiryPackageClose() {
            this.inquiryPackageFlag = false;
        }
    },
};
</script>
