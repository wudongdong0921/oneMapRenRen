<template>
    <div>
        <el-dialog :title="dataForm.ywfxId ? '修改业务分析' :'新建业务分析'" :visible.sync="visible" :destroy-on-close="true">
            <div>
                <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="160px">
                    <el-form-item prop="businessName" label="业务分析名称">
                        <el-input maxlength="85" show-word-limit v-model="dataForm.businessName" placeholder="请输入业务分析名称"></el-input>
                    </el-form-item>
                    <el-form-item label="底图地址">
                        <el-select style="width:100%" v-model="dataForm.mapAddress" placeholder="请选择" prop="mapAddressName">
                            <el-option v-for="item in mapAddressList" :key="item.mapId" :label="item.mapName" :value="item.mapId"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item prop="mapAddressName" label="底图名称:" :label-width="formLabelWidth">
                        <el-input v-model="dataForm.mapAddressName" placeholder="请输入底图名称"></el-input>
                    </el-form-item>

                    <el-form-item prop="mapAddress" label="底图地址:" :label-width="formLabelWidth">
                        <el-input v-model="dataForm.mapAddress" placeholder="请输入底图地址"></el-input>
                        <div style="color:red">例如：http://192.168.0.20:30952/iserver/services/map-xzqjwd-tmli6e3xqq/rest/maps/xzqjwd%40xzqjwd</div>
                    </el-form-item> -->

                    <el-form-item label="是否开启年份索引：">
                        <el-switch v-model="dataForm.isTimeIndex" :disabled="!!dataForm.ywfxId"></el-switch>
                        <!--  -->
                    </el-form-item>

                    <el-form-item prop="theCategory" label="所属业务分类">
                        <el-select style="width:100%" v-model="dataForm.theCategory" placeholder="请选择">
                            <el-option v-for="item in databaseType" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="待选专题" prop="belongingTypeChecks">
                        <!-- prop="dataForm.belongingTypeChecks" -->
                        <el-select style="width:100%" v-model="dataForm.belongingTypeChecks" multiple placeholder="请选择" @change="changeBelongingTypeStatrs">
                            <el-option v-for="item in belongingTypeRes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="包含专题" prop="cloneBelongingTypeResInput">
                        <!-- prop="cloneBelongingTypeResProp" -->
                        <el-input type="text" v-model="dataForm.cloneBelongingTypeResInput" hidden></el-input>
                        <div v-if="cloneBelongingTypeRes.length">
                            <div class="belongingBox" v-for="(item,index) in cloneBelongingTypeRes" :key="index + '_belongingTypeRes'">
                                <div class="belongingBoxTitleBox">{{item.label}}</div>
                                <div class="belongingBoxBodyBox">
                                    <div class="belongingBoxBodyitem" v-for="(child,childIndex) in item.children" :key="childIndex+ '_child'">
                                        <label class="el-checkbox" @click="child.isCheckd = !child.isCheckd">
                                            <span class="el-checkbox__input" :class="{'is-checked' :child.isCheckd }">
                                                <span class="el-checkbox__inner"></span>
                                            </span>
                                            <span class="el-checkbox__label">{{child.specialName}}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input maxlength="200" show-word-limit v-model="dataForm.remark"></el-input>
                    </el-form-item>
                    <el-form-item prop="isEnable" label="是否启用">
                        <el-switch v-model="dataForm.isEnable" active-text="on" inactive-text="off"></el-switch>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer" style="float:right">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible">保存</el-button>
                </div>
                <div style="clear:both">&nbsp;</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    data() {
        return {
            loading: true,
            databaseType: [],
            belongingType: [],
            dataSheet: [],
            visible: false,
            // formLabelWidth: "120px",
            isAdd: true,  // 判断是否 新增或编辑
            dataForm: {
                ywfxId: "",
                businessName: "",
                mapAddress: "",
                mapAddressName: "",
                isTimeIndex: false,
                // belongingTypeValue: "",
                theCategory: "",
                shuttle: [],
                isEnable: true,
                remark: '',
                mapAddress: '',
                belongingTypeChecks: [],
                cloneBelongingTypeResInput: '1',
            },
            url: "",
            valueTrans: [],
            filterMethod(query, item) {
                return item.pinyin.indexOf(query) > -1;
            },
            belongingTypeRes: [],
            belongingTypeResObj: {},
            cloneBelongingTypeRes: [],
            // dataForm.belongingTypeChecks: [],
            mapAddressList: [],
            mapAddressObj: {},

            rules: {
                businessName: [
                    { required: true, message: "请输入业务分析名称", trigger: "blur", }
                ],
                belongingTypeChecks: [{
                    required: true, message: '请输入待选专题', trigger: ['blur', 'change'], type: 'array'
                }],
                cloneBelongingTypeRes: [{
                    required: true, message: '请选择有效的专题分析数据', trigger: 'blur'
                }],
                theCategory: [
                    { required: true, message: "请选择所属分类", trigger: ['blur', 'change'], }
                ],
                mapAddressName: [
                    { required: false, message: "底图地址", trigger: ['blur', 'change'] }
                ],
                cloneBelongingTypeResInput: [{
                    required: true, message: "包含专题不能为空", trigger: 'blur'
                }]
            }
        }
    },
    watch: {
        visible: function (newVal) {
            if (newVal === false) {
                this.resetDataForm();
                this.isAdd = true
            }
        },
    },
    created() { },
    mounted() {
        this.$api = this.$API.get(['onemap:analysisSettings']);
    },
    methods: {
        resetDataForm() {
            this.dataForm = {
                ywfxId: "",
                businessName: "",
                mapAddress: "",
                mapAddressName: "",
                isTimeIndex: false,
                // belongingTypeValue: "",
                theCategory: "",
                shuttle: [],
                isEnable: true,
                remark: '',
                mapAddress: '',
                belongingTypeChecks: [],
                cloneBelongingTypeResInput: '1',
            };
        },
        init() {
            var _this = this;
            if (this.dataForm.id) {
                this.isAdd = false
            }
            this.visible = true;
            const param = {
                ywfxId: this.dataForm.id,
            };
            this.loading = true;
            this.cloneBelongingTypeRes = []
            this.belongingTypeRes = [];
            // this.dataForm.belongingTypeChecks = [];
            this.getPictureBaseMap()
            this.dictionaryType((res) => {
                var PromiseArray = [];
                for (let i = 0; i < res.length; i++) {
                    let element = res[i];
                    PromiseArray.push(this.GetClsssfilySelect(element));
                };
                Promise.all(PromiseArray).then((values) => {
                    for (let i = 0; i < values.length; i++) {
                        let item = values[i];
                        var pushData = {
                            label: item.value.dictLabel,
                            value: item.value.dictValue,
                            children: [],
                        };
                        this.belongingTypeRes.push(pushData);
                        for (let y = 0; y < item.children.length; y++) {
                            const _item = item.children[y];
                            pushData.children.push({
                                isCheckd: false,
                                specialName: _item.specialName,
                                ztfxId: _item.ztfxId,
                                ztType: item.value.value,
                            });
                        }
                    };
                    for (let item of this.belongingTypeRes) {
                        this.belongingTypeResObj[item.value] = item
                    }
                    this.belongingTypeData(() => {
                        if (!this.isAdd) {
                            let data = { ywfxId: this.dataForm.id }
                            this.$api.businessAnaylsisById2(data, res => {
                                var list = res;
                                _this.dataForm.belongingTypeChecks = [];
                                this.cloneBelongingTypeRes = [];
                                for (let i = 0; i < list.anaylsisSpecificList.length; i++) {
                                    const element = list.anaylsisSpecificList[i];
                                    if (_this.dataForm.belongingTypeChecks.indexOf(element.zt_type) == -1) {
                                        _this.dataForm.belongingTypeChecks.push(element.zt_type);
                                    };
                                };
                                for (let j = 0; j < this.belongingTypeRes.length; j++) {
                                    const cloneItem = this.belongingTypeRes[j];
                                    for (let k = 0; k < list.anaylsisSpecificList.length; k++) {
                                        const listItem = list.anaylsisSpecificList[k];
                                        if (cloneItem.value == listItem.zt_type) {
                                            this.cloneBelongingTypeRes.push(cloneItem)
                                            break;
                                        }
                                    }
                                }
                                for (let i = 0; i < this.belongingTypeRes.length; i++) {
                                    const item = this.belongingTypeRes[i];
                                    this.belongingTypeResObj[item.value] = item
                                    if (_this.dataForm.belongingTypeChecks.indexOf(item.value) != -1) {
                                        item.show = true;
                                        for (let d = 0; d < list.anaylsisSpecificList.length; d++) {
                                            const listData = list.anaylsisSpecificList[d];
                                            for (let y = 0; y < item.children.length; y++) {
                                                const child = item.children[y];
                                                if (child.ztfxId == listData.ztfx_id) {
                                                    child.isCheckd = true;
                                                };
                                            };
                                        };
                                    };
                                };
                                for (let i = 0, len = this.cloneBelongingTypeRes.length; i < len; i++) {
                                    let element = this.cloneBelongingTypeRes[i]
                                    if (element && !element.show) {
                                        this.cloneBelongingTypeRes.splice(i, 1)
                                    }
                                }
                                this.loading = false;
                                // this.dataForm = list.caBusinessAnalysis;
                                this.dataForm.ywfxId = list.caBusinessAnalysis.ywfxId;
                                this.dataForm.businessName = list.caBusinessAnalysis.businessName;
                                this.dataForm.theCategory = list.caBusinessAnalysis.theCategory;
                                this.dataForm.mapAddress = list.caBusinessAnalysis.mapAddress;
                                this.dataForm.mapAddressName = list.caBusinessAnalysis.mapAddressName;

                                this.dataForm.isEnable = list.caBusinessAnalysis.isEnable == 0 ? true : false;
                                this.dataForm.isTimeIndex = list.caBusinessAnalysis.isTimeIndex == 0 ? true : false;
                                this.dataForm.remark = list.caBusinessAnalysis.remark
                            })
                        } else {
                            this.loading = false;
                            this.resetDataForm();
                        }
                    });
                });
            });
        },
        selectChange() {
            this.$forceUpdate();
        },
        GetDictionaryType(callback) {
            let data = { value: 'ZTFX', pid: 0 }
            this.$api.dicSelectList(data, (res) => {
                callback(res);
            });
        },
        GetClsssfilySelect(data) {
            console.log(data)
            return new Promise((resolve, reject) => {
                this.$api.qerySpecificAnalysisTableTree({
                    specialClassify: data.dictValue,
                    specialName: '',
                    pageNum: 1,
                    pageSize: 9999,
                }, (res) => {
                    resolve({
                        value: data,
                        children: res.list,
                    });
                });
            });
        },
        changeBelongingTypeStatrs(e) {
            let belongingValue = e
            for (let ele of this.cloneBelongingTypeRes) {
                if (belongingValue.indexOf(ele.value) === -1) {
                    for (let item of ele.children) {
                        item.isCheckd = false
                    }
                }
            }
            this.cloneBelongingTypeRes = []
            for (let i = 0, len = belongingValue.length; i < len; i++) {
                this.cloneBelongingTypeRes.push(this.belongingTypeResObj[belongingValue[i]])
            }
        },
        getPictureBaseMap() {
            this.$api.mapSelectForMap({}, res => {
                this.mapAddressList = res
                for (let item of this.mapAddressList) {
                    this.mapAddressObj[item.mapId] = item
                }
            })
        },
        dictionaryType(callback) {
            let data = { value: 'ZTFX', pid: 0 }
            this.$api.dicSelectList(data, (res) => {
                this.belongingType = res;
                callback(res);
            });
        },
        // 所属业务分类
        belongingTypeData(callback) {
            let data = { value: 'YWFX', pid: 0 }
            this.$api.dicSelectList(data, (res) => {
                this.databaseType = res;
                callback();
            });
        },
        clsssfilySelect(val) {
            this.$api.qerySpecificAnalysisTableTree({
                type: val,
                text: '',
                pageNum: 1,
                pageSize: 9999,
            }, (res) => {
                this.dataSheet = res.list;
                this.dataForm.shuttle = [];
            });
        },
        dialogFormVisible() {

            console.log(this.cloneBelongingTypeRes.length)


            if (this.cloneBelongingTypeRes.length > 0) {
                this.dataForm.cloneBelongingTypeResInput = "1";
            } else {
                this.dataForm.cloneBelongingTypeResInput = '';
            }
            console.log(this.dataForm.cloneBelongingTypeResInput)

            this.$refs.dataForm.validate((valid) => {
                console.log(this.dataForm.cloneBelongingTypeResInput)
                if (valid) {
                    let param = {};
                    var anaylsisSpecificList = [];
                    for (let ele of this.cloneBelongingTypeRes) {
                        if (ele.children) {
                            for (let item of ele.children) {
                                if (item.isCheckd) {
                                    anaylsisSpecificList.push({
                                        ztfxId: item.ztfxId,
                                        ztType: ele.value,
                                    });
                                }
                            }
                        }
                    }


                    if (anaylsisSpecificList.length == 0) {
                        this.$message.error('请至少选择一条有效的专题分析数据');
                        return;
                    };

                    if (this.cloneBelongingTypeRes.length == 0) {
                        this.$message.error('请选择包含专题');
                        return;
                    }

                    param.caBusinessAnalysis = {
                        ywfxId: this.dataForm.ywfxId
                            ? this.dataForm.ywfxId
                            : "null",
                        businessName: this.dataForm.businessName,
                        theCategory: this.dataForm.theCategory,
                        isEnable: this.dataForm.isEnable ? 0 : 1,
                        // mapAddress: this.dataForm.mapAddress,
                        // mapAddressName: this.dataForm.mapAddressName,
                        isTimeIndex: this.dataForm.isTimeIndex ? 0 : 1,
                        remark: this.dataForm.remark,
                        mapAddress: this.dataForm.mapAddress,
                        mapAddressName: this.mapAddressObj[this.dataForm.mapAddress] == null ? '' : this.mapAddressObj[this.dataForm.mapAddress].mapName
                    };
                    param.anaylsisSpecificList = anaylsisSpecificList;
                    this.loading = true;
                    if (!this.isAdd) {
                        this.$api.updateBusiness(param, (res) => {
                            this.loading = false;
                            this.visible = false;
                            this.$message({
                                type: "success",
                                message: "操作成功",
                            });
                            this.$emit("refreshDataList");
                        }, (err) => {
                            this.$message({
                                type: "error",
                                message: res.msg,
                            })
                        })
                    } else {
                        this.$api.saveBusiness(param, (res) => {
                            this.loading = false;
                            console.log('%o', res)
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
                }
            });
        },
    },
};
</script>

<style scope>
.belongingBox {
    width: 30%;
    margin: 0 3% 0 0;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    float: left;
}
.belongingBox .belongingBoxTitleBox {
    text-align: center;
    border-bottom: 1px solid #dcdfe6;
}

.belongingBox .belongingBoxBodyBox {
    height: 200px;
    padding: 5px 10px;
    overflow-y: auto;
}

.belongingBox .belongingBoxBodyitem {
    padding: 0 5px;
    border-bottom: 1px solid #dcdfe6;
}
.belongingBox .belongingBoxBodyitem:last-child {
    border-bottom: none;
}
</style>
