<template>
    <el-card shadow="never" v-loading="loading">
        <div>
            <el-row>
                <el-col :span="6" class="leftTree">
                    <el-input placeholder="请输入文件夹名称" v-model="filterText"></el-input>
                    <el-tree :data="treeData" @node-click="handleNodeClick" highlight-current style="display: inline-flex;" default-expand-all :filter-node-method="filterNode" :expand-on-click-node="false" ref="tree" :props="defaultProps">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span class="custom-tree-node-label" :title="node.label"> {{ node.label }} </span>
                            <span>
                                <!-- 添加 -->
                                <el-button type="text" size="mini" @click="()=> addfolder(data)">
                                    <i class="el-icon-plus"></i>
                                </el-button>
                                <!-- 修改 -->
                                <el-button type="text" size="mini" @click="()=> updatefolder(data)">
                                    <i class="el-icon-edit-outline"></i>
                                </el-button>
                                <!-- 删除 -->
                                <el-button type="text" size="mini" @click="()=> deletefolder(data)">
                                    <i class="el-icon-close"></i>
                                </el-button>
                                <!-- 移动 -->
                                <el-button type="text" size="mini" @click="()=> movefolder(data)">
                                    <i class="el-icon-rank"></i>
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                </el-col>

                <el-col :span="17" style="padding-left:20px;">
                    <el-form :inline="true" :model="param" @keyup.enter.native="getDataList(1)">
                        <el-form-item>
                            <el-input v-model="param.fileRealName" placeholder="请输入文件名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="getDataList(1)">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="uploadDoc()">上传文件</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="moveDoc()">移动文件</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="importDoc()">导入规划成果</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="deleteDoc()">删除文件</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="inquiryList" border style="width:100%" @selection-change="selectChange" @select-all="selectAll">
                        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                        <el-table-column prop="sort" label="排序" header-align="center" align="center" width="50"></el-table-column>
                        <el-table-column prop="fileRealName" label="文件名称" header-align="center" align="center"></el-table-column>
                        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="250"></el-table-column>
                        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="updateEvent(scope)">修改</el-button>
                                <el-button type="text" size="small" @click="deleteEvent(scope)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination :current-page="param.page" :page-sizes="[10, 20, 50, 100]" :page-size="param.limit" :total="Number(busunessUbqyuryData.total)" layout="total, sizes, prev, pager, next, jumper" @size-change="changePageSize" @current-change="currentChange">
                    </el-pagination>

                </el-col>
            </el-row>

            <!-- 上传文件 -->
            <el-dialog :visible="uploadFlag" title="上传文件" :destory-on-close="true" :before-close="uploadClose">
                <uploadDoc v-if="uploadFlag" ref="uploadDoc" @clickClose="uploadClose"></uploadDoc>
            </el-dialog>

            <!-- 移动文件 -->
            <el-dialog :visible="moveFlag" :title="moveFile?'移动文件':'移动文件夹'" :destory-on-close="true" :before-close="moveClose">
                <moveDoc v-if="moveFlag" ref="moveDoc" @clickClose="moveClose"></moveDoc>
            </el-dialog>

            <!-- 导入规划成果 -->
            <el-dialog :visible="importFlag" title="导入规划成果" :destory-on-close="true" :before-close="importClose">
                <importDoc v-if="importFlag" ref="importDoc" @clickClose="importClose"></importDoc>
            </el-dialog>

            <!-- 修改 -->
            <el-dialog :visible="updateFlag" title="修改文件名称" :destory-on-close="true" :before-close="updateClose">
                <updateDocName v-if="updateFlag" ref="updateDocName" @clickClose="updateClose"></updateDocName>
            </el-dialog>

            <el-dialog :visible="addOrUpFolderFlag" :title="addFolder?'新增文件夹': '修改文件夹'" :destory-on-close="true" :before-close="addOrUpFolderClose">
                <add-or-up-folder v-if="addOrUpFolderFlag" ref="addOrUpFolder" @clickClose="addOrUpFolderClose"></add-or-up-folder>
            </el-dialog>
        </div>
    </el-card>
</template>

<script>
import uploadDoc from './uploadDoc.vue'
import moveDoc from './moveDoc.vue'
import importDoc from './importDoc.vue'
import updateDocName from './updateDocName.vue'
import addOrUpFolder from './addOrUpFolder.vue'
import Cookies from "@/utils/storage";


