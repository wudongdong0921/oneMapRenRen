<template>
    <div>
        <el-form :model="formData" ref="elForm" label-width="100px" :rules="rules">
            <el-form-item label="选择地图" prop="chooseMap">
                <el-select v-model="formData.chooseMap" multiple placeholder="请选择地图" style="width:100%">
                    <el-option v-for="item in formData.mapList" :key="item.mapId" :label="item.mapName" :value="item.mapId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="text-align:right; margin-top: 50px">
                <el-button @click="clickClose">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                chooseMap: [],
                mapList: []
            },
            rules: {
                chooseMap: [{ required: true, message: '请选择地图', trigger: ['blur', 'change'] }]
            }

        }
    },
    methods: {
        // 初始化
        init(data) {
            this.$api.getAddMapList({}, data => {
                this.formData.mapList = data;
            })
        },

        // 取消
        clickClose() {
            this.$emit('clickClose');
        },

        save() {
            this.$refs.elForm.validate(async (valid) => {
                if (valid) {
                    this.$api.addRelation(this.formData.chooseMap, res => {
                        if (res == null) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        }
                        this.$emit('clickClose');
                    })
                }
            });
        },
    },
    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
        this.init();
    }
}
</script>