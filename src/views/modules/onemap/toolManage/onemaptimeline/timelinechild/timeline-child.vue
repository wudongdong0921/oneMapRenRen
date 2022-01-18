<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-sys__params" v-loading="dataListLoading">
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable v-model="timeName" placeholder="地图名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit">{{ $t('query') }}</el-button>
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
                <el-table-column prop="mapName" label="地图名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="timelineValue" label="年份" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="saveEvent(scope)">{{ $t('update') }}</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">{{ $t('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :visible="timePackage" :title="'地图管理'" :destroy-on-close="true" :before-close="timePackageClose">
                <timeline-child-modal v-if="timePackage" ref="changeCompontentMethods" @getTimeList='getTimeList' @timePackageClose='timePackageClose'></timeline-child-modal>
            </el-dialog>
            <el-pagination class="ok" :current-page="pagination.page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.limit" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import timelineChildModal from './timelineChildModal.vue'

export default {
    components: {
        timelineChildModal
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
        this.$apis = this.$API.get(['onemap:toolManage'])
        this.getTimeList()
    },
    methods: {
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
            this.$apis.pageOfData({
                pageNum: this.pagination.page,
                pageSize: this.pagination.pageSize,
                timelineTypeId: this.$route.params.sjzgllxbId
            }, (res) => {
                // this.$http.get(`/pictureTimelineController/getPageOfData?pageNum=${
                //     this.pagination.page}&pageSize=${
                //     this.pagination.pageSize}&timelineTypeId=${
                //     this.$route.params.sjzgllxbId}`)
                // .then(res=> {
                this.pagination.total = Number(res.data.total)
                this.forList(res.data.list)
            }, (err) => {
                this.$message.error(err.data.msg)
            })
        },
        //查询
        onSubmit() {
            this.$apis.pageOfData({
                timelineTypeId: this.$route.params.sjzgllxbId,
                pageNum: this.pagination.page,
                pageSize: this.pagination.pageSize,
                timelineValue: this.timeName
            }, (res) => {
                // this.$http.get(`/pictureTimelineController/getPageOfData?timelineTypeId=${
                //     this.$route.params.sjzgllxbId}&pageNum=${
                //     this.pagination.page}&pageSize=${
                //     this.pagination.pageSize}&timelineValue=${
                //     this.timeName
                //     }`)
                // .then(res=> {
                this.forList(res.data.list)
            }, (err) => {
                this.$message.error(err.data.msg)
            })
        },
        //循环插入列表数据
        forList(res) {
            this.timelineList = []
            for (let item of res) {
                this.timelineList.push(item)
            }
        },
        onAdd() {
            this.timePackage = true
        },
        //选中行
        selectChange(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.sjzglsjbId)
            }
        },
        //全选
        selectAll(selection) {
            this.selectionList = []
            if (selection.length === 0) return
            for (let item of selection) {
                this.selectionList.push(item.sjzglsjbId)
            }
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
                    if (this.selectionList.length <= 0) return
                    // this.$http.get("/pictureTimelineController/deletePictureTimelineDataById?sjzglsjbIds=" + this.selectionList).then((res) => {
                    this.$apis.deleteTimelineDataById({ sjzglsjbIds: this.selectionList.toString() }, (res) => {
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.getTimeList()
                    }, (err) => {
                        this.$message.error(err.data.msg)
                    })
                })
                .catch(err => {
                    this.$message({ message: "已取消", type: "info" });
                })
        },
        //修改
        saveEvent(saveData) {
            this.$apis.selectTimelineDataById({ sjzglsjbId: saveData.row.sjzglsjbId }, (res) => {
                // this.$http.get('/pictureTimelineController/selectPictureTimelineDataById?sjzglsjbId=' + saveData.row.sjzglsjbId)
                // .then(res=>{
                this.timePackage = true
                this.$nextTick(() => {
                    this.$refs.changeCompontentMethods.rowData({
                        sort: res.data.sort,
                        timelineLabel: res.data.timelineLabel,
                        timelineValue: res.data.timelineValue,
                        remark: res.data.remark,
                        timelineTypeId: res.data.timelineTypeId,
                        sjzglsjbId: res.data.sjzglsjbId,
                        mapName: res.data.mapName
                    })
                }, (err) => {})
                    .catch(err => {
                        this.$message.error(err.response.data.msg)
                    })
            })
        },
        //删除
        deleteEvent(deleteData) {
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(res => {
                    this.$apis.deleteTimelineDataById({ sjzglsjbIds: deleteData.row.sjzglsjbId }, (res) => {
                        // this.$http.post('/pictureTimelineController/deletePictureTimelineDataById?sjzglsjbIds=' + [deleteData.row.sjzglsjbId])
                        // .then(res=>{
                        this.$message({ message: "删除成功", type: "success" });
                        this.getTimeList()
                    }, (err) => {
                        this.$message.error(err.data.msg)
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
