<template>
    <div>
        <div class="configs_header">
            <el-form ref="form" :model="form" :rules="rules">
                <el-row>
                    <el-col :span="6" v-if="showYear">
                        <el-form-item label="年份：" label-width="80px" prop="year">
                            <el-date-picker v-model="form.year" type="year" value-format="yyyy" placeholder="请选择年份" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="数据源：" label-width="100px" prop="sjyId">
                            <el-select v-model="form.sjyId" @change="getSJB" placeholder="请选数据源" style="width:100%">
                                <el-option v-for="item in SJY" :label="item.label" :key="item.value" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="数据基准表：" label-width="140px" prop="sjbId">
                            <el-select v-model="form.sjbId" @change="getTreeTable" placeholder="请选择数据基准表" style="width:100%">
                                <el-option v-for="item in SJB" :label="item.label" :key="item.value" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="3" style="float:right" v-if="canUpdate">
                        <el-button class="buttonForType el-button--primary" @click="saveEvent()" icon="el-icon-circle-plus-outline">保存数据源</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <advConfigItem v-for="(item,index) in configs" v-show="item.show" :ref="item.id + '_item'" :key="index" :config-data="item" :formData="form" :refashData="closeEvent" @childSub='childSub' onDelete="deleteEvent"></advConfigItem>
        <div class="addTags" v-if="showCreatConfig">
            <el-button class="buttonForType el-button--primary" @click="addTags()" type="primary" icon="el-icon-circle-plus-outline">添加标签</el-button>
        </div>
    </div>
</template>

<script>
import advConfigItem from "./advConfigItem";

