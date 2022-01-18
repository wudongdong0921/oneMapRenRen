<template>
    <el-form>
        <el-form-item style="text-align: center;" prop="ghcgId">
            <el-select style="width: 80%;" v-model="ghcgId" placeholder="请选择规划成果类型">
                <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item style="text-align: center;">
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="clickClose">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            ghcgId: null,
            dicId: null,
            list: [],
        }
    },
    methods: {
        init(data) {
            this.dicId = data;
        },
        // 查询规划成果
        getPlanResultType() {
            this.$api.getPlanResultType({}, res => {
                this.list = res
            })
        },

        submit() {
            console.log(this.ghcgId);
            console.log(this.dicId)
            if (!this.ghcgId) {
                return this.$message({
                    type: 'warning',
                    message: '请选择规划成果类型'
                })
            }
            const data = {
                ghcgId: this.ghcgId,
                dicId: this.dicId
            }

            this.$api.importResultType(data).then(res => {
                this.$message({
                    type: 'success',
                    message: '导入成功'
                })
                this.$emit("clickClose")
            }, (err) => {
                this.$message({
                    type: 'error',
                    message: '导入失败'
                })
            })
        },

        clickClose() {
            this.$emit("clickClose")
        }
    },
    mounted() {
        this.getPlanResultType();
    }
}
</script>
