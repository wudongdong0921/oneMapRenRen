<template>
    <div class="config_item_box">
        <div class="config_item_title_title" @click="showItem = !showItem">
            <div class="config_item_title_name">
                {{ form.labelName ? form.labelName : "请填写标签名称" }}
            </div>
            <div class="config_item_title_swith" :class="{ show: showItem }">
                <i class="el-icon-arrow-down"></i>
            </div>
        </div>

        <el-collapse-transition>
            <div class="config_border" v-show="showItem">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="标签名称：" label-width="120px" prop="labelName">
                                <el-input v-model="form.labelName" placeholder="请填写标签名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="11">
                            <el-form-item label="列表显示字段：" prop="showChineseField" ref="showChineseField" label-width="120px">
                                <el-input v-model="form.showChineseField" placeholder="请选择列表显示字段" @focus="DataBaseFoces" readonly="readonly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="23">
                            <el-form-item label="开启统计树：" label-width="120px" :rules="
                  form.isOpenMap
                    ? [
                        {
                          required: true,
                          trigger: 'blur',
                        },
                      ]
                    : []
                ">
                                <el-switch @change="isOpenTreeChange" v-model="form.isOpenTree"></el-switch>
                                <el-alert v-if="form.isOpenMap && !form.isOpenTree" title="请先开启统计树" type="error" :closable="false" style="height: 7px; background-color: white"></el-alert>
                            </el-form-item>
                        </el-col>
                        <el-col :span="23">
                            <el-form-item label="开启统计图：" label-width="120px">
                                <el-switch v-model="form.isOpenMap"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="分组字段：" label-width="120px" ref="groupEnglishField" prop="groupEnglishField">
                                <el-select v-model="form.groupEnglishField" placeholder="请选择分组字段" style="width: 100%" @change="$refs.groupDictionaries.clearValidate()">
                                    <el-option v-for="item in tableValueList" :label="item.label" :key="item.value" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" style="height: 70px"></el-col>
                        <el-col :span="11">
                            <el-form-item label="分组参照字典：" label-width="120px" ref="groupDictionaries" prop="groupDictionaries">
                                <el-select v-model="form.groupDictionaries" placeholder="请选择分组参照字典" style="width: 100%" @change="$refs.groupEnglishField.clearValidate()">
                                    <el-option v-for="item in TreeTypes" :label="item.dictName" :key="item.id" :value="item.dictType"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="11">
                            <el-form-item label="显示层级：" label-width="120px">
                                <el-select v-model="form.showHierarchy" placeholder="请选择数据基准表" @change="hierarchyChange" style="width: 100%">
                                    <el-option label="一级树+二级树" :value="1"></el-option>
                                    <el-option label="全部显示" :value="0"></el-option>
                                    <!-- <el-option label="仅显示三级树" :value="2"></el-option> -->
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="23">
                            <el-form-item label="一级树内容：" label-width="120px" :rules="
                  treeContentFlagTop
                    ? [
                        {
                          required: true,
                          message: '请选择一级树内容',
                          trigger: 'change',
                        },
                      ]
                    : []
                ">
                                <el-checkbox-group v-model="form.topTreeContent">
                                    <!-- <el-checkbox :label="'1'">分组字段值</el-checkbox> -->
                                    <el-checkbox :label="'2'">查询个数</el-checkbox>
                                    <!-- <el-checkbox :label="'3'">图形总面积</el-checkbox> -->
                                    <el-checkbox :label="'4'">压占面积</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="23">
                            <el-form-item label="二级树内容：" label-width="120px" prop="twoTreeContent" :rules="
                  treeContentFlagTwo
                    ? [
                        {
                          required: true,
                          message: '请选择二级树内容',
                          trigger: 'change',
                        },
                      ]
                    : []
                ">
                                <el-checkbox-group v-model="form.twoTreeContent">
                                    <!-- <el-checkbox :label="'1'">分组字段值</el-checkbox> -->
                                    <el-checkbox :label="'2'">查询个数</el-checkbox>
                                    <el-checkbox :label="'4'">压占面积</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="23">
                            <el-form-item label="三级树内容：" label-width="120px" prop="threeTreeContent" :rules="
                  treeContentFlagThree
                    ? [
                        {
                          required: true,
                          message: '请选择三级树内容',
                          trigger: 'change',
                        },
                      ]
                    : []
                ">
                                <el-checkbox-group v-model="form.threeTreeContent">
                                    <!-- <el-checkbox :label="'1'">分组字段值</el-checkbox> -->
                                    <el-checkbox :label="'2'">查询个数</el-checkbox>
                                    <el-checkbox :label="'4'">压占面积</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="23">
                            <el-form-item label="是否现状分析：" label-width="120px">
                                <el-switch v-model="form.isFormula"></el-switch>
                                <i class="funButton el-icon-info" @click="showFunctionList.show = true;showFunctionList.data = form.analysisFormula"></i>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                    <el-dialog :title="'自定义公式'" :visible.sync="showFunctionList.show" append-to-body width="550px">
                        <el-input type="textarea" :rows="15" placeholder="请输自定义公式" v-model="showFunctionList.data"></el-input>
                        <div class="button_line">
                            <el-button type="primary" @click="
                  showFunctionList.show = false;
                  form.analysisFormula = showFunctionList.data;
                ">确定</el-button>
                            <el-button @click="showFunctionList.show = false">取消</el-button>
                        </div>
                    </el-dialog>
                    <el-dialog :title="'编辑列表显示字段'" :visible.sync="showTableList.show" append-to-body width="650px">
                        <el-transfer :titles="['候选列表', '已选列表']" class="transfer_table_list" 
                        :props="{ key: 'value', label: 'label' }" v-model="tableValue" :data="tablelist"></el-transfer>
                        <br />
                        <br />
                        <div class="button_line">
                            <el-button type="primary" @click="setTableDataObject">确定</el-button>
                            <el-button @click="reset">取消</el-button>
                        </div>
                    </el-dialog>
                    <el-row>
                        <el-col :span="23">
                            <el-form-item class="button_line">
                                <el-button type="success" @click="getData">保存</el-button>
                                <el-button type="danger" @click="onDeleteEvent">删除</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script>
