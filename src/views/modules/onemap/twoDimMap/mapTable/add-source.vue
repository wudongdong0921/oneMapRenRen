<template>
    <div>
        <el-dialog title="添加数据" :visible.sync="visible" :destroy-on-close="true">
            <el-form :model="dataForm" ref="form" :rules="layerRule" v-loading="dialogLading">
                <el-form-item prop="sjyId" label="数据源" :label-width="formLabelWidth">
                    <el-select style="width:100%" v-model="dataForm.sjyId" placeholder="请选择" @change="sourceOptions">
                        <el-option v-for="item in dataTree" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sjbEnglishName" label="数据表" :label-width="formLabelWidth">
                    <el-select style="width:100%" v-model="dataForm.sjbEnglishName" placeholder="请选择" @change="sheepOptions">
                        <el-option v-for="item in dataSheet" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sjbChineseName" label="中文名" :label-width="formLabelWidth">
                    <el-input v-model="dataForm.sjbChineseName" placeholder="中文名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ["closeEvent"],
    data() {
        return {
            visible: false,
            dialogLading: false,
            dataForm: {
                sjyId: "",
                sjbEnglishName: "",
                sjbChineseName: "",
                iserverTableName: "",
            },
            dataTree: [], // 数据源
            dataSheet: [], // 数据表
            sourceOption: "",
            formLabelWidth: "120px",
            layerRule: {
                sjyId: [{ required: true, message: "请选择数据源", trigger: "blur", },],
                sjbEnglishName: [{ required: true, message: "请选择数据表", trigger: "blur", },],
                sjbChineseName: [{ required: true, message: "请输入中文名", trigger: "blur", },],
            }
        };
    },
    watch: {
        visible: function (newVal) {
            if (newVal === false) {
                this.dataForm = {
                    sjyId: "",
                    sjbEnglishName: "",
                    sjbChineseName: "",
                    iserverTableName: "",
                };
            }
        },
    },
    created() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
        this.getSourceTree();
    },
    methods: {
        init() {
            this.visible = true;
            this.dialogLading = false;
            this.dataSheet = [];
        },
        // tree
        getSourceTree() {
            this.$apis.getLayerDataSourceList({}, (res) => {
                this.dataSheet = [];
                this.dataTree = res;
            }, (err) => {
                
            })
        },
        dialogFormVisible() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.dialogLading = true;
                    this.$apis.updataCaData(this.dataForm, (res) => {
                        this.dialogLading = false;
                        this.visible = false;
                        this.closeEvent();
                    }, (err) => {
                        this.dialogLading = false;
                        this.$message({
                            type: "error",
                            message: res.msg,
                        });
                    })

                    // this.$http["post"]("/layer/updataCaData", this.dataForm).then(
                    //     ({ data: res }) => {
                    //         this.dialogLading = false;
                    //         if (res.code === 200) {
                    //             this.visible = false;
                    //             this.closeEvent();
                    //         } else if (res.code === 500) {
                    //             this.$message({
                    //                 type: "error",
                    //                 message: res.msg,
                    //             });
                    //         }
                    //     }
                    // );
                }
            });
        },
        sourceOptions(val, text) {
            this.dataForm.sjbEnglishName=''
            const param = {
                sjyId: val,
            };
            this.dialogLading = true;
            this.$apis.selectSjbListBySjyId(param, (res) => {
                console.log(res)
                this.dialogLading = false;
                this.dataSheet = res.data;
            }, (err) => {
                this.dialogLading = false;
                this.$message({
                    type: "error",
                    message: err.msg,
                });
            })

            // this.$http["post"]("/layer/selectSjbListBySjyId", param).then(
            //     ({ data: res }) => {
            //         this.dialogLading = false;
            //         if (res.code === 200) {
            //             this.dataSheet = res.data;
            //         } else if (res.code === 500) {
            //             this.$message({
            //                 type: "error",
            //                 message: res.msg,
            //             });
            //         }
            //     }
            // );
        },
        // 数据表下拉
        sheepOptions(val) {
            this.dataForm.iserverTableName = val;
        },
    },
};
</script>

<style></style>
