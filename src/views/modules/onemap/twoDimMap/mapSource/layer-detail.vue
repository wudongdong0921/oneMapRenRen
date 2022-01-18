<template>
    <div>
        <el-dialog title="数据源应用明细" :visible.sync="modifyVisible" width="500px">
            <el-table :data="list" style="width: 100%">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="specialName" label="专题名称" align="center"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="close">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import qs from "qs";
export default {
    data() {
        return {
            modifyVisible: false,
            dataForm: {
                sjyId: "",
                limit: "100",
                page: "1",
            },
            list: [],
        };
    },
    methods: {
        close() {
            this.modifyVisible = false;
            this.list = [];
        },
        init() {
            this.modifyVisible = true;
            this.$apis.selectDataSourceList(this.dataForm, (res) => {
                this.list = res;
            }, (err) => {})
        },
    },
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
    }
};
</script>

<style>
</style>
