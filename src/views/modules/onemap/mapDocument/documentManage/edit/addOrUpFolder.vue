<template>
    <el-form :model="dataForm" ref="elForm" label-width="100px" :rules="rules">
        <el-form-item label="上级菜单" prop="pName">
            <el-input readonly v-model="pName"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="dicName">
            <el-input v-model="dataForm.dicName" placeholder="请输入文件目录名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
            <el-input-number :min="0" v-model="dataForm.sort"></el-input-number>
        </el-form-item>
        <el-form-item style="text-align: center;" label-width="0">
            <el-button @click="clickClose">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            pName: '一级菜单',
            flag: true,
            dataForm: {
                pid: 0,
                dicName: null,
                id: null,
                sort: 0,
                dicColor: null,
                dicIcon: null
            },

            rules: {
                dicName: [{
                    required: true,
                    message: '请填写文件夹名称',
                    trigger: ["blur", "change"]
                }]
            }
        }
    },
    methods: {
        // 初始化
        init(data, flag) {
            this.$refs["elForm"].resetFields();
            this.flag = flag;
            if (!flag) {
                this.dataForm = {
                    pid: data.pid,
                    dicName: data.dicName,
                    id: data.id,
                    sort: data.sort || 0,
                    dicColor: data.dicColor,
                    dicIcon: data.dicIcon
                }
                this.getFolder()
            } else {
                this.dataForm.pid = data.id;
                this.pName = data.dicName;
            }
        },

        // 查询树
        getFolder() {
            this.$api.docTree({ id: this.$route.params.dictId.toString() }, res => {
                const treeData = res;
                let data = this.getTreePName(treeData, this.dataForm.pid);
                this.pName = data.dicName || '一级菜单';
            })
        },

        // 修改时查找该节点对应的父节点
        getTreePName(list, iid) {
            for (let item of list || []) {
                if (item.id == iid) return item
                const item_ = this.getTreePName(item.children, iid)
                if (item_) return item_
            }
        },

        save() {
            this.$refs["elForm"].validate((valid) => {
                if (valid) {
                    // 新增
                    if (this.flag) {
                        const data = {
                            pid: this.dataForm.pid,
                            dicName: this.dataForm.dicName,
                            sort: this.dataForm.sort
                        };

                        this.$api.getFolderSave(data, res => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.$emit("clickClose")
                        }, (err) => {
                            this.$message({
                                message: err.msg,
                                type: 'error'
                            });
                        })
                    } else {
                        // 修改
                        delete this.dataForm.pid;
                        this.$api.updateDocument(this.dataForm, res => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });

                            this.$emit("clickClose")
                        }, (err) => {
                            this.$message({
                                message: err.msg,
                                type: 'error'
                            });
                        })
                    }
                }
            })
        },

        clickClose() {
            this.$emit('clickClose');
        },
    },
    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
    }
}
</script>