export default {
    props: ["closeEvent"],
    components: {
        advConfigItem,
    },
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

        return {
            canUpdate: true,
            showCreatConfig: true,
            showYear: true,
            closeDialogWhenAfterSaveEvent: false,
            rules: {
                year: [{
                    required: true,
                    message: "请输入年份",
                    trigger: "change"
                }],
                sjyId: [{
                    required: true,
                    message: "请选择数据源",
                    trigger: "change"
                }],
                sjbId: [{
                    required: true,
                    message: "请选择数据表",
                    trigger: "change"
                }],
            },
            SJY: [],
            SJB: [],
            form: {
                ztsjyId: "",
                ztfxId: "",
                sjyId: "", // 数据源主键 (String) 必填
                sjbId: "", // 数据表主键 (String) 必填
                year: "", // 年份 (String) 必填
                versionNumber: "",
            },
            configs: [],
            TreeTypes: [],
            parentData: {},
            gjpzIdList: []
        };
    },
    mounted(){
        this.$api = this.$API.get(['onemap:analysisSettings']);
    },
    methods: {
        getSJY(gnore) {
            if (gnore !== true) {
                this.form.sjbId = "";
            }
            this.$api.lyerDataSource('',(res) => {
                this.SJY = res;
            });
        },
        getTreeTable(e) {
            this.$api.findLayerSelectList({sjbId:this.form.sjbId}, (res) => {
                this.TreeTypes = res;
                this.eachChildrens((ele) => {
                    if (ele){
                        ele.clearTablelist();
                        ele.setGroupField()
                    }
                });
            });
            if(e && this.configs.length) {
                this.$confirm('此操作将删除所有标签, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(res => {
                    this.configs = []
                })
                .catch(err=> {
                    this.$message({ message: "已取消", type: "info" });
                })
            }
        },
        childSub(gjpzId) {
            this.gjpzIdList.push(gjpzId)
        },
        getSJB(gnore) {
            if (gnore !== true) {
                this.TreeTypes = [];
                if(this.configs.length) {
                    this.$confirm('此操作将删除所有标签, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(res => {
                        for(let item of this.configs) {
                            if(item.form.gjpzId) {
                                this.gjpzIdList.push(item.form.gjpzId)
                            }
                        }
                        // return console.log(this.gjpzIdList);
                        if(this.gjpzIdList.length) {
                            this.gjpzIdList = this.gjpzIdList.join(',')
                            this.$api.delSpecificConfig({gjpzId:this.gjpzIdList}, (res) => {
                                if(res) {
                                    this.configs = []
                                    this.$message({ message: "操作成功", type: "success" });
                                    this.closeEvent(true, "saveSource");
                                }
                                
                                // this.deleteEvent(this.configData);
                            });
                        }else {
                            this.configs = []
                        }
                    })
                    .catch(err=> {
                        this.$message({ message: "已取消", type: "info" });
                    })
                }
            }
            this.$api.layerDataList2({sjyId:this.form.sjyId}, (res) => {

                if (gnore !== true) {
                    this.form.sjbId = '';
                }

                this.SJB = res;
            });
        },
        Guid() {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
            }
            return guid;
        },
        addTags() {
            var id = this.Guid();
            var data = {
                id: id,
                show: true,
                form: {
                    labelName: "",
                    isOpenTree: "1",
                    isOpenMap: "1",
                    isFormula: "1",
                    showHierarchy: 0,
                    topTreeContent: "",
                    twoTreeContent: "",
                    threeTreeContent: "",
                    groupDictionaries: "",
                    analysisFormula: "",
                    showEnglishField: "",
                    showChineseField: "",
                    groupEnglishField: "",
                    groupChineseField: "",
                },
            };
            this.configs.push(data);
        },
        deleteEvent(item) {
            this.afterDeleteEvent(item);
            this.closeEvent(true, "saveSource");
        },
        afterDeleteEvent(item) {
            for (let i = 0; i < this.configs.length; i++) {
                const element = this.configs[i];
                if (element.id == item.id) {
                    element.show = false;
                    // this.configs.splice(i, 1);
                    // delete this.$refs[item.id + "_item"];
                }
            };
            // this.$nextTick(() => {
            //     this.$forceUpdate()
            // });
        },
        eachChildrens(callback) {
            for (const key in this.$refs) {
                if (this.$refs.hasOwnProperty(key)) {
                    const element = this.$refs[key];
                    if (key.indexOf("_item") != -1) {
                        callback(element[0]);
                    }
                }
            }
        },
        checkHaveChildren() {
            var isHave = false;
            for (const key in this.$refs) {
                if (this.$refs.hasOwnProperty(key)) {
                    const element = this.$refs[key];
                    if (key.indexOf("_item") != -1) {
                        isHave = true;
                        break;
                    }
                }
            }
            return isHave;
        },
        saveEvent() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // console.log(this.form);
                    var _data = JSON.parse(JSON.stringify(this.form));
                    let data = {
                        ztsjyId: _data.ztsjyId || undefined, // 专题数据原表主键 (String) 修改时必填
                        ztfxId: _data.ztfxId, // 专题分析表主键 (String) 必填
                        sjyId: _data.sjyId, // 数据源主键 (String) 必填
                        sjbId: _data.sjbId, // 数据表主键 (String) 必填
                        year: _data.year, // 年份 (String) 必填
                        versionNumber: _data.versionNumber || undefined, // 年份 (String) 修改时必填，添加时忽略
                        dsjbId: _data.dsjbId, // 点数据表主键
                        xsjbId: _data.xsjbId // 线数据表主键
                    }
                    this.$api.saveOrUpdateSpecificData(data, (res) => {
                        this.form.ztsjyId = res;
                        this.closeEvent(true, 'saveSource', this.closeDialogWhenAfterSaveEvent);
                        this.$message({
                            message: "操作成功",
                            type: "success",
                        });
                    });
                }
            });
        },
        setData(data, type, showYear, rowData) {
            // console.log(showYear);
            var _data = JSON.parse(JSON.stringify(data));
            this.getSJY();
            if (type == "creat") {
                this.form.ztfxId = _data.ztfxId;
                if (data.isUniformConfiguration == "0") {
                    this.showCreatConfig = false;
                }
                if (data.isTimeIndex == "1") {
                    this.showYear = false;
                }
                if (data.isUniformConfiguration == '0' && data.isTimeIndex == '0') {
                    this.closeDialogWhenAfterSaveEvent = true;
                };
            } else if (type == "update") {
                var $data = {
                    ztsjyId: data.ztsjyId,
                    ztfxId: data.ztfxId,
                    sjyId: data.sjyId, // 数据源主键 (String) 必填
                    sjbId: data.sjbId, // 数据表主键 (String) 必填
                    year: data.year, // 年份 (String) 必填
                    versionNumber: data.versionNumber,
                };
                this.form = $data;
                this.configs = [];
                if (showYear == "1") {
                    this.showYear = false;
                }
                if (
                    rowData.dataYear == $data.year &&
                    rowData.dataSource == $data.sjyId &&
                    rowData.dataReference == $data.sjbId
                ) {
                    this.canUpdate = false;
                } else {
                    if (!(
                        rowData.isTimeIndex === 0 &&
                        rowData.isUniformConfiguration === 0 &&
                        rowData.dataYear === data.year
                    )) {
                        this.showCreatConfig = false;
                    }
                    if(rowData.isUniformConfiguration !== 0) {
                        this.showCreatConfig = true;
                    }
                }
                for (let i = 0; i < data.children.length; i++) {
                    const element = data.children[i];
                    this.configs.push({
                        id: this.Guid(),
                        show: true,
                        form: element,
                    });
                }

                // console.log(this.configs);
                // closeDialogWhenAfterSaveEvent

                // form: data.children,

                // console.log();
            }
            if (this.form.sjbId) {
                this.getSJB(true);
                this.getTreeTable();
            }
        },
    },
};
</script>

<style>
.addTags {
    text-align: center;
}

.saveButtons {
    text-align: right;
}
</style>
