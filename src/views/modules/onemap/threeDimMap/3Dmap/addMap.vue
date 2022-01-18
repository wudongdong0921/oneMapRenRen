<template class="mapmana">
    <el-form v-loading="loading" ref="form" :model="dataForm" :rules="rules">
        <el-form-item label="地图名称:" label-width="120px" prop="mapName">
            <el-input v-model="dataForm.mapName" clearable></el-input>
        </el-form-item>
        <el-form-item label="地图地址:" label-width="120px" prop="mapAddress">
            <el-input :maxlength="500" show-word-limit v-model="dataForm.mapAddress" clearable></el-input>
            <div style="color: red">
                例如：http://192.168.0.38:8090/iserver/services/3D-BaiShanShiJiangYuanQu/rest/realspace/datas/Config
            </div>
        </el-form-item>
        <el-form-item label="地图类型:" label-width="120px" prop="mapType">
            <el-select v-model="dataForm.mapType" clearable>
                <el-option v-for="item in mapTypeList" :key="item.id" :value="item.id" :label="item.label">{{ item.label }}</el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="地图显示排序" label-width="120px" prop="mapOrder">
            <el-input-number v-model="dataForm.mapOrder" ref="baseMapSort" controls-position="right" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="显示级别" label-width="120px" required>
            <el-col :span="11">
                <el-form-item prop="minShowLevel">
                    <el-input v-model.number="dataForm.minShowLevel"></el-input>
                </el-form-item>
            </el-col>
            <el-col style="text-align:center" :span="2">-</el-col>
            <el-col :span="11">
                <el-form-item prop="maxShowLevel">
                    <el-input v-model.number="dataForm.maxShowLevel"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>

        <el-form-item label="启用状态" label-width="120px">
            <el-switch v-model="dataForm.status" active-text="ON" inactive-text="OFF" active-value='1' inactive-value='0'></el-switch>
        </el-form-item>

        <el-form-item label="三维默认显示" label-width="120px">
            <el-switch v-model="dataForm.isShow" active-text="ON" inactive-text="OFF" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item label=" ">
            <el-button type="primary" @click="submit()" style="float: right">确定</el-button>
            <el-button @click="closeEvent" style="float: right; margin-right: 10px">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { isURL } from "@/utils/validate";

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入地图地址"));
            } else {
                if (!isURL(value)) {
                    callback(new Error("地图地址格式不正确"));
                }
                callback();
            }
        };
        var showLevel = (rule, value, callback) => {
            if (typeof (value) !== 'number' || value > 24 || value < 1) {
                callback(new Error("显示级别不正确，请填写1-24范围内正整数"))
            }
            callback();
        }
        return {
            loading: false,
            dataForm: {
                tdDtxxbId: null,
                mapName: "",
                mapAddress: null,
                mapType: 0,
                mapOrder: 0,
                status: 1,
                tdDtxxbId: "",  // 可以识别地图的唯一的id
                isShow: 0,
                minShowLevel: 1,
                maxShowLevel: 24,
            },
            mapTypeList: [
                {
                    label: "倾斜摄影(S3MB)",
                    id: 0,
                },
                {
                    label: "三维地形",
                    id: 1,
                },
            ],
            dataSheetList: [],
            rules: {
                mapName: [
                    {
                        required: true,
                        message: "请输入地图名称",
                        trigger: "blur",
                    },
                ],
                mapAddress: [
                    {
                        required: true,
                        message: "请输入地图地址",
                        trigger: "blur",
                    },
                    {
                        validator: validatePass,
                        trigger: "blur",
                    },
                ],
                mapType: [
                    {
                        required: true,
                        message: "请选择地图类型",
                        trigger: "blur",
                    },
                ],
                mapOrder: [
                    {
                        type: "number",
                        message: "序号必须为数字",
                        trigger: "blur",
                    },
                ],
                minShowLevel: [
                    { required: true, message: "请填写最小区间值" },
                    { validator: showLevel, trigger: ["change", "blur"] }
                ],
                maxShowLevel: [
                    { required: true, message: "请填写最大区间值" },
                    { validator: showLevel, trigger: ["change", "blur"] }
                ]
            },
            dialogConfig: false,
        };
    },
    //方法集合
    methods: {
        closeConfig() {
            this.dialogConfig = false;
        },
        closeEvent() {
            this.$refs["form"].resetFields();
            this.$emit("closeDailog");
        },
        init(data) {
            if (data) {
                this.getMapDetail(data.tdDtxxbId);
            }
        },
        getMapDetail(id) {
            this.$api.getMapDetail(id, (res) => {
                this.loading = false;
                res.mapType = parseInt(res.mapType);
                res.mapOrder = parseInt(res.mapOrder);
                res.minShowLevel = parseInt(res.minShowLevel);
                res.maxShowLevel = parseInt(res.maxShowLevel);
                // res.status = parseInt(res.status);
                this.dataForm = res;
            });
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$api.updateMap(this.dataForm, (data) => {
                        //   console.log(data);
                        this.loading = false;
                        this.$message({
                            type: "success",
                            message: "操作成功",
                        });
                        if (data.code !== "500") {
                            this.closeEvent();
                        }
                    }, (erro) => {
                        this.loading = false;
                    })
                }
            });
        },
    },

    mounted() {
        this.$api = this.$API.get(['onemap:threeModule']);
        this.init();
    },
};
</script>

<style >
.mapmana .el-select {
    display: block;
}
</style>
