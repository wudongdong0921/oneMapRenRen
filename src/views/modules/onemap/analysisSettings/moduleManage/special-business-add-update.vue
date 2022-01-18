<template>
    <div class="form_business">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="专题编码：" v-if="form.specialCode" label-width="160px" prop="specialCode">
                <el-input v-model="form.specialCode" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="专题名称：" label-width="160px" prop="specialName">
                <el-input maxlength="16" show-word-limit v-model="form.specialName"></el-input>
            </el-form-item>
            <el-form-item label="专题分类：" label-width="160px" prop="specialClassify">
                <el-select v-model="form.specialClassify" placeholder="请选择专题分类" style="width:100%">
                    <el-option :label="item.dictLabel" v-for="item in types" :key="item.dictValue" :value="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分析类型：" label-width="160px" prop="analysisType">
                <el-select v-model="form.analysisType" placeholder="请选择分析类型" style="width:100%" :disabled="form.specialCode ? true : false">
                    <el-option :label="item.dictLabel" v-for="item in analysisType" :key="item.dictValue" :value="item.dictValue"></el-option>
                </el-select>
                <!-- <el-input v-model="form.analysisType" readonly="readonly"></el-input> -->
            </el-form-item>
            <el-form-item label="完全压占：" label-width="160px" prop="completelyText">
                <el-select v-model="form.completelyType" style="width: 25%;margin-right: 20px;" @change="completelyTypeChange">
                    <el-option v-for="(item,index) in occupiedStateC" :key="index" :label="item.dictLabel" :value="item.dictValue">
                    </el-option>
                </el-select>
                <el-input maxlength="90" show-word-limit style="width: 70%;" v-model="form.completelyText" :disabled='form.completelyType === "ZCSC" || form.completelyType === "SCWYZ"'>
                </el-input>
            </el-form-item>
            <el-form-item label="部分压占：" label-width="160px" prop="partText">
                <el-select v-model="form.partType" style="width: 25%;margin-right: 20px;" @change="partTypeChange">
                    <el-option v-for="(item,index) in occupiedStateP" :key="index" :label="item.dictLabel" :value="item.dictValue"></el-option>
                </el-select>
                <el-input style="width: 70%;" maxlength="90" show-word-limit v-model="form.partText" :disabled='form.partType === "ZCSC" || form.partType === "SCWYZ"' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="无压占：" label-width="160px" prop="nothingText">
                <el-select v-model="form.nothingType" style="width: 25%;margin-right: 20px;" @change="nothingTypeChange">
                    <el-option v-for="(item,index) in occupiedStateN" :key="index" :label="item.dictLabel" :value="item.dictValue"></el-option>
                </el-select>
                <el-input style="width: 70%;" maxlength="90" show-word-limit v-model="form.nothingText" :disabled='form.nothingType === "ZCSC" || form.nothingType === "SCWYZ"' placeholder="">
                </el-input>
            </el-form-item>
            <!-- prop="mapAddress" -->
            <el-form-item label="地图地址：" label-width="160px" prop="mapAddress">
                <el-select v-model="form.mapAddress" @change="mapAddressChange" style="width: 100%;">
                    <el-option v-for="(item,index) in mapAddressList" :key="index" :label="item.mapName" :value="item.mapId"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="iportal地址：" label-width="160px" prop="mapAddress">
                <el-input v-model="form.mapAddress" autocomplete="off"></el-input>
            </el-form-item>-->
            <!-- <el-form-item prop="mapAddressName" label="底图名称：" :label-width="formLabelWidth">
                <el-input v-model="form.mapAddressName" placeholder="请输入底图名称"></el-input>
            </el-form-item> -->

            <!-- <el-form-item prop="mapAddress" label="底图地址：" :label-width="formLabelWidth">
                <el-input v-model="form.mapAddress" placeholder="请输入底图地址"></el-input>
                <div
                    style="color:red"
                >例如：http://192.168.0.20:30952/iserver/services/map-xzqjwd-tmli6e3xqq/rest/maps/xzqjwd%40xzqjwd</div>
            </el-form-item> -->
            <el-form-item label="时间索引：" label-width="160px" prop="isTimeIndex">
                <el-switch v-model="form.isTimeIndex" @change="isTimeIndexChange" :disabled="!!form.ztfxId"></el-switch> <!-- 如果需要禁用时间索引则加上这个或运算 :disabled="!!form.ztfxId || form.analysisType == 'EDXZFX' -->
            </el-form-item>
            <el-form-item v-if="form.isTimeIndex && form.analysisType !== 'EDXZFX' " label="统一高级设置：" label-width="160px" prop="isUniformConfiguration">
                <el-switch v-model="form.isUniformConfiguration" :disabled="!!form.ztfxId"></el-switch>
            </el-form-item>
            <el-form-item label="年份：" v-if="form.isUniformConfiguration && form.isTimeIndex && form.analysisType !== 'EDXZFX' " label-width="160px" prop="dataYear">
                <el-date-picker :disabled="!!form.ztfxId" v-model="form.dataYear" type="year" value-format="yyyy" placeholder="请选择年份" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item v-if="form.isUniformConfiguration && form.isTimeIndex && form.analysisType !== 'EDXZFX' " label="数据源：" prop="dataSource" label-width="160px">
                <el-select :disabled="!!form.ztfxId" v-model="form.dataSource" placeholder="请选择数据源" @change="sourceChange" style="width:100%">
                    <el-option :label="item.label" v-for="item in source" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.isUniformConfiguration && form.isTimeIndex && form.analysisType !== 'EDXZFX' " prop="dataReference" label="数据基准表：" label-width="160px">
                <el-select v-model="form.dataReference" placeholder="请选择数据基准表" :disabled="!!form.ztfxId" style="width:100%">
                    <el-option :label="item.label" v-for="item in tables" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="button_line">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="closeEvent">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import axios from "axios";

