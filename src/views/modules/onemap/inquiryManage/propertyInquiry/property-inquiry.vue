<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item>
                    <el-input clearable v-model="param.propertyName" placeholder="查询名称"></el-input>
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

            <el-table :data="inquiryList" border style="width: 100%" @selection-change="selectChange" @select-all="selectAll">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="sort" label="排序" header-align="center" width="50" align="center"></el-table-column>
                <el-table-column prop="businessName" label="查询名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="250" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="conEvent(scope)">配置</el-button>
                        <el-button type="text" size="small" @click="saveEvent(scope)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :visible="inquiryPackageFlag" title="查询基础信息" :destroy-on-close="true" :before-close="inquiryPackageClose">
                <property-inquiry-package :changePageSize='changePageSize' v-if="inquiryPackageFlag" ref="propertyInquiryPackage" @resetInquiryData="postInquiryList" @clickClose="inquiryPackageClose"></property-inquiry-package>
            </el-dialog>
            <el-dialog :visible="configurationFlag" title="查询配置" :destroy-on-close="true" :before-close="configurationClose">
                <property-configuration :changePageSize='changePageSize' v-if="configurationFlag" ref="propertyConfiguration" @resetInquiryData="postInquiryList" @clickClose="configurationClose"></property-configuration>
            </el-dialog>
            <el-pagination :current-page="busunessUbqyuryData.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="busunessUbqyuryData.pageSize" :total="Number(busunessUbqyuryData.total)" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
            </el-pagination>
        </div>
    </el-card>
</template>
<script>
import propertyInquiryPackage from './propertyInquiryPackage';  // 修改
import propertyConfiguration from './propertyConfiguration';    // 配置

export default {
    components: {
        propertyInquiryPackage,
        propertyConfiguration
    },
    data() {
        return {
            // searchName: "",
            dataListLoading: false,
            busunessUbqyuryData: {},
            inquiryList: [],
            inquiryPackageFlag: false,
            configurationFlag: false,
            param: {
                pageNumber: 1,
                pageSize: 10,
                propertyName: ''
            },
            selectionList: []
        }
    },
    methods: {
        // 获取列表数据
        postInquiryList() {
            this.inquiryList = [];
            this.$api.inquiryList(this.param, res => {
                this.busunessUbqyuryData = res;
                for (let item of this.busunessUbqyuryData.list) {
                    this.inquiryList.push(item);
                }
                this.inquiryPackageFlag = false;
                this.configurationFlag = false;
            })
        },

        // 查询
        onSubmit(page) {
            if (page) this.param.pageNumber = 1;
            this.$api.inquiryList(this.param, (res) => {
                this.inquiryList = [];
                this.busunessUbqyuryData = res;
                for (let item of this.busunessUbqyuryData.list) {
                    this.inquiryList.push(item);
                }
            })
        },

        // 新增数据
        onAdd() {
            this.inquiryPackageFlag = true;
        },

        // 批量删除数据
        onDelet() {
            if (this.selectionList.length <= 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择要删除的选项'
                })
            }
            this.$confirm('此操作将删除数据，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.selectionList.join(',');
                this.$api.deleteDatas(data).then(res => {
                    // if(res.code != 200) {
                    //     return this.$message.error(res.msg);
                    // }
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.inquiryList = [];
                    this.postInquiryList();
                }, (err) => {
                    this.$message.error(err.msg);
                })
            }).catch(err => {
                this.$message({ type: 'info', message: '已取消' })
            })
        },

        // 选择项发生变化
        selectChange(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.sxcxId);
            }
        },

        // 勾选全部选择项
        selectAll(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.sxcxId);
            }
        },

        // 配置
        conEvent(scope) {
            this.configurationFlag = true;
            let data = scope.row.sxcxId;
            this.$api.propertySearchShowConfigs(data, (res) => {
                this.$nextTick(() => {
                    this.$refs.propertyConfiguration.init(res, data);
                })
            })
        },

        // 修改
        saveEvent(scope) {
            this.inquiryPackageFlag = true;
            let data = scope.row.sxcxId;
            this.$api.getPropertyInfo(data, (res) => {
                this.$nextTick(() => {
                    this.$refs.propertyInquiryPackage.init(res)
                })
            })
        },

        // 单个删除
        deleteEvent(data) {
            this.$confirm("此操作将删除该数据,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteDatas(data.row.sxcxId, (res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.inquiryList = [];
                    this.postInquiryList();
                },(res)=>{
                    this.$message.error(err.response.data.msg)
                })
            })
        },

        //更改每页显示条数
        changePageSize(e) {
            this.param.pageSize = e;
            this.postInquiryList();
        },

        // 切换当前页
        currentChange(e) {
            this.param.pageNumber = e;
            this.postInquiryList()
        },

        //关闭业务查询弹窗
        inquiryPackageClose() {
            this.inquiryPackageFlag = false;
            this.postInquiryList();
        },

        // 关闭配置弹窗
        configurationClose() {
            this.configurationFlag = false;
            this.postInquiryList();
        }

    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
        this.postInquiryList();
    }
}
</script>
