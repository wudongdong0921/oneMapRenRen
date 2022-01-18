<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable v-model="timeName" placeholder="时间轴名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit(1)">{{ $t('query') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onAdd">{{ $t('add') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelet">{{ $t('deleteBatch') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="timelineList" border style="width: 100%" @select-all='selectAll' @selection-change='selectChange'>
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="sort" label="排序" header-align="center" width="50" align="center"></el-table-column>
                <el-table-column prop="timelineName" label="时间轴名称" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div style="cursor: pointer;color: #17B3A3;" @click="toChild(scope.row)">{{scope.row.timelineName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="byInterval" label="轮播间隔" header-align="center" align="center"></el-table-column>
                <el-table-column prop="startState" label="启用状态" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="saveEvent(scope)">{{ $t('update') }}</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">{{ $t('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :visible="timePackage" :title="'时间轴配置'" :destroy-on-close="true" :before-close="timePackageClose">
                <time-axis ref="changeCompontentMethods" v-if="timePackage" @getTimeList='getTimeList' @timePackageClose='timePackageClose'></time-axis>
            </el-dialog>
            <el-pagination :current-page="pagination.page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.limit" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import timeAxis from './timeAxis.vue'
import { addDynamicRoute } from '@/router'

export default {
    components: {
        timeAxis
    },
    data() {
        return {
            dataListLoading: false,
            timelineList: [],
            timePackage: false,
            timeName: '',
            mapName: '',
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            indexMethod: 5,
            selectionList: []
        };
    },
    mounted() {
        this.$apis = this.$API.get(['onemap:toolManage']);
        this.getTimeList()
    },
    methods: {
        //子路由跳转
        toChild(row) {
            const routeParams = {
                routeName: `${this.$route.name}__${row.sjzgllxbId}`,
                title: '时间轴管理 - ' + row.timelineName,
                path: 'onemap/toolManage/onemaptimeline/timelinechild/timeline-child',
                params: {
                    sjzgllxbId: row.sjzgllxbId
                }
            }
            // 动态路由
            addDynamicRoute(routeParams, this.$router)
        },
        //更改每页显示条数
        changePageSize(e) {
            this.pagination.pageSize = e;
            this.getTimeList();
        },
        //切换当前页
        currentChange(e) {
            this.pagination.page = e;
            this.getTimeList()
        },
        //获取时间轴列表
        getTimeList() {
            let data = {
                pageNum: this.pagination.page,
                pageSize: this.pagination.pageSize
            }
            this.$apis.selectTimeList(data, (res) => {
                if (res.code !== 200) this.$message.error(res.msg)
                this.pagination.total = Number(res.data.total)
                this.forList(res.data.list)
            })
        },
        //查询
        onSubmit(page) {
            if (page) this.pagination.page = 1
            let data = {
                timelineName: this.timeName,
                pageNum: this.pagination.page,
                pageSize: this.pagination.pageSize
            }
            this.$apis.selectTimeList(data, (res) => {
                this.forList(res.data.list)
            })
        },
        //循环插入列表数据
        forList(res) {
            this.timelineList = []
            for (let item of res) {
                if (item.startState === '0') {
                    item.startState = '启用'
                } else if (item.startState === '1') {
                    item.startState = '禁用'
                }
                this.timelineList.push(item)
            }
        },
        onAdd() {
            this.timePackage = true
        },
        //批量删除
        onDelet() {
            if (this.selectionList.length <= 0) return this.$message({ type: 'warning', message: '请选择要删除的选项' })
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(res => {
                    if (this.selectionList.length <= 0) return this.$message({ message: '请选择要删除的选项', type: 'warning' })
                    this.$apis.deleteTimeline({ sjzgllxbIds: this.selectionList.toString() }, (res) => {
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.getTimeList()
                    }, (err) => {
                        this.$message.error(err.response.data.msg)
                    })
                })
                .catch(err => {
                    this.$message({ message: "已取消", type: "info" });
                })
        },
        //选中行
        selectChange(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.sjzgllxbId)
            }
        },
        //全选
        selectAll(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.sjzgllxbId)
            }
        },
        //修改
        saveEvent(saveData) {
            this.timePackage = true
            // this.$http.get('/pictureTimelineController/selectPictureTimelineTypeById?sjzgllxbId=' + saveData.row.sjzgllxbId)
            //     .then(res => {({}, 
            this.$apis.selectTimeline({ sjzgllxbId: saveData.row.sjzgllxbId }, (res) => {
                this.$nextTick(() => {
                    this.$refs.changeCompontentMethods.rowData({
                        sjzgllxbId: res.data.sjzgllxbId,
                        timelineName: res.data.timelineName,
                        byInterval: res.data.byInterval,
                        startState: res.data.startState,
                        sort: res.data.sort,
                        remark: res.data.remark
                    })
                })
            }, (err) => {
                this.$message.error(err.response.data.msg)
            })
        },
        deleteEvent(deleteData) {
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(res => {
                    this.$apis.deleteTimeline({ sjzgllxbIds: deleteData.row.sjzgllxbId }, (res) => {
                        this.$message({ message: "删除成功", type: "success" });
                        this.getTimeList()
                    }, (err) => {
                        this.$message.error(err.response.data.msg)
                    })
                })
                .catch(err => {
                    this.$message({ message: "已取消", type: "info" });
                })
        },
        //关闭新增弹窗
        timePackageClose() {
            this.timePackage = false
        }
    },
};
</script>