export default {
    props: ["closeEvent"],
    data() {
        var dataSource = (rule, value, callback) => {
            if (!this.form.isUniformConfiguration) {
                callback();
            } else {
                if (!value) {
                    return callback(new Error("请选择数据源"));
                } else {
                    callback();
                }
            }
        };
        var dataReference = (rule, value, callback) => {
            if (!this.form.isUniformConfiguration) {
                callback();
            } else {
                if (!value) {
                    return callback(new Error("请选择数据基准表"));
                } else {
                    callback();
                }
            }
        };
        var completelyTextDiyRules = (rule, value, callback) => {
            if (this.form.completelyType === 'ZDY' && !value) {
                return callback(new Error("请输入正常压占信息"));
            } else {
                callback()
            }
        }
        var partTextDiyRules = (rule, value, callback) => {
            if (this.form.partType === 'ZDY' && !value) {
                return callback(new Error("请输入部分压占信息"));
            } else {
                callback()
            }
        }
        var nothingTextDiyRules = (rule, value, callback) => {
            if (this.form.nothingType === 'ZDY' && !value) {
                return callback(new Error("请输入未压占信息"));
            } else {
                callback()
            }
        }
        return {
            rules: {
                specialName: [
                    {
                        required: true,
                        message: "请输入专题名称",
                        trigger: "blur",
                    },
                ],
                specialClassify: [
                    {
                        required: true,
                        message: "请选择专题分类",
                        trigger: "blur",
                    },
                ],
                analysisType: [
                    {
                        required: true,
                        message: "请选择分析类型",
                        trigger: "blur",
                    },
                ],
                // mapAddressName: [
                //     {
                //         required: true,
                //         message: "请输入地图名称",
                //         trigger: "blur",
                //     },
                // ],
                // mapAddress: [
                //     {
                //         required: true,
                //         message: "请输入地图地址",
                //         trigger: "blur",
                //     },
                // ],
                dataYear: [
                    { required: true, message: "请输入年份", trigger: "blur" },
                ],
                // dataSource: [{ validator: dataSource, trigger: "blur" }],
                // dataReference: [{ validator: dataReference, trigger: "blur" }],
                dataSource: [{ required: true, message: "请选择数据源", trigger: "blur" }],
                dataReference: [{ required: true, message: "请选择数据基准表", trigger: "blur" }],
                completelyText: [{ required: true, trigger: "blur", validator: completelyTextDiyRules }],
                partText: [{ required: true, trigger: "blur", validator: partTextDiyRules }],
                nothingText: [{ required: true, trigger: "blur", validator: nothingTextDiyRules }],
            },
            form: {
                ztfxId: false,
                specialCode: "", // 专题编码
                specialName: "", // 专题名称
                specialClassify: "", //	专题分类
                analysisType: "", // 分析类型
                mapAddress: "", // 地图地址
                // sjyType: "1", // 数据源类型（0单一数据源、1多数据源）
                isTimeIndex: false, // 是否开启时间索引（0是、1否）
                isUniformConfiguration: false, // 是否统一高级配置（0是、1否）
                dataReference: "", // 数据表
                dataSource: "", // 数据源
                dataYear: "", // 数据基准年 (String)
                completelyType: '', // 完全压占
                partType: '', // 部分压占
                nothingType: '', // 无压占
                completelyText: '',// 无压占
                partText: '',// 部分压占
                nothingText: '',// 无压占
            },
            formLabelWidth: '160px',
            types: [],
            tables: [],
            source: [],
            analysisType: [],
            occupiedStateC: [],
            occupiedStateP: [],
            occupiedStateN: [],
            mapAddressList: []

        };
    },
    mounted() {
        this.$api = this.$API.get(['onemap:analysisSettings']);

        let data1 = {value: 'ZTFX',pid: 0}
        this.$api.dicSelectList(data1, res => {
            this.types = res;
        });
        let data2 = {value: 'FXLX',pid: 0}
        this.$api.dicSelectList(data2, res => {
            this.analysisType = res;
            if (this.form.analysisType === 'djfx') {
                this.form.analysisType = ''
            }
        });
        this.$api.lyerDataSource('',(res) => {
            this.source = res;
        });
        let data3 = {value: 'KZSCXS',pid: 0}
        this.$api.dicSelectList(data3, res => {
            this.occupiedStateP = res
            for (let item of res) {
                if (item.dictLabel.indexOf('输出未压占') === -1) this.occupiedStateC.push(item)
                if (item.dictLabel.indexOf('正常输出') === -1) this.occupiedStateN.push(item)
            }
        })
        this.$api.mapSelectForMap('',res => {
            this.mapAddressList = res
        })
    },
    methods: {
        isTimeIndexChange(e) {
            if (!e) this.form.isUniformConfiguration = false
        },
        completelyTypeChange(e) {
            this.form.completelyType = e
            this.$forceUpdate()
        },
        partTypeChange(e) {
            this.form.partType = e
            this.$forceUpdate()
        },
        nothingTypeChange(e) {
            this.form.nothingType = e
            this.$forceUpdate()
        },
        mapAddressChange(e) {
            this.form.mapAddress = e
        },
        sourceChange(gnore) {
            if (gnore !== true) {
                this.form.dataReference = "";
            }
            this.$api.layerDataList2({'sjyId':this.form.dataSource}, (res) => {
                // this.form.dataReference = res[0].label
                this.tables = res;
            });
        },
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var _data = JSON.parse(JSON.stringify(this.form));
                    _data.isTimeIndex = _data.isTimeIndex ? 0 : 1;
                    _data.isUniformConfiguration = _data.isUniformConfiguration
                        ? 0
                        : 1;
                        let data = {
                                ztfxId: _data.ztfxId || undefined, // 主键 (String) 
                                specialCode: _data.specialCode, // 专题编码 (String) 必填
                                specialName: _data.specialName, // 专题名称 (String) 必填
                                specialClassify: _data.specialClassify, // 专题分类 (String) 必填
                                analysisType: _data.analysisType, // 分析类型 (String) 必填
                                // mapAddress: _data.mapAddress, // 地图地址 (String) 必填
                                isTimeIndex: _data.isTimeIndex, // 是否开启时间索引（0是、1否） (Integer) 必填
                                isUniformConfiguration: _data.isUniformConfiguration, // 是否统一高级配置（0是、1否） (Integer) 必填
                                dataSource: _data.dataSource, // 数据基准源 (String) 
                                dataReference: _data.dataReference, // 数据基准表 (String) 
                                dataYear: _data.dataYear, // 数据基准年 (String) 
                                completelyText: _data.completelyText, // 完全压占文本
                                completelyType: _data.completelyType, // 完全压占字典选项
                                nothingText: _data.nothingText, // 部分压占文本
                                nothingType: _data.nothingType, // 部分压占字典选项
                                partText: _data.partText, // 无压占文本
                                partType: _data.partType, // 无压占字典选项
                                mapAddress: _data.mapAddress // 地图地址
                            }
                    this.$api.saveOrUpdateSpecificAnalysis(data, (res) => {
                        this.$message({
                            message: "操作成功",
                            type: "success",
                        });
                        this.closeEvent(true);
                    });
                } else {
                    return false;
                }
            });
        },
        addOptions(data, save) {
            this.$refs.form.resetFields();
            // this.types = data.types;
            this.source = data.source;
            this.analysisType = data.analysisType;
            this.form = JSON.parse(JSON.stringify(data.form));

            if (this.form.isTimeIndex == "0") {
                this.form.isTimeIndex = true;
            } else if (this.form.isTimeIndex == "1") {
                this.form.isTimeIndex = false;
            }

            if (this.form.isUniformConfiguration == "0") {
                this.form.isUniformConfiguration = true;
            } else if (this.form.isUniformConfiguration == "1") {
                this.form.isUniformConfiguration = false;
            }

            if (this.form.dataSource) {
                this.sourceChange(true);
            }

            // HLJSSJDXT-533
            if (save !== 'edit') {
                this.form.completelyType = 'ZCSC'
                this.form.partType = 'ZCSC'
                this.form.nothingType = 'ZDY'
                // this.form.nothingText = '目标地块与分析数据无交集，请核对地块信息'
            } else {
                this.form.analysisType = data.form.analysisType
            }
            this.form.completelyType = this.form.completelyType || 'ZCSC'
            this.form.partType = this.form.partType || 'ZCSC'
            this.form.nothingType = this.form.nothingType || 'ZDY'
            // this.form.nothingText = this.nothingText || '目标地块与分析数据无交集，请核对地块信息'
        },
    },
};
</script>
<style scope>
.button_line {
    padding: 20px 0 0 0;
    text-align: right;
}
.readOnly input {
    background: #f0f0f0;
    color: #999;
}
</style>