export default {
    components: {
        uploadDoc,
        moveDoc,
        importDoc,
        updateDocName,
        addOrUpFolder
    },
    data() {
        return {
            loading: false,
            filterText: '',  // 树的查询
            treeData: [],
            param: {
                dicId: null,
                fileRealName: '',
                page: 1,
                limit: 10,
            },
            inquiryList: [],
            selectionList: [],
            busunessUbqyuryData: {},

            uploadFlag: false,
            moveFlag: false,
            importFlag: false,
            updateFlag: false,
            addOrUpFolderFlag: false,
            addFolder: false,   // 是否为新增文件夹，true是新增，false是修改
            moveFile: false,    // 是否为移动文件，true是移动文件，false是移动文件夹
            defaultProps: {
                label: 'dicName'
            }

        }
    },
    methods: {

        // 列表的条件查询
        getDataList(page) {
            if (!page) {
                this.param.page = 1
            } else {
                this.param.page = page
            }

            this.$api.getFilePage(this.param, res => {
                this.busunessUbqyuryData = res;
                this.inquiryList = res.list;
            })
        },

        // 查询树
        getTree() {
            this.$api.docTree({id: this.$route.params.id}, res => {
                this.treeData = res;
            })
        },

        // 查询列表
        getList() {
            this.$api.getFilePage(this.param, res => {
                this.busunessUbqyuryData = res;
                this.inquiryList = res.list;
            })
        },

        // 查询树节点
        filterNode(value, data) {
            if (!value) return true;
            return data.dicName.indexOf(value) !== -1;
        },

        // 点击树节点
        handleNodeClick(data) {
            this.param.dicId = data.id;
            this.getList()
        },

        changePageSize(e) {
            this.param.limit = e;
            this.getList();
        },

        //切换当前页
        currentChange(e) {
            this.param.page = e;
            this.getList()
        },

        // 新增文件夹
        addfolder(data) {
            this.addOrUpFolderFlag = true;
            this.addFolder = true;
            this.$nextTick(() => {
                this.$refs.addOrUpFolder.init(data, this.addFolder)
            })
        },

        // 修改文件夹
        updatefolder(data) {
            this.addOrUpFolderFlag = true;
            this.addFolder = false;
            this.$nextTick(() => {
                this.$refs.addOrUpFolder.init(data, this.addFolder)
            })
        },

        // 移动文件夹
        movefolder(data) {
            this.moveFlag = true;
            this.moveFile = false;
            this.$nextTick(() => {
                this.$refs.moveDoc.init(data.id, this.moveFile);
            })
        },

        // 删除文件夹
        deletefolder(data) {
            this.$confirm("此操作将删除该文件夹及其下属文件,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let deleteData = [data.id];
                this.$api.deleteDocuments(deleteData, (res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.param.dicId = null;
                    this.getTree();
                    this.getList();
                }, (err) => {
                    this.$message.error(err.response.data.msg)
                })
            })
        },

        // 上传文件
        uploadDoc() {
            if (!this.param.dicId) {
                return this.$message({
                    type: 'warning',
                    message: '请选择文件所要上传的目录'
                })
            }

            this.uploadFlag = true;
            this.$nextTick(() => {
                this.$refs.uploadDoc.init(this.param.dicId);
            })
        },

        // 移动文件
        moveDoc() {
            if (this.selectionList <= 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择要移动的文件'
                })
            }
            this.moveFlag = true;
            this.moveFile = true;
            this.$nextTick(() => {
                this.$refs.moveDoc.init(this.selectionList, this.moveFile);
            })
        },

        // 导入规划成果
        importDoc() {
            if (!this.param.dicId) {
                return this.$message({
                    type: 'warning',
                    message: '请选择规划成果要导入的目录'
                })
            }
            this.importFlag = true;
            this.$nextTick(() => {
                this.$refs.importDoc.init(this.param.dicId)
            })
        },

        // 批量删除文件
        deleteDoc() {
            if (this.selectionList.length <= 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择要删除的数据'
                })
            } else {
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(res => {
                        this.$api.deleteFile(this.selectionList, (res) => {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                            });
                            this.param.page = 1;
                            this.getList();
                        }).catch(err => {
                            this.$message.error(err.response.data.msg)
                        });
                    }, (err) => {
                        this.$message({ message: "已取消", type: "info" });
                    })
            }
        },

        // 单个删除
        deleteEvent(scope) {
            this.$confirm("此操作将删除该数据,是否继续？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = [scope.row.id];
                this.$api.deleteFile(data, (res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.param.page = 1;
                    this.getList();
                }, (err) => {
                    this.$message.error(err.response.data.msg)
                })
            })
        },

        // 修改
        updateEvent(scope) {
            this.updateFlag = true;
            this.$nextTick(() => {
                this.$refs.updateDocName.init(scope.row)
            })
        },

        // 表格选项发生变化
        selectChange(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.id);
            }
        },

        // 表格全选
        selectAll(selection) {
            this.selectionList = [];
            if (selection.length === 0) return;
            for (let item of selection) {
                this.selectionList.push(item.id);
            }
        },

        // 关闭新增/修改文件夹
        addOrUpFolderClose() {
            this.addOrUpFolderFlag = false;
            this.getTree();
            this.getList()
        },

        // 关闭上传
        uploadClose() {
            this.uploadFlag = false;
            this.getList();
        },

        // 关闭修改文件名页面
        updateClose() {
            this.updateFlag = false;
            this.getList();
        },

        // 关闭移动文件
        moveClose() {
            this.moveFlag = false;
            this.getTree();
            this.getList();
        },

        // 关闭导入成果
        importClose() {
            this.importFlag = false;
            this.getTree();
            this.getList();
        },
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
        this.getTree();
        // this.getList();
    }
}
</script>

<style>
.leftTree {
    height: 80vh;
    padding-right: 20px;
    border-right: 1px solid #ccc;
    overflow-x: auto;
    overflow-y: auto;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.custom-tree-node-label {
    width: 6vw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
