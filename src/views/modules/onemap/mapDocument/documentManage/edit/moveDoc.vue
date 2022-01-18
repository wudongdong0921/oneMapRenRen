<template>
    <div>
        <el-form>
            <el-form-item>
                <el-cascader ref="cascader" style="width:80%;margin-left:50px" filterable :options="dicNameList" v-model="dicId" :props="{ checkStrictly: true, label: 'dicName', value: 'id' }" clearable></el-cascader>
            </el-form-item>
            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="submit">确定</el-button>
                <el-button @click="clickClose">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
    data() {
        return {
            dicNameList: [],
            ids: [],    // 文件id
            dicId: '',
            id: '',     // 文件夹id
            flag: false // 记录是否为移动文件
        }
    },
    methods: {
        init(data, flag) {
            this.flag = flag;
            if (flag) {
                this.ids = data;
            } else {
                this.id = data
            }

            this.getTree();
        },
        //文件夹树
        getTree() {
            // { dictId: this.$route.params.dictId.toString() , id: this.id.toString() }
            this.$api.docTree({id: this.$route.params.dictId.toString(),dictId:this.id  }, res => {
                this.dicNameList = this.deleteChildren(res);
            })
        },

        deleteChildren(arr) {
            let childs = arr
            for (let i = childs.length; i--; i > 0) {
                if (childs[i].children) {
                    if (childs[i].children.length) {
                        this.deleteChildren(childs[i].children)
                    } else {
                        delete childs[i].children
                    }
                }
            }
            return arr
        },

        submit() {
            if (this.$refs.cascader.getCheckedNodes().length <= 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择要移动到的文件夹'
                })
            }
            const dicId = this.$refs.cascader.getCheckedNodes()[0].value;

            if (this.flag) {
                let data = [];
                for (const item of this.ids) {
                    data.push({
                        id: item,
                        dicId: dicId
                    })
                }
                this.$api.moveFile(data, res => {
                    this.$message({ message: "移动成功", type: "success" });
                    this.$emit("clickClose");
                }, ((err) => {
                    this.$message({ message: err.msg, type: "error" });
                }))
            } else {
                const data = {
                    pid: dicId,
                    id: this.id.toString()
                }
                this.$api.movefolder(data, res => {
                    this.$message({ message: "移动成功", type: "success" });
                    this.$emit("clickClose");
                }, (err) => {
                    this.$message({ message: err.msg, type: "error" });
                })
            }
        },

        // 关闭弹窗
        clickClose() {
            this.$emit("clickClose")
        },
    },
    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
    }
}
</script>