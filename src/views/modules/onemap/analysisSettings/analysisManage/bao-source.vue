<template>
    <div>
        <el-card shadow="never" class="aui-card--fill">
            <el-row class="tac" :gutter="20">
                <el-col :span="3" class="leftTree">
                    <!-- <el-form :inline="true" label-position="right" @keyup.enter.native="getDataList()">
            <el-form-item style="margin-top:20px">
              <el-input v-model="filterText" placeholder="请输入关键词进行过滤"></el-input>
            </el-form-item>
                    </el-form>-->

                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>业务分析类别</span>
                            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                        </div>
                        <!-- :type="item.id == typeActive ? 'success' : ''"
                        size="medium"-->

                        <div v-for="item in baoSource" :key="item.dictValue" class="text item">
                            <el-button class="buttonForType" :class="{'el-button--primary' :item.dictValue == typeActive }" @click="handleFileList(item)" style="width:100%">{{item.dictLabel}}</el-button>
                        </div>
                    </el-card>

                    <!-- <el-tree :data="baoSource"
          highlight-current
          check-on-click-node
          :props="{ label: 'label', children: 'children' }"
          :default-expanded-keys="[defaultExpandedKeys]"
          :filter-node-method="filterNode"
          node-key="id"
          @node-click="handleFileList"
          ref="sourceListTree"
          accordion>
                    </el-tree>-->
                </el-col>
                <el-col :span="20" class="rightTable" v-if="flowKey" v-loading="loading">
                    <el-card shadow="never" class="aui-card--fill">
                        <div class="mod-sys__role">
                            <el-form :inline="true" label-position="right" :model="dataForm" @keyup.enter.native="getDataList()">
                                <el-form-item>
                                    <el-input clearable v-model="dataForm.businessName" placeholder="业务分析名称"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="getDataList()">查询</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <!-- v-if="$hasPermission('source:bao-source:save')" -->
                                    <el-button type="primary" @click="addOrUpdateHandle()">新建</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <!-- v-if="$hasPermission('source:bao-source:save')" -->
                                    <el-button type="danger" @click="deleteHandleBao()">删除</el-button>
                                </el-form-item>
                            </el-form>
                            <el-form v-model="dataForm">
                                <el-table :data="dataList.list" row-key="ywfxId" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
                                    <el-table-column type="selection" width="55"></el-table-column>
                                    <el-table-column prop="businessName" label="业务分析名称" header-align="center" align="center"></el-table-column>
                                    <el-table-column prop="theCategory" label="分类" header-align="center" align="center">
                                        <template slot-scope="scope">{{ baoSourceObj[scope.row.theCategory] ? baoSourceObj[scope.row.theCategory] : scope.row.theCategory }}</template>
                                    </el-table-column>
                                    <el-table-column prop="isEnable" label="是否启用" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.isEnable | isEnableVal}}</span>
                                        </template>
                                    </el-table-column>
                                    <!-- <el-table-column
                                        prop="businessState"
                                        label="业务状态"
                                        header-align="center"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.businessState | businessStateVal}}</span>
                                        </template>
                                    </el-table-column>-->
                                    <el-table-column prop="versionNumber" label="版本号" header-align="center" align="center"></el-table-column>
                                    <el-table-column label="操作" fixed="right" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.ywfxId)">{{ $t('update') }}</el-button>
                                            <el-button type="text" size="small" @click="deleteHandleBao(scope.row.ywfxId)">{{ $t('delete') }}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>

                            <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"></el-pagination>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <bao-add-source v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></bao-add-source>
        </el-card>
    </div>
</template>

<script>
import mixinViewModule from "@/mixins/source-module";
// import { dictionaryType } from "@/service/source";
import BaoAddSource from "./bao-add-source";
const isEnable = {
    0: {
        name: "是",
    },
    1: {
        name: "否",
    },
};
const businessState = {
    0: {
        name: "有效",
    },
    1: {
        name: "失效",
    },
};