export default {
    props: ["configData", "formData", "refashData"],
    data() {
        return {
            tableValueList:[],
            showTableList: { show: false },
            rules: {
                labelName: [
                    { required: true, message: "标签名称不能为空", trigger: "change" },
                ],
                showChineseField: [
                    { required: true, message: "列表显示字段不能为空", trigger: "change" },
                ],
                groupDictionaries: [
                    { required: true, message: "分组参照字典不能为空", trigger: "change" },
                ],
                groupEnglishField: [
                    { required: true, message: "分组字段不能为空", trigger: "change" },
                ],
            },
            treeContentFlagTop: false,
            treeContentFlagTwo: false,
            treeContentFlagThree: false,
            tableValue: [],
            tablelist: [],
            showItem: true,
            showFunctionList: { show: false, data: "" },
            TreeTypes: [],
            form: {
                ztsjyId: "",
                labelName: "",
                isOpenTree: false,
                isOpenMap: false,
                isFormula: false,
                showHierarchy: 0,
                topTreeContent: [],
                twoTreeContent: [],
                threeTreeContent: [],
                groupDictionaries: "",
                analysisFormula: "",
                showEnglishField: "",
                showChineseField: "",
                groupEnglishField: "",
                groupChineseField: "",
            },
        };
    },
    mounted() {
        this.$api = this.$API.get(['onemap:analysisSettings']);
        this.$api.dcSelectListForSpecific({ remark: '一张图系统-业务分析' },(res) => {
            this.TreeTypes = res;
        });
        var _data = JSON.parse(JSON.stringify(this.configData));
        this.form.gjpzId = _data.form.gjpzId;
        this.form.labelName = _data.form.labelName;
        this.form.isOpenTree = _data.form.isOpenTree == "0" ? true : false;

        this.treeContentFlagTop = this.form.isOpenTree;
        this.treeContentFlagTwo = this.form.isOpenTree;
        this.treeContentFlagThree = this.form.isOpenTree;
        this.form.isOpenMap = _data.form.isOpenMap == "0" ? true : false;
        this.form.isFormula = _data.form.isFormula == "0" ? true : false;
        this.form.showHierarchy = _data.form.showHierarchy;
        this.form.topTreeContent = _data.form.topTreeContent
            ? _data.form.topTreeContent.split(",")
            : [];
        this.form.twoTreeContent = _data.form.twoTreeContent
            ? _data.form.twoTreeContent.split(",")
            : [];
        this.form.threeTreeContent = _data.form.threeTreeContent
            ? _data.form.threeTreeContent.split(",")
            : [];
        this.form.groupDictionaries = _data.form.groupDictionaries;
        this.form.analysisFormula = _data.form.analysisFormula;
        this.form.showEnglishField = _data.form.showEnglishField;
        this.form.showChineseField = _data.form.showChineseField;
        this.form.groupEnglishField = _data.form.groupEnglishField;
        this.form.groupChineseField = _data.form.groupChineseField;
        this.hierarchyChange(this.form.showHierarchy);
    },
    methods: {
        reset(){
            this.showTableList.show = false
            this.tableValue = []
        },
        setGroupField() {
            var _data = JSON.parse(JSON.stringify(this.configData));
            var _TableTree = JSON.parse(JSON.stringify(this.$parent.TreeTypes));
            var $data = [];
            for (let i = 0; i < _TableTree.length; i++) {
                const element = _TableTree[i];
                if (element.label) {
                    $data.push(element);
                }
            }
            this.tablelist = $data;
            var _tabbleValueEnglish = _data.form.showEnglishField.split(",");
            this.tableValue = _tabbleValueEnglish;
        },
        //   显示层级发生改变时，验证信息修改。
        hierarchyChange(e) {
            if (this.form.isOpenTree) {
                this.isShowHierarchySwitch(e);
            } else {
                this.treeContentFlagTop = false;
                this.treeContentFlagTwo = false;
                this.treeContentFlagThree = false;
            }
        },
        //   switch验证信息公有方法。
        isShowHierarchySwitch(value) {
            switch (value) {
                case 1:
                    this.treeContentFlagTop = true;
                    this.treeContentFlagTwo = true;
                    this.treeContentFlagThree = false;
                    this.$refs["form"].clearValidate(["threeTreeContent"]);
                    break;
                case 2:
                    this.treeContentFlagTop = false;
                    this.treeContentFlagTwo = false;
                    this.treeContentFlagThree = true;
                    this.$refs["form"].clearValidate(["topTreeContent", 'twoTreeContent']);
                    break;
                case 0:
                    this.treeContentFlagTop = true;
                    this.treeContentFlagTwo = true;
                    this.treeContentFlagThree = true;
                    break;
                default:
                    this.treeContentFlagTop = false;
                    this.treeContentFlagTwo = false;
                    this.treeContentFlagThree = false;
                    this.$refs["form"].clearValidate(["topTreeContent", 'twoTreeContent', 'threeTreeContent']);
                    break;
            }
        },
        // 开启统计树开关触发方法。
        isOpenTreeChange(e) {
            if (e) {
                this.isShowHierarchySwitch(this.form.showHierarchy);
                this.$forceUpdate();
            } else {
                this.treeContentFlagTop = false;
                this.treeContentFlagTwo = false;
                this.treeContentFlagThree = false;
                this.$forceUpdate();
            }
        },
        clearTablelist() {
            this.tableValue = [];
            this.tablelist = [];
            this.showChineseField = "";
            this.showEnglishField = "";
        },
        getData() {
            if (!this.formData.ztsjyId) {
                this.$message({
                    type: "error",
                    message: "请先保存数据源信息",
                });
                return;
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var _data = JSON.parse(JSON.stringify(this.form));
                    _data.isOpenTree = _data.isOpenTree ? 0 : 1;
                    _data.isOpenMap = _data.isOpenMap ? 0 : 1;
                    _data.isFormula = _data.isFormula ? 0 : 1;
                    _data.topTreeContent = _data.topTreeContent.join(",");
                    _data.twoTreeContent = _data.twoTreeContent.join(",");
                    _data.threeTreeContent = _data.threeTreeContent.join(",");
                    // _data.gjpzId = this.configData.form.gjpzId;
                    _data.ztfxId = this.formData.ztfxId;
                    _data.ztsjyId = this.formData.ztsjyId;
                    _data.gjpzId = this.form.gjpzId;
                    for (let i = 0; i < this.tablelist.length; i++) {
                        const element = this.tablelist[i];
                        if (_data.groupEnglishField == element.value) {
                            _data.groupChineseField = element.label;
                            break;
                        }
                    }
                    let data = {
                        gjpzId: _data.gjpzId || undefined, // 主键 (String) 修改时必填，添加时忽略
                        ztfxId: _data.ztfxId, // 专题分析表主键 (String) 必填
                        ztsjyId: _data.ztsjyId, // 专题数据源表主键 (String) 必填
                        year: _data.year, // 年份 (String) 
                        labelName: _data.labelName, // 标签名称 (String) 必填
                        isOpenTree: _data.isOpenTree, // 是否开启统计树（0是、1否） (String) 
                        groupDictionaries: _data.groupDictionaries, // 分组参照字典 (String) 
                        showHierarchy: _data.showHierarchy, // 显示层级（0全部、1一级和二级） (int) 
                        topTreeContent: _data.topTreeContent, // 顶级树内容（1分组字段值、2查询个数、3图形面积总和4压占面积） (String) 
                        twoTreeContent: _data.twoTreeContent, // 二级树内容（1分组字段值、2查询个数、4压占面积） (String) 
                        threeTreeContent: _data.threeTreeContent, // 三级树内容（1分组字段值、2查询个数、4压占面积） (String) 
                        isOpenMap: _data.isOpenMap, // 是否开启统计图（0是、1否） (int) 
                        isFormula: _data.isFormula, // 是否有公式（0是、1否） (int) 
                        analysisFormula: _data.analysisFormula, // 分析公式 (String) 
                        showEnglishField: _data.showEnglishField, // 显示用字段英文名 (String) 
                        showChineseField: _data.showChineseField, // 显示用字段中文名 (String) 
                        groupEnglishField: _data.groupEnglishField, // 分组用字段英文名 (String) 
                        groupChineseField: _data.groupChineseField, // 分组用字段中文名 (String) 
                        versionNumber: _data.versionNumber || undefined, // 版本号(String) 修改时必填，添加时忽略
                    }
                    this.$api.saveOrUpdateSpecificConfig(data, (res) => {
                        this.form.gjpzId = res;
                        this.$emit("childSub", res);
                        this.refashData(true, "saveSource");
                        this.$message({
                            type: "success",
                            message: "操作成功",
                        });
                    });
                } else {
                    this.$message({
                        message: "表单信息填写错误",
                        type: "error",
                    });
                }
            });
        },
        onDeleteEvent() {
            this.$confirm("此操作将永久删除该标签页配置, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            })
                .then(() => {
                    if (this.form.gjpzId) {
                        this.$api.delSpecificConfig({gjpzId:this.form.gjpzId}, (res) => {
                            this.$parent.deleteEvent(this.configData);
                        });
                    } else {
                        this.$parent.deleteEvent(this.configData);
                    }
                })
                .catch(() => { });
        },
        DataBaseFoces() {
            this.showTableList.show = true;
            var _data = JSON.parse(JSON.stringify(this.$parent.TreeTypes));
            var $data = [];
            for (let i = 0; i < _data.length; i++) {
                const element = _data[i];
                if (element.label) {
                    $data.push(element);
                }
            }
            this.tablelist = $data;
        },
        setTableDataObject() {
            var string = [];
            var value = [];
            let selectList = [];
            var tableValue = JSON.parse(JSON.stringify(this.tableValue));
            for (let i = 0; i < this.tablelist.length; i++) {
                const element = this.tablelist[i];
                for (let d = 0; d < tableValue.length; d++) {
                    const chooseItem = tableValue[d];
                    if (element.value == chooseItem) {
                        string.push(element.label ? element.label : element.value);
                        value.push(element.value);
                        selectList.push(element)
                    }
                }
            }
            if (selectList.length !== 0) {
                this.tableValueList = selectList
            } else {
                this.tableValueList = []
            }
            this.form.showChineseField = string.join(",");
            this.form.showEnglishField = value.join(",");
            this.showTableList.show = false;
            this.$refs.showChineseField.clearValidate();
        },
    },
};
</script>

<style>
.config_item_title_title {
    cursor: pointer;
    border: 1px solid #ccc;
    padding: 12px 5px;
    margin: 10px 0 20px 0;
    border-radius: 5px;
}
.config_item_title_swith {
    float: right;
    margin: 0 10px 0 0;
    transition: all 0.5s;
}
.config_item_title_name {
    font-size: 17px;
    color: #666;
    margin: 0 0 0 10px;
}
.config_item_title_swith,
.config_item_title_name {
    display: inline-block;
}

.config_item_title_swith.show {
    transform: rotateZ(-180deg);
}

.transfer_table_list .el-checkbox {
    display: block;
}

.config_border {
    border-bottom: 1px solid #ccc;
    padding: 10px 15px;
    margin: 20px 0;
}

.button_line {
    padding: 20px 0 0 0;
    text-align: right;
}
.readOnly input {
    background: #f0f0f0;
    color: #999;
}

.funButton {
    color: #198ef8;
    margin: 0 0 0 20px;
    font-size: 22px;
    line-height: 42px;
    vertical-align: top;
    cursor: pointer;
}
</style>