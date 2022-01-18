<template>
    <el-form ref="from" :model="dataForm" :rules="rules">
        <el-form-item label="查询名称" label-width="100px" prop="name">
            <el-input v-model="dataForm.name" placeholder="查询名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="100px" prop="sort">
            <el-input-number :min="0" v-model="dataForm.sort"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
            <el-input v-model="dataForm.remark" clearable></el-input>
        </el-form-item>
        <el-form-item style="text-align:right; margin:0; margin-top:50px;">
            <el-button @click="clickClose">取消</el-button>
            <el-button type="primary" @click="sub">确认</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    data() {
        return {
            dataForm: {
                name: '',
                sort: '',
                remark: ''
            },
            ywcxxxbId: '',
            flag: false,
            rules: {
                name: { required: true, message: '请输入', trigger: 'blur' },
                sort: { required: true, message: '请输入', trigger: 'blur' }
            }
        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
    },
    methods: {
        sub() {
            this.$refs["from"].validate(valid => {
                if (!valid) return
                if (!this.flag) {
                    this.$api.insertSearchs({
                        searchName: this.dataForm.name,
                        sort: this.dataForm.sort,
                        remark: this.dataForm.remark
                    }, (res) => {
                        // if (res.data.code === 200) {
                            this.$message({ message: '操作成功', type: "success" })
                            this.$emit('resetInquiryData')
                        // } else {
                        //     this.$message.error(res.data.msg)
                        // }
                    }, (err) => {
                        this.$message.error(err.data.msg)
                    })
                } else {
                    this.$api.updateSearchs({
                        ywcxxxbId: this.ywcxxxbId,
                        searchName: this.dataForm.name,
                        sort: this.dataForm.sort,
                        remark: this.dataForm.remark
                    }, (res) => {
                        // if (res.data.code !== 200) return this.$message.error(res.data.msg)
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        this.$emit('resetInquiryData')
                    }, (err) => {
                        this.$message.error(err.data.msg)
                    })
                }
            })
        },
        changeSearchName(data, flag) {
            this.flag = flag
            this.dataForm.name = data.searchName
            this.ywcxxxbId = data.ywcxxxbId
            this.dataForm.sort = data.sort
            this.dataForm.remark = data.remark
        },
        clickClose() {
            this.$emit('clickClose')
        }
    }
}
</script>