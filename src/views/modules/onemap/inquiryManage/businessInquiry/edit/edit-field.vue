<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="onAdd">{{ $t("add") }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelet">{{
            $t("deleteBatch")
          }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="inquiryList" border style="width: 100%" @select-all="selectAll" @selection-change="selectChange">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="processOrder" label="排序" header-align="center" width="50" align="center"></el-table-column>
                <el-table-column prop="fieldName" label="业务展示字段名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="processTypeId" label="流程类型编号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="tableName" label="业务数据表" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="saveEvent(scope)">{{
              $t("update")
            }}</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">{{
              $t("delete")
            }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog width="1000px" :modal="false" :visible="newQueryFlag" :title="type === 0 ? '新建查询字段' : '修改查询字段'" :destroy-on-close="true" :before-close="newQueryClose">
                <query-field @getList="getList" :processList="processList" v-if="newQueryFlag" ref="childComponent" :searchName="this.$route.params.searchName" :businessQueryId="this.$route.params.businessQueryId" @newQueryClose="newQueryClose"></query-field>
            </el-dialog>
            <el-pagination :current-page="pagination.page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.limit" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import queryField from "./queryField.vue";

export default {
    components: {
        queryField,
    },
    data() {
        return {
            inquiryName: "",
            dataListLoading: false,
            inquiryList: [],
            newQueryFlag: false,
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
            },
            selectionList: [],
            processList: [],
            dataSheetSelectList: [],
            fieldSelectList: [],
            type: 0,
        };
    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
        this.getList();
        this.getProcess();
    },
    methods: {
        //切换分页
        changePageSize(e) {
            this.pagination.limit = e;
            this.getList();
        },
        //切换当前页
        currentChange(e) {
            this.pagination.page = e;
            this.getList();
        },
        //循环插入数据
        forList(res) {
            this.inquiryList = [];
            for (let item of res) {
                this.inquiryList.push(item);
            }
        },
        //获取列表数据
        getList() {
            this.$api.getPageByIds({
                page: this.pagination.page,
                limit: this.pagination.limit,
                businessQueryId: this.$route.params.businessQueryId
            }, (res) => {
                // if (res.data.code !== 200) return this.$message.error(res.data.msg);
                this.pagination.total = Number(res.data.total);
                this.forList(res.data.list);
            })
        },
        //批量删除
        onDelet() {
            if (this.selectionList.length <= 0) return this.$message({ type: 'warning', message: '请选择要删除的选项' })
            this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then((res) => {
                    if (this.selectionList.length <= 0) return;
                    this.$api.deleteProcesss({ ywlcxxbIds: this.selectionList.toString() }, (res) => {
                        // console.log(res);
                        // if (res.data.code !== 200)
                        //     return this.$message.error(res.data.msg);
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.inquiryList = [];
                        this.getList();
                    }, (err) => {
                        this.$message.error(err.msg);
                    })
                })
        },
        //新增
        onAdd() {
            this.type = 0;
            this.newQueryFlag = true;
        },
        //获取流程下拉数据
        getProcess() {
            this.$api.getFlowDefLists({}, res => {
                for (let item of res) {
                    this.processList.push(item);
                }
            })
        },
        //修改
        saveEvent(saveData) {
            this.type = 1;
            this.newQueryFlag = true;
            this.$api.getProcessByIds({ ywlcxxbId: saveData.row.ywlcxxbId }, (res) => {
                this.$nextTick(() => {
                    this.$refs.childComponent.changeSearchName(
                        {
                            sort: res.processOrder,
                            processTypeId: res.processTypeId,
                            businessData: res.businessData,
                            field: res.showBusiness,
                            ywlcxxbId: res.ywlcxxbId,
                        },
                        true
                    );
                });
            }, (err) => {
                this.$message.error(err.response.data.msg);
            });
        },
        //删除
        deleteEvent(deleteData) {
            this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$api.deleteProcesss({ ywlcxxbIds: deleteData.row.ywlcxxbId }, (res) => {
                        // console.log(res);
                        // if (res.data.code !== 200)
                        //     return this.$message.error(res.data.msg);
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.inquiryList = [];
                        this.getList();
                    }, (err) => {})
                })
        },
        //选中行
        selectChange(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.ywlcxxbId);
            }
        },
        //全选
        selectAll(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.ywlcxxbId);
            }
        },
        //关闭业务查询字段弹窗
        inquiryPackageClose() {
            this.inquiryPackageFlag = false;
        },
        //关闭新建查询字段
        newQueryClose() {
            this.newQueryFlag = false;
        },
    },
};
</script>
