<template>
    <el-card shadow="never">
        <div>
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item>
                    <el-input clearable v-model="param.statisName" placeholder="查询名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getStatisList(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveEvent()">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelet">删除</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="inquiryList" border style="width: 100%" @selection-change="selectChange" @select-all="selectAll">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="sort" label="排序" header-align="center" width="50" align="center"></el-table-column>
                <el-table-column prop="statisName" label="统计名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="250" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="saveEvent(scope.row.id)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteEvent(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="busunessUbqyuryData.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="busunessUbqyuryData.pageSize"
                :total="Number(busunessUbqyuryData.total)"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="changePageSize"
                @current-change="currentChange"
            >
            </el-pagination>

            <el-dialog :visible="addOrUpdateFlag" :title="dialogTitle?'修改统计': '新增统计'" :destory-on-close="true" :before-close="addStatisticsClose">
                <addStatistics v-if="addOrUpdateFlag" ref="addStatistics" @refreshDataList="addStatisticsClose" ></addStatistics>
            </el-dialog>
            
        </div>
    </el-card>
</template>

<script>
import addStatistics from './add-statistics.vue'

export default {
    components: {
        addStatistics
    },
    data(){
        return {
            param: {
                pageNum: 1,
                pageSize: 10,
                statisName: ''
            },
            addOrUpdateFlag: false,
            busunessUbqyuryData: {},
            inquiryList: [],
            selectionList: [],
            dialogTitle: false,
        }
    },
    methods: {
        // 获取列表数据
        getStatisList(page) {
            if(page) {
                this.param.pageNum = page
            }else {
                this.param.pageNum = 1;
            }
            this.$api.getStatisList(this.param,res => {
                this.busunessUbqyuryData = res;
                this.inquiryList = res.list
            })

            this.addOrUpdateFlag = false;
        },

        onDelet() {
            if(this.selectionList.length <= 0) {
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
                this.$api.deleteStatis(data,res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getStatisList();
                })
                // .catch(err => {
                //     this.$message.error(err.msg);
                // })
            }).catch(err => {
                this.$message({ type:'info', message:'已取消' })
            })
        },

        // 选择项发生变化
        selectChange(selection){
            this.selectionList = [];
            if(selection.length === 0) return;
            for(let item of selection){
                this.selectionList.push(item.id);
            }
        },

        // 勾选全部选择项
        selectAll(selection){
            this.selectionList = [];
            if(selection.length === 0) return;
            for(let item of selection) {
                this.selectionList.push(item.id);
            }
        },

        saveEvent(data) {
            this.addOrUpdateFlag = true
            if(data) {
                this.dialogTitle = true
            }
            this.$nextTick(() => {
                this.$refs.addStatistics.init(data)
            })
        },

        deleteEvent(scope) {
            this.$confirm("此操作将删除该数据,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteStatis(scope.row.id,(res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getStatisList();
                })
                // .catch(err => {
                //     this.$message.error(err.response.data.msg)
                // })
            })
        },

        // 更改每页显示条数
        changePageSize(e) {
            this.param.pageSize = e;
            this.getStatisList();
        },

        // 切换当前页
        currentChange(e) {
            this.param.pageNum = e;
            this.getStatisList()
        },

        addStatisticsClose() {
            this.addOrUpdateFlag = false;
            this.dialogTitle = false;
            this.getStatisList()
        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:dataStatistics']);
        this.getStatisList()
    }
}
</script>
