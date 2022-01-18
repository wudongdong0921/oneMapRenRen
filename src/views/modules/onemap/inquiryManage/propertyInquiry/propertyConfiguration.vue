<template>
    <div>
        <el-form :model="conData" ref="conForm" label-width="100px" :rules="rules">
            <el-form-item label-width="0" prop="searchSql">
                <el-input type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入SQL语句" v-model="searchSql" clearable style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item style="text-align:right;">
                <span style="margin-right:15px; color:#409EFF; font: 16px bold">{{ conData.viewName }}</span> <!-- 视图名称 -->
                <el-button type="primary" @click="addOrUpdateView()">{{ status }}</el-button>
                <!--status的文字随后台是否有视图而更改 -->
                <el-button type="danger" @click="deleteData">删除</el-button>
            </el-form-item>

            <div v-for="(item,index) in conData.searchList" :key="'select' + index">
                <el-row :gutter="5">
                    <el-col :span="11">
                        <el-form-item label="查询字段" :prop="'searchList.' + index +'.searchField'" :ref="index+'searchField'" :rules=" { required: true, message: '请选择查询字段', trigger: ['blur','change'] }">
                            <el-select v-model="item.searchField" style="width: 90%" placeholder="请选择查询字段">
                                <template v-for="ways in field">
                                    <el-option :key="ways" :label="ways" :value="ways"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="字段名称" :ref="index+'searchFieldName'" :prop="'searchList.' + index +'.searchFieldName'" :rules="{ required: true, message: '请填写字段名称', trigger: ['blur','change'] }">
                            <el-input v-model="item.searchFieldName" placeholder="请输入字段名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item v-if="conData.searchList.length > 1" label-width="0">
                            <el-button size="mini" type="danger" plain @click="subtractSelect(index)">删除</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <el-form-item label-width="0" style="text-align:center; margin:0 0 20px 0;">
                <el-button @click="addSelectData" size="mini" type="primary" plain><i class="el-icon-circle-plus-outline"></i> 添加字段</el-button>
            </el-form-item>

            <div v-for="(item,index) in conData.showList" :key="'result' + index">
                <el-row :gutter="5">
                    <el-col :span="11">
                        <el-form-item label="显示字段" :prop="'showList.' + index +'.showField'" :ref="index+'showField'" :rules=" { required: true, message: '请选择查询字段', trigger: ['blur','change'] }">
                            <el-select v-model="item.showField" style="width: 90%" placeholder="请选择显示字段">
                                <template v-for="ways in field">
                                    <el-option :key="ways" :label="ways" :value="ways"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="字段名称" :ref="index+'showFieldName'" :prop="'showList.' + index +'.showFieldName'" :rules="{ required: true, message: '请填写字段名称', trigger: ['blur','change'] }">
                            <el-input v-model="item.showFieldName" placeholder="请输入字段名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item v-if="conData.showList.length > 1" label-width="0">
                            <el-button size="mini" type="danger" plain @click="subtractResult(index)">删除</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <el-form-item label-width="0" style="text-align:center; margin:0 0 20px 0;">
                <el-button @click="addResultData" size="mini" type="primary" plain><i class="el-icon-circle-plus-outline"></i> 添加字段</el-button>
            </el-form-item>

            <el-divider></el-divider>

            <label><span style="color:red;">* </span>空间定位数据集名</label>

            <el-form-item label="数据源" prop="kjsjyId" style="margin-top:10px">
                <el-select v-model="conData.kjsjyId" style="width: 90%" placeholder="请选择数据源" @change="getLayerDataList2">
                    <el-option v-for="ways in dataSourceList" :key="ways.value" :label="ways.label" :value="ways.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据集" prop="kjsjjId">
                <el-select v-model="conData.kjsjjId" style="width: 90%" placeholder="请选择数据集">
                    <el-option v-for="ways in dataSetList" :key="ways.value" :label="ways.label" :value="ways.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item style="text-align:right; margin:50px 0 0 0;">
                <el-button @click="clickClose">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button> <!--  @click="sub" -->
            </el-form-item>
        </el-form>

        <el-dialog :visible.sync="editVisible" title="添加视图" :destroy-on-close="true" width="400px" :append-to-body="true">
            <el-form :model="addView" ref="addView" label-width="80px" @submit.native.prevent>
                <el-form-item label="视图名称" prop="viewName" :rules="{ pattern: /^[a-zA-Z_][a-zA-Z0-9_]{0,9}$/, message: '首字母只可以是字母或_,且名称不能包含汉字,长度不能大于10', trigger: ['blur', 'change'] }">
                    <el-input v-model="addView.viewName" placeholder="请输入视图名称" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 35px">
                    <el-button @click="editVisible=false">取消</el-button>
                    <el-button type="primary" @click="saveValue">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>
