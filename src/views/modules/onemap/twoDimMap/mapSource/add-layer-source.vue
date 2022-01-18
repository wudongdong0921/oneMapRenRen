<template>
    <!-- // 新建数据源-->
    <div>
        <el-dialog :title="title" :visible.sync="visible" :destroy-on-close="true">
            <el-form :model="dataForm1" :rules="layerRule" ref="ruleForm">
                <el-form-item prop="sjyName" label="数据源名称" :label-width="formLabelWidth">
                    <el-input v-model="dataForm1.sjyName" maxlength="50" show-word-limit placeholder="数据源名称"></el-input>
                </el-form-item>
                <el-form-item prop="dataType" label="数据库类型" :label-width="formLabelWidth">
                    <el-select style="width:100%" v-model="dataForm1.dataType" placeholder="请选择">
                        <el-option
                            v-for="item in databaseType"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="iserverAddress"
                    label="Iserver数据服务地址"
                    :label-width="formLabelWidth"
                >
                    <el-input :disabled='iserverAddressFlag' maxlength="300" show-word-limit v-model="dataForm1.iserverAddress" placeholder="数据服务地址"></el-input>
                    <div
                        style="color:red"
                    >例如：http://60.205.207.160:38056/iserver/services/data-xzqhsy/rest/data/datasources/dltbjwd</div>
                </el-form-item>
                <el-form-item prop="databaseAddress" label="数据库地址" :label-width="formLabelWidth">
                <el-input maxlength="33" show-word-limit v-model="dataForm1.databaseAddress" placeholder="数据库地址"></el-input>
                    <!-- <div style="color:red">例如：http://60.205.207.160:38056/iserver/services/data-xzqhsy/rest/data/datasources/dltbjwd</div> -->
                </el-form-item>
                <el-form-item prop="portNumber" label="端口号" :label-width="formLabelWidth">
                    <el-input maxlength="16" show-word-limit v-model="dataForm1.portNumber" placeholder="端口号"></el-input>
                </el-form-item>
                <el-form-item prop="databaseName" label="数据库名称" :label-width="formLabelWidth">
                    <el-input maxlength="33" show-word-limit v-model="dataForm1.databaseName" placeholder="数据库名称"></el-input>
                </el-form-item>
                <el-form-item prop="accountNumber" label="账号" :label-width="formLabelWidth">
                    <el-input maxlength="33" show-word-limit v-model="dataForm1.accountNumber" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
                    <el-input maxlength="16" show-word-limit v-model="dataForm1.password" placeholder="密码" show-password></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="float:right">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="handleTestConnection">测试连接</el-button>
                <el-button type="primary" @click="dialogFormVisible">确 定</el-button>
            </div>
            <div style="clear:both">&nbsp;</div>
        </el-dialog>
    </div>
</template>

<script>
import apis from "./apis";
import qs from "qs";

const databaseType = [
    { id: "1", name: "Oracle", value: 1 },
    { id: "2", name: "Mysql", value: 2 },
    // { id: "3", name: "Hbase", value: 3 },
    { id: "4", name: "Gp", value: 4 },
];
export default {
    data() {
        return {
            title: "新建数据源",
            visible: false,
            dataList: [],
            // mixinViewModuleOptions: {
            //     getDataListURL: "layer/selectLayerDataInfoList",
            //     getDataListIsPage: true,
            //     deleteURL: "/SysEnclosure/saveSysEnclosure",
            //     deleteIsBatch: true,
            //     method: "post",
            //     treeBool: true,
            // },
            dataForm: {},
            dataForm1: {
                sjyId: "",
                sjyName: "",
                dataType: "",
                iserverAddress: "",
                databaseAddress: '', // 数据库地址
                portNumber: '', // 端口号
                databaseName: '', // 数据库名称
                accountNumber: '', // 账号
                password: '' // 密码
            },
            rules: {},
            databaseType: databaseType,
            sourceOption: "",
            formLabelWidth: "160px",
            iserverAddressFlag: false
        };
    },
    computed: {
        layerRule() {
            var validateServerName = (rule, value, callback) => {
                if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(value)) {
                    return callback(new Error("连接地址格式不正确"));
                }
                callback();
            };
            return {
                sjyName: [
                    {
                        required: true,
                        message: "请输入数据源名称",
                        trigger: "blur",
                    },
                ],
                databaseAddress: [
                    {
                        required: true,
                        message: "请输入数据库地址",
                        trigger: "blur",
                    },
                ],
                portNumber: [
                    {
                        required: true,
                        message: "请输入端口号",
                        trigger: "blur",
                    },
                ],
                databaseName: [
                    {
                        required: true,
                        message: "请输入数据库名称",
                        trigger: "blur",
                    },
                ],
                accountNumber: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                ],
                // dataType: [
                //     {
                //         required: true,
                //         message: "请选择数据库类型",
                //         trigger: "change",
                //     },
                // ],
                iserverAddress: [
                    {
                        required: true,
                        message: "数据服务地址不能为空",
                        trigger: "blur",
                    },
                    {
                        validator: validateServerName,
                        trigger: "blur",
                    },
                ],
            };
        },
    },
    watch: {
        visible: function (newVal) {
            if (newVal === false) {
                this.dataForm1 = {
                    sjyId: "",
                    sjyName: "",
                    dataType: "",
                    iserverAddress: "",
                };
            }
        },
    },
    mounted() {
        this.title = '新建数据源'
        this.$apis = this.$API.get(['onemap:twoDimMap']);
    },
    methods: {
        init() {
            this.visible = true;
            const param = {
                sjyId: this.dataForm.id,
            };
            if (param.sjyId) {
                this.title = "修改数据源";
                this.dataForm1.sjyId = this.dataForm.id;
                this.$apis.selectLayerDataInfo({sjyId:param.sjyId},(res) => {
                    this.dataForm1 = res
                },(err) => {
                    
                })

            }else{
               this.title = '新建数据源' 
            }
            let par = {
                sjyId: this.dataForm.id,
                limit: "100",
                page: "1",
            }

            this.$apis.getBaseMapList(par, (res) => {
                if(res.length) this.iserverAddressFlag = true
                else this.iserverAddressFlag = false
            },(err) => {})
    
        },
        dialogFormVisible() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$apis.addLayerDataInfo(this.dataForm1, (res) => {
                        this.visible = false;
                            this.$message({
                                type: "success",
                                message: "操作成功",
                            });
                            this.$emit("refreshDataList");
                    }, (err) => {
                        this.$message({
                            type: "error",
                            message: err.msg,
                        });
                    })

                }
            });
        },
        sourceOptions(val, text) {
            for (let i = 0; i < this.source.length; i++) {
                if (val === this.source[i].value) {
                    this.sourceOption = this.source[i].children;
                }
            }
        },
        // 测试连接
        handleTestConnection() {
            this.$apis.TestConnection(this.dataForm1, (res) => {
                // console.log(res);
                this.$message({
                    message: "连接成功",
                    type: "success",
                    duration: 2000,
                    onClose: () => {},
                });
            }, (err) => {
                this.$message({
                    type: "error",
                    message: err.msg,
                });
            });
        },
    },
};
</script>

<style></style>
