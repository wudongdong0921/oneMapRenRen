<!-- 资料模板 -->
<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-row class="tac">
            <el-col :span="6" class="leftTree">
                <el-tree :data="flowList" highlight-current check-on-click-node :props="{ label: 'flowname', children: 'children' }" :default-expanded-keys="[defaultExpandedKeys]" node-key="id" @node-click="handleFileList" ref="flowListTree" accordion>
                </el-tree>
            </el-col>
            <el-col :span="17" class="rightTable" v-if="flowKey" v-loading="loading">
                <el-card shadow="never" class="aui-card--fill">
                    <div class="mod-sys__role">
                        <el-form :inline="true" :model="dataForm">
                            <el-form-item>
                                <el-button type="primary" @click="addOrUpdateHandle(flowKey)">{{ $t('add') }}</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table v-loading="dataListLoading" :data="dataList" row-key="id" :tree-props="{children: 'children'}" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
                            <el-table-column prop="enclosureName" label="附件名称" header-align="center" align="left"></el-table-column>
                            <el-table-column prop="sort" label="排序" width="100" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="creatorName" label="创建人" sortable header-align="center" align="center" width="200"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="240"></el-table-column>
                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
                                <template slot-scope="scope">
                                    <el-button v-if="$hasPermission('flow:file-flow:update')" type="text" size="small" @click="updateHandle1(scope.row)">{{ $t('update') }}</el-button>
                                    <el-button v-if="$hasPermission('flow:file-flow:delete')" type="text" size="small" @click="deleteHandle1(scope.row)">{{ $t('delete') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        
                        <add-or-update :typename='typename' v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getFlowFiles(flowKey)"></add-or-update>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import AddOrUpdate from './file-add-or-update'
import mixinViewModule from '@/mixins/flow-module'
import axiosEvent from '@/utils/axiosevent'

export default {
    mixins: [mixinViewModule],
    data() {
        return {
            mixinViewModuleOptions: {
                getDataListURL: '/SysWorkflowEnclosure/querySysWorkflowEnclosureInfoByWorkflowId',
                getDataListIsPage: true,
                deleteURL: '/SysWorkflowEnclosure/saveSysWorkflowEnclosure',
                deleteIsBatch: true,
                method: 'post'
            },
            defaultExpandedKeys: '',
            dataForm: {
                workflowId: '',
                enclosureName: ''
            },
            loading: false,
            flowList: [],
            flowIdList: [],
            flowId: '',
            flowKey: '',
            fileSubId: '',
            typenameList: [],
            typename: '',
            dataList: []
        }
    },
    mounted() {
        this.getFlowList()
    },
    components: {
        AddOrUpdate
    },
    methods: {
        // 封装tree
        getTreeClass(data) {
            let obj = {}
            let dataList = []
            data.data.forEach((key) => {
                if (key.typename && !obj.hasOwnProperty(key.typename)) {
                    obj[key.typename] = []
                    obj[key.typename].push({
                        flowid: key.flowid,
                        flowname: key.flowname,
                        id: key.id
                    })
                } else if (key.typename && obj.hasOwnProperty(key.typename)) {
                    obj[key.typename].push({
                        flowid: key.flowid,
                        flowname: key.flowname,
                        id: key.id
                    })
                } else {
                    if (!obj.hasOwnProperty('其他')) {
                        obj['其他'] = []
                    }
                    obj['其他'].push({
                        flowid: key.flowid,
                        flowname: key.flowname,
                        id: key.id
                    })
                }
            });
            var uuid = function () {
                var uuid = '';
                for (var i = 1; i <= 32; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    uuid += n;
                }
                return uuid;
            };
            for (let item in obj) {
                dataList.push({
                    id: uuid(),
                    flowname: item,
                    children: obj[item]
                })
            };
            return dataList
        },
        // 流程栏
        getFlowList() {
            return axiosEvent({
                type: 'post',
                url: '/horizon/workflow/api/getFlowDefList',
                target: 'workflow',
            }).then((res) => {
                var treeData = this.getTreeClass(res);
                this.typename = res.data[0].typename
                this.typenameList = JSON.parse(JSON.stringify(res.data))
                if (treeData[0] && treeData[0].children && treeData[0].children[0]) {
                    var activeNode = treeData[0].children[0];
                    this.defaultExpandedKeys = activeNode.id;
                    this.flowKey = activeNode.flowid;
                };
                this.flowList = treeData;
                setTimeout(() => {
                    if (activeNode) {
                        this.$refs['flowListTree'].setCurrentKey(this.defaultExpandedKeys);
                        this.flowKey = activeNode.flowid;
                        this.getFlowFiles(activeNode.flowid)
                    };
                }, 20);
            });
        },
        handleFileList(data, obj, list) {
            this.defaultExpandedKeys = ''
            if(data.hasOwnProperty('children')) {
                this.typename = data.flowname
            }else {
              for(let item of this.typenameList){
                if(data.flowname === item.flowname){
                    this.typename = item.typename
                }
              }
            }
            if (data.flowid) {
                this.getFlowFiles(data.flowid)
                this.flowKey = data.flowid
            }
        },
        // 附件绑定
        getFlowFiles(id) {
            this.loading = true;
            axiosEvent({
              type: 'post',
              url: '/sysEnclosure/getEnclosureTree',
              target: 'business',
              data:{
                workflowId: id
              }
            }).then((res) => {
              this.loading = false;
              if (res.code !== 200) {
                return this.$message.error(res.msg)
              };
              this.dataList = res.data;
            }).catch(() => {
              this.loading = false;
            })
        },
        updateHandle1(data) {
            console.log(data)
            this.addOrUpdateHandle(this.flowKey, data);
        },
        deleteHandleAjax(data) {
          axiosEvent({
            type: 'post',
            url: '/sysEnclosure/deleteSysEnclosure',
            target: 'business',
            data: {
              id: data.id
            }
          }).then((res) => {
              if (res.code !== 200) {
                  return this.$message.error(res.msg)
              };
              this.$message({
                  message: this.$t('prompt.success'),
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                      this.getFlowFiles(this.flowKey)
                  }
              })
          }).catch(() => { })

        },
        // 删除
        deleteHandle1(data) {

            if (data.children.length) {
                this.$confirm('该文件夹存在下级节点, 是否继续执行删除操作？', this.$t('prompt.title'), {
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    this.deleteHandleAjax(data);
                }).catch(() => { })
            } else {
                this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    this.deleteHandleAjax(data);
                }).catch(() => { })
            };
        },
        
    }

}
</script>

<style scope>
  .tac { height: 80vh;}
  .leftTree { height: 80vh; padding: 0 20px 0 0; border-right: 1px solid #ccc ;}
  .rightTable { margin: 0 0 0 20px;}
</style>