<script>

export default {
    data() {
        return {
            conData: {
                sxcxId: '',
                viewName: '',
                viewId: '',
                dataList: [],   // 查询字段和显示字段的list
                kjsjyId: '', // 数据源
                kjsjjId: '', // 数据集

                searchList: [{
                    type: '0',
                    searchField: '',  // 查询字段
                    searchFieldName: '', //字段名称
                }],
                showList: [{
                    type: '1',
                    showField: '', // 显示字段
                    showFieldName: '', // 字段名称
                }],
            },
            searchSql: '',
            field: '',
            dataSourceList: [], // 数据源列表
            dataSetList: [],    //数据集列表

            addView: {
                viewName: '', // 弹窗添加的视图名称
            },

            editVisible: false, // 生成视图或更新的弹窗
            status: '生成视图',

            rules: {
                kjsjyId: { required: true, message: '请选择数据源', trigger: ['blur', 'change'] },
                kjsjjId: { required: true, message: '请选择数据集', trigger: ['blur', 'change'] },
            }

        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
    },
    methods: {
        // 初始化
        init(data, sxcxId) {
            this.conData.sxcxId = sxcxId;
            if (data.view) {
                this.searchSql = data.view.searchSql;
                this.conData.viewName = data.view.viewName;
                this.conData.viewId = data.view.id;
            }
            if (data.space) {
                this.conData.kjsjyId = data.space.kjsjyId;
                this.conData.kjsjjId = data.space.kjsjjId;
            }
            if (data.dataList.length > 0) {
                this.conData.searchList = [];
                this.conData.showList = [];
                for (let index = 0; index < data.dataList.length; index++) {
                    let item = data.dataList[index];
                    if (item.type == '0') {
                        let data = {
                            type: item.type,
                            searchField: item.searchField,
                            searchFieldName: item.searchFieldName
                        };
                        this.conData.searchList.push(data);
                    } else if (item.type == "1") {
                        let data = {
                            type: item.type,
                            showField: item.showField,
                            showFieldName: item.showFieldName
                        };
                        this.conData.showList.push(data);
                    }
                }
            }
            if (data.field) {
                this.field = data.field;
            }

            if (this.searchSql) {
                this.status = "更新";
            }

            this.getLayerDataSourceList();
            if (this.conData.kjsjyId) {
                this.$api.getLayerDataList2s(this.conData.kjsjyId, (res) => {
                    this.dataSetList = res;
                })
            }
        },

        // 新增查询字段数据
        addSelectData() {
            this.conData.searchList.push({
                type: '0',
                searchField: '',
                searchFieldName: ''
            })
        },

        // 删除查询字段数据
        subtractSelect(index) {
            this.conData.searchList.splice(index, 1);
        },

        // 新增显示字段数据
        addResultData() {
            this.conData.showList.push({
                type: '1',
                showField: '',
                showFieldName: ''
            })
        },

        // 删除显示字段数据
        subtractResult(index) {
            this.conData.showList.splice(index, 1);
        },

        // 查询数据源
        getLayerDataSourceList() {
            this.$api.getLayerDataSourceList({}, (res) => {
                this.dataSourceList = res;
            })
        },

        // 查询数据集
        getLayerDataList2() {
            this.conData.kjsjjId = '';
            this.dataSetList = [];
            let data = this.conData.kjsjyId;
            this.$api.getLayerDataList2s(data, (res) => {
                this.dataSetList = res;
            })
        },

        // 点击生成视图/更新按钮
        addOrUpdateView() {
            if (!this.searchSql) {
                return this.$message({
                    type: 'error',
                    message: 'SQL语句不可以为空'
                })
            }

            // 当viewName存在时，先弹窗提示
            if (this.conData.viewName) {
                this.$confirm("此操作将删除上一视图数据以及空间定位数据集,是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.addView.viewName = '';
                    this.editVisible = true;
                })
            } else {
                this.editVisible = true;
            }
        },

        // 保存视图名称
        saveValue() {
            this.$refs.addView.validate(async (valid) => {
                if (!valid) {
                    return
                } else if (valid) {
                    if (this.conData.viewName || this.conData.viewId) {
                        // 替换视图
                        let data = {
                            sxcxId: this.conData.sxcxId,
                            id: this.conData.viewId,
                            viewName: this.addView.viewName,
                            searchSql: this.searchSql
                        };
                        this.$api.alterViews(data, (res) => {
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "替换成功"
                                })
                                this.field = res.data;
                                this.conData.viewName = this.addView.viewName;
                                this.editVisible = false;
                                this.conData.searchList = [{
                                    type: '0',
                                    searchField: '',  // 查询字段
                                    searchFieldName: '', //字段名称
                                }];
                                this.conData.showList = [{
                                    type: '1',
                                    showField: '', // 显示字段
                                    showFieldName: '', // 字段名称
                                }];
                                this.conData.kjsjyId = '';
                                this.conData.kjsjjId = '';
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.msg
                                })
                            }
                        }, (err) => {
                            this.$message({
                                type: "error",
                                message: err.response.data.msg,
                            })
                        })
                    } else {
                        // 创建视图
                        let data = {
                            sxcxId: this.conData.sxcxId,
                            viewName: this.addView.viewName,
                            searchSql: this.searchSql
                        };
                        this.$api.createViews(data, (res) => {
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "创建成功"
                                })
                                this.field = res.field;
                                this.conData.viewId = res.id;
                                this.conData.viewName = this.addView.viewName;
                                this.editVisible = false;
                                this.status = "更新";
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.msg,
                                });
                            }
                        }, (err) => {
                            this.$message({
                                type: "error",
                                message: err.response.data.msg,
                            });
                            // console.log(err.response);
                            // console.log(err.response.data.msg);
                        })
                    }
                }
            })
        },

        // 删除视图
        deleteData() {
            if (!this.conData.viewId) {
                this.$confirm("此操作将删除sql语句，是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.searchSql = '';
                })
            } else {
                this.$confirm("此操作将删除已设计好的视图以及该页面的所有数据，是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$api.deleteView(this.conData.sxcxId, (res) => {
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                        this.$refs.conForm.resetFields();
                        this.conData.searchList = [{
                            type: '0',
                            searchField: '',  // 查询字段
                            searchFieldName: '', //字段名称
                        }];
                        this.conData.showList = [{
                            type: '1',
                            showField: '', // 显示字段
                            showFieldName: '', // 字段名称
                        }];
                        this.searchSql = '';
                        this.field = '';
                        this.dataSetList = '';
                        this.conData.viewName = '';
                        this.conData.viewId = '';
                        this.status = '生成视图';
                    }, (err) => {
                        this.$message.error(err.response.data.msg);
                    })
                })
            }
        },

        // 取消
        clickClose() {
            this.$emit('clickClose');
        },

        // 保存
        save() {
            this.$refs.conForm.validate(async (valid) => {
                if (!valid) {
                    return
                } else if (valid) {
                    this.conData.dataList = this.conData.searchList.concat(this.conData.showList);
                    let data = {
                        sxcxId: this.conData.sxcxId,
                        dataList: this.conData.dataList,
                        space: {
                            kjsjyId: this.conData.kjsjyId,
                            kjsjjId: this.conData.kjsjjId
                        }
                    };
                    this.$api.saveConfig(data, (res) => {
                        this.$message({
                            type: "success",
                            message: "保存成功"
                        })
                        this.$emit('resetInquiryData');
                    }, (err) => {
                        this.$message({
                            type: 'error',
                            message: err.response.data.msg
                        })
                    })
                }
            })
        }
    }
}
</script>
