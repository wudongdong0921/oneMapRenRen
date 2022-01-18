<template>

    <el-form :model="dataForm" :rules="rules" ref="elForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="统计名称：" prop="statisName">
            <el-input v-model="dataForm.statisName" placeholder="请输入统计名称" clearable show-word-limit maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="数据源：" prop="dataSource">
            <el-select style="width: 100%" v-model="dataForm.dataSource" clearable placeholder="请选择数据源" @change="changedataSource">
                <el-option v-for="item in dataSourceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="数据表：" prop="dataTable">
            <el-select style="width: 100%" v-model="dataForm.dataTable" clearable placeholder="请选择数据表" @change="changedataTable">
                <el-option v-for="item in dataTableList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分组字段：" prop="groupField">
            <el-select style="width: 100%" v-model="dataForm.groupField" clearable placeholder="请选择分组字段">
                <el-option v-for="item in dataFieldList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="行政区字段：" prop="districtField">
            <el-select style="width: 100%" v-model="dataForm.districtField" clearable placeholder="请选择行政区字段">
                <el-option v-for="item in dataFieldList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="统计维度：" prop="statisField">
            <el-select style="width: 100%" v-model="dataForm.statisField" clearable placeholder="请选择统计维度" multiple>
                <el-option v-for="item in dataFieldList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分组参照字典:" prop="groupDict">
            <el-select style="width: 100%" v-model="dataForm.groupDict" clearable placeholder="请选择分组参照字典">
                <el-option v-for="item in dicSelectList" :key="item.dictType" :label="item.dictName" :value="item.dictType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="过滤字段：" prop="filterField">
            <el-select style="width: 100%" v-model="dataForm.filterField" clearable placeholder="请选择过滤字段">
                <el-option v-for="item in dataFieldList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="过滤字段值：" prop="filterValve">
            <el-input v-model="dataForm.filterValve" placeholder="请输入过滤字段值" clearable show-word-limit maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="统计图样式：" prop="chartStyle" :rules="[{required: dataForm.openChart == 1? true: false, message: '请选择统计图样式', trigger:['blur', 'change']}]">
            <el-select style="width: 100%" v-model="dataForm.chartStyle" clearable placeholder="请选择统计图样式">
                <el-option v-for="item in chartStyleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="开启统计图：" prop="openChart">
            <el-switch v-model="dataForm.openChart" :inactive-value="0" :active-value="1" active-text="ON" inactive-text="OFF">
            </el-switch>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label-width="0" style="text-align: center;">
            <el-button type="primary" @click="dataFormSubmit()">确认</el-button>
            <el-button @click="clickClose">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import api from './apis'

export default {
    data() {
        return {
            dataForm: {
                id: null,
                statisName: null,
                dataSource: null,
                dataTable: null,
                groupField: null,
                districtField: null,
                statisField: null,
                groupDict: null,
                filterField: null,
                filterValve: null,
                chartStyle: 1,
                openChart: 0,
                sort: 0
            },
            dataSourceList: [],
            dataTableList: [],
            dataFieldList: [],
            dicSelectList: [],
            chartStyleList: [
                {
                    value: 0,
                    label: '饼状图'
                }, {
                    value: 1,
                    label: '柱状图'
                }
            ],

            rules: {
                statisName: [{
                    required: true, message: '请选择统计名', trigger: ['blur', 'change']
                }],
                dataSource: [{
                    required: true, message: '请选择数据源', trigger: ['blur', 'change']
                }],
                dataTable: [{
                    required: true, message: '请选择数据表', trigger: ['blur', 'change']
                }],
                groupField: [{
                    required: true, message: '请选择分组字段', trigger: ['blur', 'change']
                }],
                districtField: [{
                    required: true, message: '请选择行政区字段', trigger: ['blur', 'change']
                }],
                statisField: [{
                    required: false, message: '请选择统计维度', trigger: ['blur', 'change']
                }]
            }
        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:dataStatistics','onemap:statisConfig']);
    },
    methods: {
        init(data) {
            this.$refs.elForm.resetFields();
            this.getLayerDataSourceList();
            this.getDicSelectListForSpecific();
            if (data) {
                // console.log(data)
                this.getById(data)
            }
        },

        getById(data) {
            this.$api.getStaticListById(data, res => {
                res.statisField = res.statisField == "" ? null : res.statisField.split(",");
                this.dataForm = res;
                this.getLayerDataList();
                this.findLayerDataFieldSelectList();
            })
        },

        // 获取数据源列表
        getLayerDataSourceList() {
            this.$api.getLayerDataSourceList({}, res => {
                this.dataSourceList = res;
            })
        },

        // 获取数据表
        getLayerDataList() {
            this.$api.getLayerDataList(this.dataForm.dataSource, res => {
                this.dataTableList = res
            })
        },

        changedataSource() {
            this.dataForm.dataTable = null;
            this.dataForm.groupField = null;
            this.dataForm.districtField = null;
            this.dataForm.statisField = [];
            this.dataForm.filterField = null;
            this.dataTableList = [];
            this.dataFieldList = [];
            this.getLayerDataList();
        },

        changedataTable() {
            this.dataForm.groupField = null;
            this.dataForm.districtField = null;
            this.dataForm.statisField = [];
            this.dataForm.filterField = null;

            this.dataFieldList = [];

            this.findLayerDataFieldSelectList();
        },

        // 获取字段
        findLayerDataFieldSelectList() {
            this.$api.findLayerDataFieldSelectList(this.dataForm.dataTable, res => {
                // 用于去除res中label为null的值
                // for(const item of res) {
                //     if(item.label) {
                //         this.dataFieldList.push(item)
                //     }
                // }
                this.dataFieldList = res
            })
        },

        // 分组参照字典
        getDicSelectListForSpecific() {
            this.$api.getDicSelectListForSpecific({}, res => {
                this.dicSelectList = res;
            })
        },

        // 提交
        dataFormSubmit() {
            this.$refs.elForm.validate((valid) => {
                if (valid) {

                    let statisField = this.dataForm.statisField ? this.dataForm.statisField.toString() : '';
                    let data = this.dataForm;
                    data.statisField = statisField;
                    data.chartStyle = data.chartStyle !== "" ? data.chartStyle : null

                    this.$api.saveStatis(data, res => {
                        let message;
                        if (this.dataForm.id) {
                            message = "修改成功"
                        } else {
                            message = "新增成功"
                        }
                        this.$message({
                            type: 'success',
                            message: message
                        })
                        this.$emit("refreshDataList")
                    })
                }

            })
        },

        clickClose() {
            this.$emit("refreshDataList")
        }
    },
}
</script>
