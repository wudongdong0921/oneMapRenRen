<template class="mapmana">
    <el-form v-loading="loading" ref="form" :model="dataForm" :rules="rules" :inline="false">
        <el-form-item label="地图名称:" label-width="120px" prop="mapName">
            <el-input :maxlength="20" show-word-limit v-model="dataForm.mapName" clearable></el-input>
        </el-form-item>
        <el-form-item label="地图地址:" label-width="120px" prop="mapAddress">
            <el-input :maxlength="500" show-word-limit v-model="dataForm.mapAddress" clearable></el-input>
            <div style="color: red">
                例如：http://192.168.0.27:8090/iserver/services/map-zrzy_xzqh/rest/maps/hljxzqh%40zrzy_xzqh
            </div>
        </el-form-item>
        <el-form-item label="图例地址:" label-width="120px">
            <el-input :maxlength="500" show-word-limit v-model="dataForm.legendAddress" clearable></el-input>
            <div style="color: red">
                例如：http://192.168.0.38:8090/iserver/services/map-TDLY/rest/maps/龙沙区现状图
            </div>
        </el-form-item>
        <el-row :gutter="22">
            <el-col :span="12">
                <el-form-item label="地图数据类型:" label-width="120px" prop="mapDataType">
                    <el-select v-model="dataForm.mapDataType" clearable @change="mapDataTypeChange">
                        <el-option v-for="item in mapDataTypeList" :key="item.id" :value="item.id" :label="item.label">
                            {{ item.label }}</el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-form-item v-show="dynamicIsShow" label="动态投影" label-width="120px">
                    <el-switch v-model="dataForm.dynamicProjection" active-text="ON" inactive-text="OFF"
                        :active-value="activedy" :inactive-value="unActivedy" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-form-item label="数据服务地址:" label-width="120px" prop="mapServerName">
        <el-input v-model="dataForm.mapServerName" ref="baseMapSort" clearable></el-input>
        <div style="color:red">例如：http://192.168.0.27:8090/iserver/services/data-zrzy_xzqh/rest/data</div>
    </el-form-item> -->
        <el-form-item label="地图数据源:" label-width="120px" prop="sjyId">
            <el-select v-model="dataForm.sjyId" clearable @change="getSJB">
                <el-option v-for="item in dataSourceList" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}</el-option>
            </el-select>
        </el-form-item>

        <!-- <el-form-item label="地图识别地址" label-width="120px" prop="">
      <el-input
        :maxlength="500"
        show-word-limit
        v-model="dataForm.mapServerAddress"
        clearable
      ></el-input>
      <div style="color: red">
        例如：http://192.168.0.38:8090/iserver/services/map-TDLY/rest/maps/龙沙区现状图
      </div>
    </el-form-item> -->
        <el-form-item label="地图数据表:" label-width="120px" prop="sjbId">
            <!-- <el-input v-model="dataForm.sjbId" ref="baseMapSort" clearable></el-input> -->
            <el-select v-model="dataForm.sjbId" clearable>
                <el-option v-for="item in dataSheetList" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}</el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="地图显示排序" label-width="120px" prop="mapOrder">
            <!-- <el-input v-model.number="dataForm.mapOrder" clearable></el-input> -->
            <el-input-number v-model.number="dataForm.mapOrder" ref="baseMapSort" controls-position="right" :min="0">
            </el-input-number>
        </el-form-item>

        <!-- HLJSSJDXT-465 -->
        <el-form-item label="显示级别" label-width="120px" required>
            <el-col :span="11">
                <el-form-item prop="minShowLevel">
                    <el-input v-model.number="dataForm.minShowLevel"></el-input>
                </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
                <el-form-item prop="maxShowLevel">
                    <el-input v-model.number="dataForm.maxShowLevel"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>

        <!-- HLJSSJDXT-456 -->
        <el-form-item label="二维默认显示" label-width="120px">
            <el-switch v-model="dataForm.twoDimensionalIsdisplay" active-text="ON" inactive-text="OFF" active-value="1"
                inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item label="三维默认显示" label-width="120px">
            <el-switch v-model="dataForm.threeDimensionalIsdisplay" active-text="ON" inactive-text="OFF"
                active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item style="text-align: right;">
            <el-button type="primary" @click="submit()">确定</el-button>
            <el-button @click="updateMsg" >更新信息</el-button>
            <el-button @click="closeEvent">取消</el-button>
        </el-form-item>
        <updateMapMsg v-if="updateMapMsgFlag" ref="updateMapMsg"></updateMapMsg>
    </el-form>
</template>

<script>
import apis from "./apis";
import { isURL } from "@/utils/validate";
import config from "./config";
import updateMapMsg from './updateMapMsg.vue'

