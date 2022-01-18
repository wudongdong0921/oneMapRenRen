<template>
    <div>
        <el-card shadow="never" class="aui-card--fill">
            <el-row class="tac" :gutter="20">
                <el-col :span="3" class="leftTree">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>分析类别</span>
                        </div>
                        <div v-for="item in types" :key="item.dictValue" class="text item">
                            <el-button class="buttonForType" :class="{ 'el-button--primary': item.dictValue == typeActive }" @click="activeTypeEvent(item)" style="width: 100%">{{ item.dictLabel }}</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="20" class="rightTable">
                    <el-card shadow="never" class="aui-card--fill">
                        <div class="mod-sys__role">
                            <el-input clearable v-model="searchText" placeholder="请输入专题名称" style="display: inline-block; margin: 0 10px 0 0; width: auto"></el-input>
                            <el-button type="primary" @click="query()">查询</el-button>
                            <el-button type="primary" @click="addBusinessEvent()">添加专题</el-button>
                            <br />
                            <br />

                            <!-- @expand-change="changeTableChildrenEvent" -->

                            <el-table ref="table" :data="tableData" style="width: 100%" @expand-change="changeTableChildrenEvent" v-loading="tableLoading">
                                >
                                <el-table-column type="expand" align="center">
                                    <template slot-scope="props">
                                        <el-table :data="props.row.children" style="width: 100%">
                                            <el-table-column label="年份" prop="year" v-if="props.row.isTimeIndex == 0"></el-table-column>
                                            <el-table-column label="数据源" prop="sjyid"> <template slot-scope="scope">{{ SourceObject[scope.row.sjyId] }}</template>
                                            </el-table-column>
                                            <el-table-column label="数据表" prop="sjbid">
                                                <template slot-scope="scope">{{ SJBObject[scope.row.sjbId] }}</template>
                                            </el-table-column>
                                            <el-table-column label="操作" prop="desc">
                                                <template slot-scope="rowprops">
                                                    <el-button type="text" @click=" editConfigEvent( rowprops.row, props.row.ztfxId, props.row.isTimeIndex, props.row ) ">编辑高级配置</el-button>

                                                    <!-- v-if="props.row.isTimeIndex == '0' || props.row.children.length == 0" -->

                                                    <el-button type="text" v-if=" !( props.row.isTimeIndex == '0' && props.row.isUniformConfiguration == '0' && rowprops.row.year == props.row.dataYear ) " @click="deleteConfig(rowprops.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </template>
                                </el-table-column>
                                <el-table-column label="专题名称" prop="specialName" align="center"></el-table-column>
                                <el-table-column label="分析类型" prop="analysisTyp" align="center" width="120">
                                    <template slot-scope="props">{{ analysisTypesObject[props.row.analysisType] ? analysisTypesObject[props.row.analysisType] : props.row.analysisType }}</template>
                                </el-table-column>
                                <el-table-column label="开启时间索引" align="center" width="120">
                                    <template slot-scope="props">{{ props.row.isTimeIndex == "0" ? "是" : "否" }}</template>
                                </el-table-column>
                                <el-table-column label="统一高级设置" align="center" width="120">
                                    <template slot-scope="props">{{ props.row.isUniformConfiguration == "0" ? "是" : "否" }}</template>
                                </el-table-column>
                                <el-table-column label="专题分析编码" prop="specialCode" align="center" width="200"></el-table-column>
                                <!-- <el-table-column label="创建时间" prop="creatTime"></el-table-column> -->
                                <!-- <el-table-column label="创建人" prop="author"></el-table-column> -->
                                <el-table-column label="操作" prop="desc" align="center" width="250">
                                    <template slot-scope="props">
                                        <el-button type="text" @click="editBusinessEvent(props.row)">修改基本信息</el-button>
                                        <el-button v-if=" props.row.isTimeIndex == '0' || props.row.children.length == 0 " type="text" @click="addConifgItem(props.row)">添加高级配置</el-button>
                                        <el-button type="text" @click="deleteBusiness(props.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"></el-pagination>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog :title="businessOptions.isCreat ? '添加专题分析' : '修改专题分析'" :visible.sync="businessOptions.show" :destroy-on-close="true" append-to-body width="700px">
                <business v-if="businessOptions.show" ref="business" :closeEvent="closeEvent"></business>
            </el-dialog>

            <el-dialog :title="type === 0 ? '添加高级配置' : '编辑高级配置'" :destroy-on-close="true" append-to-body :visible.sync="configItem.show" width="1200px">
                <config ref="configs" v-if="configItem.show" :closeEvent="closeEvent"></config>
            </el-dialog>
            <el-dialog :title="type === 0 ? '添加高级配置' : '编辑高级配置'" :destroy-on-close="true" append-to-body :visible.sync="secondToneShow" width="1200px">
                <SecondTone ref="SecondTone" v-if="secondToneShow" @closeDialog="closeEvent"></SecondTone>
            </el-dialog>
            <el-dialog :title="type === 0 ? '添加高级配置' : '编辑高级配置'" :destroy-on-close="true" append-to-body :visible.sync="tripleToneShow" width="1200px">
                <TripleTone ref="TripleTone" v-if="tripleToneShow" :closeEvent="closeEvent"></TripleTone>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import business from "./special-business-add-update";