export default {
    // mixins: [mixinViewModule],
    data() {
        return {
            typeActive: null,
            // mixinViewModuleOptions: {
            //     getDataListURL: "/caBusinessAnalysis/getBusinessAnaylsisList",
            //     getDataListIsPage: true,
            //     deleteURL: "/caBusinessAnalysis/updateBusinessAnaylsisState",
            //     deleteIsBatch: true,
            //     method: "post",
            //     treeBool: false,
            // },
            loading: false,
            baoSource: [],
            dataList: [],
            defaultExpandedKeys: [],
            flowKey: true,
            // 条件
            dataForm: {
                pageNum: 1,
                pageSize: 10,
                theCategory: "",
                businessName: "",
            },
            filterText: "",
            baoSourceObj: {},
            addOrUpdateVisible: false,
            modifyVisible: false,
            page: 1, // 当前页码
            limit: 10, // 每页数
            total: 0,
            dataListSelections: []
        };
    },
    components: {
        BaoAddSource,
    },
    watch: {
        filterText(val) {
            this.$refs.sourceListTree.filter(val);
        },
    },
    created() {
        this.$api = this.$API.get(['onemap:analysisSettings']);
        this.dictionaryType();
    },
    methods: {
        // tree
        getDataList(){this.dictionaryType()},
        dictionaryType() {
            let data = { value: 'YWFX', pid: 0 }
            this.$api.dicSelectList(data, (res) => {
                console.log(res);
                this.baoSource = res;
                for (let i = 0; i < this.baoSource.length; i++) {
                    const element = this.baoSource[i];
                    this.baoSourceObj[element.dictValue] = element.dictLabel;
                }

                if (this.baoSource[0]) {
                    this.handleFileList(this.baoSource[0]);
                }
            });

            // const params = {
            //   code: "ywfx",
            // };
            // dictionaryType(params).then((res) => {});
        },
        clearBefor(data) {
            // if(data.length <= 0) return this.$message({ type: 'warning',message: '请选择要删除的选项'})
            if (data.length > 0) {
                if (data.substring(data.length - 1) === ",") {
                    data = data.substring(0, data.length - 1);
                }
                return data;
            }

        },
        // 删除
        deleteHandleBao(id) {
            var ywfxId = "";
            if (!id) {
                ywfxId = this.clearBefor(this.dataListSelections);
            } else {
                ywfxId = id;
            }
            // console.log(ywfxId);
            if (!id && this.dataListSelections.length <= 0) {
                return this.$message({
                    message: this.$t("prompt.deleteBatch"),
                    type: "warning",
                    duration: 1000,
                });
            }
            this.$confirm(
                this.$t("prompt.info", { handle: this.$t("delete") }),
                this.$t("prompt.title"),
                {
                    confirmButtonText: this.$t("confirm"),
                    cancelButtonText: this.$t("cancel"),
                    type: "warning",
                }
            ).then(() => {
                this.$api.updateBusinessAnay({ywfxIds:ywfxId},res => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message({
                        message: this.$t("prompt.success"),
                        type: "success",
                        duration: 500,
                        onClose: () => {
                            this.dictionaryType();
                        },
                    });
                })
            });
        },
        handleFileList(data, obj, list) {
            this.typeActive = data.value;
            this.page = this.page,
            this.limit = this.limit,
            this.dataForm = {
                pageNum: this.page,
                pageSize: this.limit,
                theCategory: data.dictValue ? data.dictValue : 'fx1',
                businessName: this.dataForm.businessName,
            };
            this.$api.businessAnaylsisList(this.dataForm, res => {
                this.total = Number(res.total);
                this.dataList = res;
            })
            if (data.dictValue) {
                // this.mixinViewModuleOptions.treeBool = true;
                this.flowKey = data.dictValue;
            }
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.flowname.indexOf(value) !== -1;
        },

        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                //console.log(this.$refs.addOrUpdate)
                this.$refs.addOrUpdate.dataForm.id = id
                this.$refs.addOrUpdate.init()
            })
        },
        // 多选
        dataListSelectionChangeHandle(val) {
            var ywfxIds = ''
            for (let i = 0; i < val.length; i++) {
                // console.log(99)
                // console.log(val[i].ywfxId)
                ywfxIds += val[i].ywfxId + ','
            }
            this.dataListSelections = ywfxIds
        },
        // 修改
        modifyLayer(id) {
            this.modifyVisible = true
            this.$nextTick(() => {
                // console.log(id)
                this.$refs.modifyUpdate.dataForm.sjyId = id
                this.$refs.modifyUpdate.init()
            })
        },
        // 分页, 每页条数
        pageSizeChangeHandle(val) {
            this.page = 1
            this.dataForm.pageNum = 1
            this.limit = val
            this.dataForm.pageSize = val
            this.dictionaryType()
        },
        // 分页, 当前页
        pageCurrentChangeHandle(val) {
            this.page = val
            this.dataForm.pageNum = val
            this.dictionaryType()
        }
    },
    filters: {
        isEnableVal(val) {
            return isEnable[val].name;
        },
        businessStateVal(val) {
            return businessState[val].name;
        },
    },
};
</script>

<style>
/* .leftTree {
    padding-right: 20px;
} */
.rightTable {
    border-left: 1px solid #f1f4f5;
    /* padding-left: 20px; */
}
</style>