export default {
    //import引入的组件
    components: {
        config,
        updateMapMsg
    },
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
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入数据服务地址"));
            } else {
                if (!isURL(value)) {
                    callback(new Error("数据服务地址格式不正确"));
                }
                callback();
            }
        };
        var showLevel = (rule, value, callback) => {
            if (typeof value !== "number" || value > 17 || value < 0) {
                callback(new Error("显示级别不正确，请填写0-17范围内正整数"));
            }
            callback();
        };
        return {
            activedy:1,
            unActivedy:0,
            loading: false,
            dynamicIsShow: false,
            updateMapMsgFlag: false,
            dataForm: {
                dtxxbId: null,
                mapName: "",
                mapAddress: null,
                mapDataType: 0,
                mapServerName: "",
                sjyId: "",
                sjbId: "",
                legendAddress: "",
                // mapServerAddress: "",
                mapOrder: 0,
                minShowLevel: 0,
                maxShowLevel: 17,
                twoDimensionalIsdisplay: 0,
                threeDimensionalIsdisplay: 0,
                dynamicProjection: 0
            },
            mapDataTypeList: [
                {
                    label: "栅格瓦片",
                    id: 0,
                },
                {
                    label: "矢量瓦片",
                    id: 1,
                },
                {
                    label: "矢量数据",
                    id: 2,
                },
            ],
            dataSourceList: [],
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
                mapDataType: [
                    {
                        required: true,
                        message: "请选择地图数据类型",
                        trigger: "blur",
                    },
                ],
                mapServerName: [
                    {
                        validator: validatePass2,
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
                    { validator: showLevel, trigger: ["change", "blur"] },
                ],
                maxShowLevel: [
                    { required: true, message: "请填写最大区间值" },
                    { validator: showLevel, trigger: ["change", "blur"] },
                ],
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
                this.loading = true;
                if (data.sjyId) {
                    this.$apis.getLayerDataListByMap(data.sjyId, (result) => {
                        this.dataSheetList = result;
                        this.$apis.getMapDetail(data.dtxxbId, (res) => {
                            //console.log(res)
                            this.loading = false;
                            res.mapDataType = parseInt(res.mapDataType);
                            res.mapOrder = parseInt(res.mapOrder);
                            res.minShowLevel = parseInt(res.minShowLevel);
                            res.maxShowLevel = parseInt(res.maxShowLevel);
                            res.twoDimensionalIsdisplay = String(
                                res.twoDimensionalIsdisplay
                            );
                            res.threeDimensionalIsdisplay = String(
                                res.threeDimensionalIsdisplay
                            );
                            if (res.mapDataType == 2) {
                                this.dynamicIsShow = true
                            } else {
                                this.dynamicIsShow = false
                            }
                            this.dataForm = res;
                        }, (err) => {});
                    }, (err) => {});
                } else {
                    this.$apis.getMapDetail(data.dtxxbId, (res) => {
                        // console.log(res)
                        this.loading = false;
                        res.mapDataType = parseInt(res.mapDataType);
                        res.mapOrder = parseInt(res.mapOrder);
                        res.minShowLevel = parseInt(res.minShowLevel);
                        res.maxShowLevel = parseInt(res.maxShowLevel);
                        res.twoDimensionalIsdisplay = String(
                            res.twoDimensionalIsdisplay
                        );
                        res.threeDimensionalIsdisplay = String(
                            res.threeDimensionalIsdisplay
                        );
                        if (res.mapDataType == 2) {
                            this.dynamicIsShow = true
                        } else {
                            this.dynamicIsShow = false
                        }
                        this.dataForm = res;
                    }, (err) => { });
                }
            }
        },
        getdataSourceList() {
            this.$apis.getLayerDataSourceList({}, (res) => {
                //console.log(res)
                this.dataSourceList = res;
            });
        },
        mapDataTypeChange(event) {
            if (event == 2) {
                this.dynamicIsShow = true
            } else {
                this.dynamicIsShow = false
                this.dataForm.dynamicProjection = null
            }
        },
        getSJB(data) {
            this.dataSheetList = [];
            this.dataForm.sjbId = "";
            this.$apis.getLayerDataListByMap(data, (res) => {
                this.dataSheetList = res;
            });
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$apis.updateMap(this.dataForm, (data) => {
                            this.loading = false;
                            this.$message({
                                type: "success",
                                message: "操作成功",
                            });
                            if (data.code !== "500") {
                                this.closeEvent();
                            }
                        }, (err) => {
                            if (err.data.code !== 500) {
                                this.closeEvent();
                                this.$message({
                                    type: "error",
                                    message: "",
                                });
                            }
                            this.loading = false;
                        });
                }
            });
        },

        updateMsg() {
            this.updateMapMsgFlag = true;
            this.$nextTick(() => {
                this.$refs.updateMapMsg.dtxxbId = this.dataForm.dtxxbId;
                this.$refs.updateMapMsg.init()
            })
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
        this.getdataSourceList();
    },
};
</script>

<style >
.mapmana .el-select {
    display: block;
}
</style>
