<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item>
                    <el-input clearable v-model="param.mapName" placeholder="查询名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelete">删除</el-button>
                </el-form-item>

                <!-- 测试关联弹窗 -->
                <!-- <el-form-item>
                    <el-button type="text" size="small" @click="relativeEvent(1)">关联</el-button>
                </el-form-item> -->

            </el-form>

            <el-table :data="inquiryList" border style="width:100%" @selection-change="selectChange" @select-all="selectAll">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="mapName" label="查询名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="250"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="relativeEvent(scope)">关联</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="busunessUbqyuryData.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="busunessUbqyuryData.pageSize" :total="Number(busunessUbqyuryData.total)" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange"></el-pagination>

            <el-dialog :visible="addDataFlag" title="新增" :destory-on-close="true" :before-close="AddDataClose">
                <!-- @resetInquiryData="postInquiryList" -->
                <add-relation v-if="addDataFlag" ref="addRelation" @clickClose="AddDataClose"></add-relation>
            </el-dialog>
            <el-dialog :visible="relativeFlag" title="关联文档" :destory-on-close="true" :before-close="relativeClose">
                <relation-manage v-if="relativeFlag" ref="relationManage" @clickClose="relativeClose"></relation-manage>
            </el-dialog>

        </div>
    </el-card>
</template>

<script>
import addRelation from "./add-relation.vue";
import relationManage from "./relation-manage.vue";
export default {
    components: {
        addRelation,
        relationManage
    },
    data() {
        return {
            dataListLoading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
                mapName: '',
                dtxxbId: ''
            },
            inquiryList: [],
            busunessUbqyuryData: {},

            selectionList: [],
            addDataFlag: false,
            relativeFlag: false,
        }
    },
    methods: {
        // 获取列表数据
        postInquiryList() {
            this.$api.DocfindList(this.param, data => {
                if (data.list.length !== 0) {
                    this.inquiryList = data.list;
                    this.busunessUbqyuryData = {
                        pageNum: data.pageNum,
                        total: data.total
                    }
                } else {
                    this.inquiryList = [];
                }
            });
        },

        // 查询
        onSubmit() {
            this.postInquiryList()
        },

        // 新增
        onAdd() {
            this.addDataFlag = true
        },

        // 批量删除
        onDelete() {
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
                this.deleteItem(data)
            }).catch(err => {
                this.$message({ type: 'info', message: '已取消' })
            })
        },

        // 表格选项发生变化
        selectChange(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.id);
            }
        },

        // 表格全选
        selectAll(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.id);
            }
        },

        //  关联
        relativeEvent(scope) {
            this.relativeFlag = true;
            this.$nextTick(() => {
                this.$refs.relationManage.init(scope.row)
            })
            // let data = scope.row.id;

            // 请求
        },

        // 删除
        deleteEvent(scope) {
            this.$confirm("此操作将删除该数据,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                this.deleteItem(scope.row.id)
            })
        },

        // 更改每页的条数
        changePageSize(e) {
            this.param.pageSize = e;
            this.postInquiryList()
        },

        // 切换当前页
        currentChange(e) {
            this.param.pageNum = e;
            this.postInquiryList();
        },

        // 关闭新增弹窗
        AddDataClose() {
            this.addDataFlag = false;
            this.postInquiryList();
        },

        // 关闭关联弹窗
        relativeClose() {
            this.relativeFlag = false;
            this.postInquiryList()
        },
        deleteItem(ids) {
            this.$api.deleteItem({ ids: ids }, res => {
                if (res == null) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
                this.postInquiryList()
            })
        },
    },

    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
        this.postInquiryList();
    }
}
</script>

</sc>