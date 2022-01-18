<template>
    <div class="datacataloguebox">
        <div class="btnbox">
            <el-button type="primary" @click="add">新增</el-button>
        </div>
        <div class="tableBox">
            <el-table :data="tableData" @expand-change="tableChange" style="width: 100%; margin-bottom: 20px" row-key="tdSjmlxxbId" :expand-row-keys='defaultKeys' border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="directoryName" label="名称" width="350">
                </el-table-column>

                <el-table-column prop="icon" :label="$t('menu.icon')" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        <svg class="icon-svg" aria-hidden="true">
                            <use :xlink:href="`#${scope.row.iconName}`"></use>
                        </svg>
                    </template>
                </el-table-column>

                <el-table-column prop="type" :label="$t('menu.type')" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.targetType === '0'" size="small">{{ $t('menu.type0') }}</el-tag>
                        <el-tag v-else-if="scope.row.targetType === '1'" size="small">地图</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="directoryOrder" :label="$t('menu.sort')" header-align="center" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                        <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="type==0?'新增':'修改'" :visible.sync="dialogVisible" width="50%" destroy-on-close>
            <addData @closeE="closeE" ref="addData" :type='type' v-if="dialogVisible" />
        </el-dialog>
    </div>
</template>

<script>
import addData from './addData'
export default {
    //import引入的组件
    components: {
        addData
    },
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            type: 0,
            defaultKeys: []
        };
    },
    //方法集合
    methods: {
        initdata(flag) {
            this.tableData = [];
            this.$api.queryTdTreeDataDir({}, res => {
                this.tableData = this.getTree(res)
                if (!flag) {
                    for (let item of this.tableData) {
                        if (item.children.length) {
                            this.defaultKeys.push(item.tdSjmlxxbId)
                        }
                    }
                }
            })
        },
        tableChange(row, expanded) {
            let index = this.defaultKeys.indexOf(row.tdSjmlxxbId)
            if (expanded && index === -1) {
                this.defaultKeys.push(row.tdSjmlxxbId)
            } else if (index > -1) {
                this.defaultKeys.splice(index, 1)
            }
        },
        getTree(res) {
            var _data = {}; // 递归源对象
            var treeData = [];
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                _data[element.tdSjmlxxbId] = element;
            };
            for (let i = 0; i < res.length; i++) {
                const child = res[i];
                if (_data.hasOwnProperty(child.superiorMenuId)) {
                    const parent = _data[child.superiorMenuId];
                    if (!parent.hasOwnProperty('children')) parent['children'] = [];
                    parent['children'].push(child);
                } else {
                    treeData.push(child);
                }
            };

            return treeData;
        },

        add: function () {
            this.type = 0
            this.dialogVisible = true
        },
        closeE(type) {
            this.dialogVisible = false
            if (type == "add") {
                this.initdata(true)
            }
        },
        handleClick(data) {
            this.type = 1
            this.dialogVisible = true;
            setTimeout(() => {
                this.$refs.addData.initdata(data)
            }, 500)

        },
        deleteData(data) {
            this.$confirm("是否删除该条数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                if (data.children && data.children.length) {
                    this.$message.error('请先删除子目录！');
                } else {
                    this.$api.deleteDataDir(data.tdSjmlxxbId, (res) => {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                    })
                }
                this.initdata(true);
            }).catch(err => {
                this.$message({ message: "已取消", type: "info" });
            })
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$api = this.$API.get(['onemap:threeModule'])
        this.initdata()
    },
};
</script>

<style lang="scss">
.datacataloguebox {
    background: #fff;
    padding: 20px;
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 15px;
    top: 15px;
    overflow-y: auto;

    .btnbox {
        margin-bottom: 15px;
        margin-top: 0px;
    }
}
</style>
