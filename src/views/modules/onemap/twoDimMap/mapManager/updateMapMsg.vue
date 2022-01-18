<template>
    <el-dialog :visible.sync="visible" title="更新地图信息" :close-on-click-modal="false" :close-on-press-escape="false" :modal="false" width="1200px">
        <el-button type="primary" @click="handleAdd" style="margin-bottom: 10px; float: right;">新增</el-button>

        <el-table :data="dataList" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
            <el-table-column prop="dataName" label="数据名称" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.isEdit">
                        <el-input v-model="scope.row.dataName" maxlength="20"  placeholder="请输入数据名称"></el-input>
                    </span>
                    <span v-else> {{ scope.row.dataName }} </span>
                </template>
            </el-table-column>

            <el-table-column prop="dataSource" label="数据来源" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.isEdit">
                        <el-input v-model="scope.row.dataSource" maxlength="20" placeholder="请输入数据来源"></el-input>
                    </span>
                    <span v-else> {{ scope.row.dataSource }} </span>
                </template>
            </el-table-column>

            <el-table-column prop="updateTime" label="更新时间" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.isEdit">
                        <el-date-picker v-model="scope.row.updateTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择更新时间"></el-date-picker>
                    </span>
                    <span v-else> {{ scope.row.updateTime }} </span>
                </template>
            </el-table-column>

            <el-table-column prop="updateUser" label="更新人员" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.isEdit">
                        <el-input v-model="scope.row.updateUser" maxlength="5" placeholder="请输入更新人员"></el-input>
                    </span>
                    <span v-else> {{ scope.row.updateUser }} </span>
                </template>
            </el-table-column>

            <el-table-column prop="updates" label="更新内容" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.isEdit">
                        <el-input v-model="scope.row.updates" maxlength="20" placeholder="请输入更新内容"></el-input>
                    </span>
                    <span v-else> {{ scope.row.updates }} </span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="100px" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.isEdit">
                        <el-button size="mini" type="text" @click="handleSave(scope)">确定</el-button>
                        <el-button size="mini" type="text" @click="handleCancle(scope)">取消</el-button>
                    </template>
                    <template v-else>
                        <el-button size="mini" type="text" @click="handleEdit(scope)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope)">删除</el-button>
                    </template>

                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import api from './apis'

export default {
    data() {
        return {
            visible: false,
            dtxxbId: null,
            dataList: []
        }
    },
    methods: {
        init() {
            this.visible = true;
            this.findMapMsgList();
        },

        // 读取列表值
        findMapMsgList() {
            this.$apis.findMapMsgList(this.dtxxbId, (res) => {
                this.dataList = res;
            })
        },

        // 新增
        handleAdd() {
            for(const item of this.dataList) {
                if(item.isEdit){
                    return this.$message({
                        type: 'warning',
                        message: '还有未修改完成的信息'
                    })
                }
            }
            this.dataList.unshift({
                dataName: '',
                dataSource: '',
                updateTime: '',
                updateUser: '',
                updates: '',
                dtxxbId: this.dtxxbId,

                isEdit: true
            })
        },

        // 修改
        handleEdit(scope){
            for(const item of this.dataList) {
                if(item.isEdit){
                    return this.$message({
                        type: 'warning',
                        message: '还有未修改完成的信息'
                    })
                }
            }
            sessionStorage.setItem("oldMapMsg", JSON.stringify(scope.row))
            this.$set(scope.row, 'isEdit', true)
        },

        // 确认修改/新增
        handleSave(scope){
            // 校验信息
            if(scope.row.dataName.length <= 0){
                return this.$message({
                    type: 'warning',
                    message: '请填写数据名称'
                })
            }
            if(scope.row.dataSource.length <= 0){
                return this.$message({
                    type: 'warning',
                    message: '请填写数据来源'
                })
            }
            if(!scope.row.updateTime){
                return this.$message({
                    type: 'warning',
                    message: '请填写更新时间'
                })
            }

            scope.row.isEdit = false;
            delete scope.row.isEdit;
            this.$apis.saveMapUpdates(scope.row, (res) => {
                let message;
                if(scope.row.id) {
                    message = "修改成功"
                }else {
                    message = "添加成功"
                }
                this.$message({
                    type: 'success',
                    message: message
                })
                this.findMapMsgList();
            }, (err) => {
                scope.row.isEdit = true;
                this.$message({
                    type: 'success',
                    message: err.msg
                })
            })
        },

        // 取消
        handleCancle(scope) {
            if(scope.row.id) {
                const oldMapMsg = JSON.parse(sessionStorage.getItem("oldMapMsg"));
                scope.row.dataName = oldMapMsg.dataName;
                scope.row.dataSource = oldMapMsg.dataSource;
                scope.row.updateTime = oldMapMsg.updateTime;
                scope.row.updateUser = oldMapMsg.updateUser;
                scope.row.updates = oldMapMsg.updates;

                this.$set(scope.row, 'isEdit', false)
            }else {
                this.dataList.shift()
            }
        },

        // 删除
        handleDelete(scope) {
            this.$confirm("此操作将删除该数据,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.$apis.deleteMapMsg(scope.row.id, (res) => {
                    this.$message({
                        type: 'success',
                        message: "删除成功"
                    })
                    this.findMapMsgList();
                }, (err) => {})

            })

        }
    },
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
    }
}
</script>

<style>

</style>
