<template>
    <div>
        <el-form :model="formData" ref="elForm" label-width="100px" :rules="rules">

            <el-form-item label="查询名称" prop="businessName">
                <el-input v-model="formData.businessName" placeholder="请输入查询名称" clearable maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number :min="0" v-model="formData.sort"></el-input-number>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="formData.remark" placeholder="请输入备注" maxlength="30" show-word-limit clearable></el-input>
            </el-form-item>
            <el-form-item style="text-align:right; margin:50px 0 0 0;">
                <el-button @click="clickClose">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button> <!--  @click="sub" -->
            </el-form-item>
        </el-form>

    </div>
</template>

<script>


export default {
    data() {
        return {
            formData: {
                sxcxId: '',   // 属性查询id,新增属性没有
                businessName: '', // 查询名称
                sort: '', // 排序值
                remark: '', // 备注
            },

            rules: {
                businessName: { required: true, message: '请输入查询名称', trigger: ['blur', 'change'] },
                sort: { required: true, message: '请选择排序值', trigger: ['blur', 'change'] },
            },
        }
    },
    methods: {
        // 初始化
        init(data) {
            if (data) {
                this.formData = data;
            }
        },

        // 取消
        clickClose() {
            this.$emit('clickClose');
        },

        save() {
            this.$refs.elForm.validate(async (valid) => {
                if (valid) {
                    if (!this.formData.sxcxId) {
                        let data = {
                            sort: this.formData.sort,
                            businessName: this.formData.businessName,
                            remark: this.formData.remark
                        };
                        this.$api.insertOrUpdate(data, (res) => {
                            this.$message({
                                type: "success",
                                message: "添加成功"
                            })
                            this.$emit('resetInquiryData');
                        }, (err) => {
                            this.$message.error("添加失败");
                        })
                    } else {
                        let data = {
                            sxcxId: this.formData.sxcxId,
                            sort: this.formData.sort,
                            businessName: this.formData.businessName,
                            remark: this.formData.remark,
                        };
                        this.$api.insertOrUpdate(data, (res) => {
                            this.$message({
                                type: "success",
                                message: "修改成功"
                            })
                            this.$emit('resetInquiryData');
                        }, (err) => {
                            this.$message.error("修改失败");
                        })
                    }

                }
            });
        },
    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
        this.init();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
