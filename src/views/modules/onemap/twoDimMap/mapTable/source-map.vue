<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-row class="tac">
            <el-col :span="6" class="leftTree">
                <el-form :inline="true" label-position="right" :model="dataForm" @keyup.enter.native="getDataList()">
                    <el-form-item style="margin-top:20px">
                        <!-- v-if="$hasPermission('source:source-map:save')" -->
                        <el-button type="primary" @click="addOrUpdateHandle(flowKey)">添加数据</el-button>
                    </el-form-item>
                </el-form>
                <div class="treeBody">
                    <el-tree :data="dataTree" highlight-current check-on-click-node :props="{ label: 'name', children: 'children' }" :default-expanded-keys="[defaultExpandedKeys]" node-key="id" @node-click="handleFileList" ref="flowListTree" accordion></el-tree>
                </div>

            </el-col>
            <el-col :span="17" class="rightTable" v-loading="loading">
                <el-card shadow="never" class="aui-card--fill">
                    <div class="mod-sys__role">
                        <el-form :inline="true" label-position="right" :model="dataForm" @keyup.enter.native="getDataList()">
                            <el-form-item>
                                <!-- v-if="$hasPermission('source:source-map:save')" -->
                                <el-button type="primary" @click="resetIn(flowKey)">重新引入</el-button>
                            </el-form-item>
                            <el-form-item>
                                <!-- v-if="$hasPermission('source:source-map:save')" -->
                                <el-button type="primary" @click="submitData(flowKey)">保存</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form :model="dataForm">
                            <el-table :data="sourceLists" row-key="sjzdId" border style="width: 100%;">
                                <el-table-column prop="fieldEnglishName" label="字段名称" header-align="center" align="left"></el-table-column>
                                <el-table-column label="字段中文名" fixed="right" header-align="center" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item class="wdd-form-item">
                                            <el-input class="wdd-source-input" v-model="scope.row.fieldChineseName" placeholder="请输入内容"></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>

                        <!-- <el-pagination :current-page="page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="limit"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="pageSizeChangeHandle"
              @current-change="pageCurrentChangeHandle">
            </el-pagination>-->
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <add-source v-if="addOrUpdateVisible" :closeEvent="closeEvent" ref="addOrUpdate"></add-source>
    </el-card>
</template>

<script>
import AddSource from "./add-source";
import mixinViewModule from "@/mixins/source-module";
import {
    type
} from "@/mixins/config";
export default {
    mixins: [mixinViewModule],
    data() {
        return {
            mixinViewModuleOptions: {
                getDataListURL: "/source/page",
                treeBool: false,
            },
            loading: false,
            defaultExpandedKeys: "",
            dataForm: {
                workflowId: "",
                fieldEnglishName: "",
            },
            flowList: [],
            flowIdList: [],
            flowId: "",
            flowKey: "",
            fileSubId: "",
            source: [],
            dataTree: [],
            sourceLists: [],
            input: "",
        };
    },
    created() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
        this.getSourceTree();
    },
    mounted() { },
    components: {
        AddSource,
    },
    methods: {
        closeEvent() {
            this.getSourceTree();
        },
        clearBefor(data) {
            if (data.substring(data.length - 1) === ",") {
                data = data.substring(0, data.length - 1);
            }
            return data;
        },
        toTree(data) {
            let result = [];
            if (type(data) !== "array") {
                return result;
            }
            data.forEach((item) => {
                delete item.children;
            });
            let map = {};
            data.forEach((item) => {
                map[item.id] = item;
            });
            data.forEach((item) => {
                let parent = map[item.pid];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    result.push(item);
                }
            });
            return result;
        },
        getSourceTree() {
            this.$apis.getDataTableTree({}, (res) => {
                this.dataTree = this.toTree(res);
                for (let i = 0; i < this.dataTree.length; i++) {
                    const item = this.dataTree[i];
                    if (item.hasOwnProperty("children")) {
                        this.defaultExpandedKeys = item.children[0].id;
                        setTimeout(() => {
                            this.$refs["flowListTree"].setCurrentKey(
                                this.defaultExpandedKeys
                            );
                            this.getTable(this.defaultExpandedKeys);
                        }, 20);
                        break;
                    }
                }
            }, (err) => { })
        },
        handleFileList(data, obj, list) {
            this.defaultExpandedKeys = data.id;
            var id = data.id;
            this.getTable(id);
        },
        getTable(id) {
            if (id) {
                this.loading = true;
                this.$apis.getLayerDataFieldList({ sjbId: id }, (res) => {
                    this.loading = false;
                    this.sourceLists = res;
                }, (err) => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: err.msg,
                    });
                })

            }
        },
        // 重新引入
        resetIn() {
            if (this.defaultExpandedKeys.indexOf('sjy_') != -1) {
                this.$message({
                    type: "error",
                    message: '请选择数据表进行引入',
                });
                return;
            };
            this.$confirm('此操作将清空字段中文名，是否继续？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$apis.resetLayerDataField({ sjbId: this.defaultExpandedKeys }, (res) => {
                    this.loading = false;
                    this.getTable(this.defaultExpandedKeys);
                }, (err) => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: err.msg,
                    });
                })
            })
        },
        // 保存
        submitData() {
            if (this.defaultExpandedKeys.indexOf('sjy_') != -1) {
                this.$message({
                    type: "error",
                    message: '请选择数据表进行保存',
                });
                return
            };

            this.loading = true;
            const param = {
                caDataFieldList: this.sourceLists,
            };

            this.$apis.saveLayerDataAndField(param, (res) => {
                this.loading = false;
                this.$message({
                    type: "success",
                    message: "操作成功",
                });
                this.getTable(this.defaultExpandedKeys);
            }, (err) => {
                this.loading = false;
                this.$message({
                    type: "error",
                    message: err.msg,
                });
            })
            
        },
    },
};
</script>

<style>
.treeBody {
    position: absolute;
    top: 82px;
    background: #fff;
    bottom: 0px;
    width: 24%;
    overflow-y: auto;
}

.tac {
    height: 80vh;
}

.leftTree {
    height: 80vh;
    padding: 0 20px 0 0;
    border-right: 1px solid #ccc;
}

.rightTable {
    margin: 0 0 0 20px;
}

.wdd-source-input .el-input__inner {
    border: none;
}

.wdd-form-item {
    margin: 0;
}
</style>