import config from "./special_box/advConfig";
import SecondTone from "./SecondTone";
import TripleTone from "./TripleTone";

export default {
    components: {
        business,
        config,
        SecondTone,
        TripleTone,
    },
    data() {
        return {
            total: 0,
            pageNum: 1,
            pageSize: 10,
            searchText: "",
            tableLoading: true,
            configItem: {
                show: false,
                isCreat: false,
                data: {},
            },
            config: {
                show: false,
                isCreat: false,
                data: {},
            },
            businessOptions: {
                show: false,
                isCreat: false,
                data: {},
            },
            typeActive: "1",
            types: [],
            tableData: [],
            SJBObject: {},
            SourceObject: {},
            analysisType: [],
            analysisTypesObject: {},
            TypesObject: {},
            tableOpenLength: 0,
            tableExpands: [],
            type: 0,
            secondToneShow: false,
            tripleToneShow: false,
        };
    },
    mounted() {
        this.$api = this.$API.get(['onemap:analysisSettings']);
        this.getTypes();
        // apis.Analysis.getDetail('ztfx_23',function(res){
        //   console.log(res);
        // })
    },
    methods: {
        activeTypeEvent(item) {
            this.searchText = "";
            this.typeActive = item.dictValue;
            this.tableExpands = [];
            this.getAnalyzeList(this.typeActive);
        },
        getTypes() {
            let data1 = { value: 'ZTFX', pid: 0 }
            this.$api.dicSelectList(data1, res => {
                this.types = res;
                this.typeActive = res[0].value;
                for (let i = 0; i < this.types.length; i++) {
                    const element = this.types[i];
                    this.TypesObject[element.value] = element.label;
                }
                this.getAnalyzeList(this.typeActive);
            })
            let data2 = { value: 'FXLX', pid: 0 }
            this.$api.dicSelectList(data2, res => {
                this.analysisType = res;
                for (let i = 0; i < this.analysisType.length; i++) {
                    const element = this.analysisType[i];
                    this.analysisTypesObject[element.dictValue] = element.dictLabel;
                }
            })
            this.$api.lyerDataSource('', (res) => {
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    this.SourceObject[element.value] = element.label;
                    this.getSJBObject(element.value);
                }
            });
        },
        // changeTableExpand() {
        //     console.log();
        // },
        // getRowKeys(row) {
        //     return row.ztfxId;
        // },
        getSJBObject(type) {
            this.$api.layerDataList2({ sjyId: type }, (res) => {
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    this.SJBObject[element.value] = element.label;
                }
            });
        },
        query() {
            this.pageNum = 1;
            this.getAnalyzeList();
        },
        getAnalyzeList(type) {
            if (!type) {
                type = this.typeActive;
            }
            let data = {
                specialName: this.searchText,
                type: type ? type : 'fx1',
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                specialClassify: this.typeActive ? this.typeActive : 'fx1'
            }
            this.$api.qerySpecificAnalysisTableTree(data, (res) => {
                this.tableData = res.list;
                this.total = parseInt(res.total);
                this.tableLoading = false;
                this.$nextTick(() => {
                    var _array = JSON.parse(JSON.stringify(this.tableExpands));
                    for (let i = 0; i < this.tableData.length; i++) {
                        const element = this.tableData[i];
                        var index = _array.indexOf(element.ztfxId);
                        if (index != -1) {
                            this.$refs.table.toggleRowExpansion(element, true);
                        }
                    }
                    this.$nextTick(() => {
                        this.tableExpands = _array;
                    });
                });
            })
        },
        changeTableChildrenEvent(row) {
            var index = this.tableExpands.indexOf(row.ztfxId);
            if (index == -1) {
                this.tableExpands.push(row.ztfxId);
            } else {
                this.tableExpands.splice(index, 1);
            }

            // console.log(this.tableExpands);
            // if (!row.show) {
            //     // this.$set(row, "loading", true);
            //     // apis.getSpecificAnalysis(row.ztfxId, (res) => {
            //     //     this.$set(row, "loading", false);
            //     //     this.$set(row, "children", res);
            //     // });
            // }
        },
        editBusinessEvent(item) {
            this.businessOptions.show = true;
            this.businessOptions.isCreat = false;
            this.$nextTick(() => {
                this.$refs.business.addOptions(
                    {
                        form: item,
                    },
                    "edit"
                );
            });
        },
        addBusinessEvent() {
            this.businessOptions.show = true;
            this.businessOptions.isCreat = true;

            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.business.addOptions({
                        form: {
                            specialCode: "", // 专题编码
                            specialName: "", // 专题名称
                            specialClassify: "", //	专题分类
                            analysisType: "djfx", // 分析类型
                            mapAddress: "", // 地图地址
                            isTimeIndex: 1, // 是否开启时间索引（0是、1否）
                            isUniformConfiguration: 1, // 是否统一高级配置（0是、1否）
                            dataReference: "", // 数据表
                            dataYear: "",
                        },
                    });
                }, 1);
            });
        },
        deleteBusiness(item) {
            this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                this.$api.delSpecificAnalysis({ ztfxId: item.ztfxId }, () => {
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    this.getAnalyzeList(this.typeActive);
                });
            });
        },
        addConifgItem(row) {
            this.type = 0;
            if (row.analysisType === "EDXZFX") {
                this.secondToneShow = true;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.SecondTone.setData(row, "creat");
                    }, 1);
                });
            } else if (row.analysisType === "SDXZFX") {
                this.tripleToneShow = true;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.TripleTone.setData(row, "creat");
                    }, 1);
                });
            } else {
                this.configItem.show = true;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.configs.setData(row, "creat");
                        // this.$refs.TripleTone.setData(row, "creat")
                    }, 1);
                });
            }
        },
        closeEvent(type, status, closeDialogWhenAfterSaveEvent) {
            this.secondToneShow = false;
            if (status != "saveSource") {
                this.businessOptions.show = false;
                this.config.show = false;
                this.configItem.show = false;
            }
            if (type) {
                this.getAnalyzeList(this.typeActive);
            }
            if (closeDialogWhenAfterSaveEvent) {
                this.businessOptions.show = false;
                this.config.show = false;
                this.configItem.show = false;
            }
        },
        deleteConfig(row) {
            this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                this.$api.delSpecificData({ ztsjyId: row.ztsjyId }, () => {
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    this.getAnalyzeList(this.typeActive);
                });
            });
        },
        editConfigEvent(row, ztfxId, isTimeIndex, rowData) {
            this.type = 1;
            // this.tripleToneShow = true
            if (!row.hasOwnProperty("ztfxId")) {
                row.ztfxId = ztfxId;
            }
            this.$api.selectFXLX({ztfxId:ztfxId}, (res) => {
                if (res === "EDXZFX") {
                    this.secondToneShow = true;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$refs.SecondTone.setData(
                                row,
                                "update",
                                isTimeIndex,
                                rowData
                            );
                        }, 1);
                    });
                } else if (res === "SDXZFX") {
                    this.tripleToneShow = true;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$refs.TripleTone.setData(
                                row,
                                "update",
                                isTimeIndex,
                                rowData
                            );
                        }, 1);
                    });
                } else {
                    this.configItem.show = true;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$refs.configs.setData(row, "update", isTimeIndex, rowData);
                        }, 1);
                    });
                }
            }, ztfxId);
        },
        pageSizeChangeHandle(val) {
            this.tableExpands = [];
            this.pageNum = 1;
            this.pageSize = val;
            this.getAnalyzeList();
        },
        pageCurrentChangeHandle(val) {
            this.tableExpands = [];
            this.pageNum = val;
            this.getAnalyzeList();
        },
    },
};
</script>
<style scope>
.min_height {
    min-height: calc(calc(100vh - 50px - 38px - 30px));
}
.page_content {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
}
.leftPart {
    position: absolute;
    top: 30px;
    left: 20px;
    bottom: 30px;
    width: 200px;
}
.rightPart {
    position: relative;
    left: 280px;
    padding: 30px 0;
    width: calc(calc(100vw - 550px));
    /* overflow-y: auto; */
}
.text.item {
    margin: 0 0 10px 0;
}

/* .leftTree {
    padding-right: 20px;
} */
.rightTable {
    border-left: 1px solid #f1f4f5;
    /* padding-left: 10px; */
}
</style>