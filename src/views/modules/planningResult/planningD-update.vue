<template>
<el-form ref="form" :model="dataForm" :rules="rules" v-loading="loading">
    <!-- <el-form-item label="编号:" label-width="130px" prop="ghxzqhId">
        <el-input v-model="dataForm.ghxzqhId" clearable readonly></el-input>
    </el-form-item> -->
    <el-form-item label="行政区划编号:" label-width="130px" prop="xzqhId">
        <el-input v-model="dataForm.xzqhId" clearable readonly></el-input>
    </el-form-item>
    <el-form-item label="行政区划名称:" label-width="130px" prop="adName">
        <el-input v-model="dataForm.adName" clearable readonly></el-input>
    </el-form-item>
    <!-- <el-form-item label="规划成果类型编号:" label-width="130px" prop="ghcglxId">
        <el-input v-model="dataForm.ghcglxId" clearable readonly></el-input>
    </el-form-item> -->
    <el-form-item label="成果信息编号:" label-width="130px" prop="cgxxbhId">
        <el-input v-model="dataForm.cgxxbhId" clearable readonly></el-input>
    </el-form-item>
    <el-form-item label="版本号:" label-width="130px" prop="versionNumber">
        <el-input v-model="dataForm.versionNumber" clearable readonly></el-input>
    </el-form-item>
    <!-- <el-form-item label="排序:" label-width="130px" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0"></el-input-number>
    </el-form-item> -->

    <el-form-item label="备注" label-width="130px" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" clearable></el-input>
    </el-form-item>
    <el-form-item label=" ">

        <el-button type="primary" @click="submit()" style="float:right;">确定</el-button>
        <el-button @click="closeEvent" style="float:right;margin-right:10px">取消</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import apis from './apis'
export default {
    //import引入的组件
    components: {},
    data() {
        return {
            dataForm: {
                ghxzqhId: '',
                xzqhId: "",
                adName: "",
                ghcglxId: "",
                cgxxbhId: "",
                versionNumber: "",
                sort: 0,
                remark: ""
            },
            rules: {},
            loading: true
        };
    },
    //方法集合
    methods: {
        initData(data) {

            apis.PlanningDistrictInfo(data.ghxzqhId).then(res => {
                this.loading = false;
                this.dataForm = res.data
            })

        },
        submit() {
            apis.updatePlanningDistrict({
                'ghxzqhId': this.dataForm.ghxzqhId,
                'remark': this.dataForm.remark,
                'sort': this.dataForm.sort,

            }).then(res => {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.closeEvent()
            })
        },
        closeEvent() {
            this.$emit("closeE")
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
}
</script>

<style >
</style>
