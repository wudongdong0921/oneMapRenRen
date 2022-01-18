<template>
<el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params" v-loading="dataListLoading">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.paramCode" placeholder="底图名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">{{ $t('query') }}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveEvent()">{{ $t('add') }}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="deleteEvent()">{{ $t('deleteBatch') }}</el-button>
            </el-form-item>
        </el-form>
        <el-table @selection-change="SelectionChange" :data="dataList" border style="width: 100%">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="baseMapSort" label="排序" header-align="center" width="50" align="center"></el-table-column>
            <el-table-column prop="baseMapName" label="底图名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="baseMapAddress" label="底图地址" header-align="center" align="center"></el-table-column>
            <el-table-column prop="baseMapStatus" label="启用状态" width="100" header-align="center" align="center">
                <template slot-scope="scope">{{scope.row.baseMapStatus == '0' ? '启用' : '停用'}}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="250" header-align="center" align="center" sortable></el-table-column>
            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="saveEvent(scope.row)">{{ $t('update') }}</el-button>
                    <el-button type="text" size="small" @click="deleteEvent(scope.row)">{{ $t('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="listLimitChange" @current-change="listPageChange"></el-pagination> -->
        <!-- 弹窗, 新增 / 修改 -->
        <el-dialog :visible.sync="addOrUpdateVisible" :title="'底图信息'" :destroy-on-close="true">
            <add-or-update ref="addOrUpdate" :onClose="getDataList"></add-or-update>
        </el-dialog>
    </div>
</el-card>
</template>

<script>
// import _apis from './apis.js';
import addOrUpdateBaseMap from './addOrUpdateBaseMap';

export default {
    components: {
        addOrUpdate: addOrUpdateBaseMap
    },
    data() {
        return {
            addOrUpdateVisible: false,
            dataList: [],
            tableSelectValues: [],
            dataListLoading: false,
            dataForm: {
                paramCode: ''
            },
        };
    },
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
        this.getDataList();
    },
    methods: {
        getDataList() {
            this.addOrUpdateVisible = false;
            this.dataListLoading = true;
            this.$apis.getBaseMapList(this.dataForm.paramCode, (res) => {
                this.dataListLoading = false;
                this.dataList = res;
            }, (err) => {
                this.dataListLoading = false;
            })
        },
        saveEvent(data) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(data);
            });
        },
        deleteEvent(data) {
            var _array = [];
            if (data) {
                _array.push(data.dtxxbId);
            } else {
                if(this.tableSelectValues.length==0){
                   this.$message({
                        type: "warning",
                        message: "请选择要删除的选项！",
                    }); 
                    return
                }
                for (let i = 0; i < this.tableSelectValues.length; i++) {
                    const element = this.tableSelectValues[i];
                    _array.push(element.dtxxbId);
                };
            };
            this.$confirm("是否删除底图信息？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
            }).then(() => {
                this.dataListLoading = true;
                this.$apis.deleteBaseMapData(_array, () => {
                    this.dataListLoading = false;
                    this.$message({
                        type: "success",
                        message: "操作成功",
                    });
                    this.getDataList();
                }, () => {
                    this.dataListLoading = false;
                });
            });
        },
        SelectionChange: function (val) {
            this.tableSelectValues = val;
        },
    },
};
</script>
