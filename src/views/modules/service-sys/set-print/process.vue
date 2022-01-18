<template>
    <el-card shadow="never">
        <div>
            <el-form :inline="true" :model="dataForm" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model="dataForm.printTemplateName" placeholder="请输入打印模板名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getDataList()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%;" @selection-change="">
                <!-- <el-table-column prop="formName" label="表单名称" header-align="center" align="center"></el-table-column> -->
                <el-table-column prop="printTemplateName" label="模板名称" header-align="center" align="center" ></el-table-column>
                <el-table-column prop="view" label="视图" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    
        </div>
    </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/service-module'
import AddOrUpdate from './process-add-or-update.vue'

export default {
    mixins: [mixinViewModule],
    data() {
        return {
            mixinViewModuleOptions: {
                getDataListURL: '/PrintTemplateConfig/selectPrintTemplateConfigList',
                getDataListIsPage: false,
                deleteURL: '/PrintTemplateConfig/deletePrintTemplateConfig',
                deleteIsBatch: false,
                target: 'business'
            },
            dataForm: {
                printTemplateName: '',
            },

            dataListLoading: false,
            dataList: [],
            addOrUpdateVisible: false,
        }
    },
    components: {
        AddOrUpdate
    },
    methods: {
    },
}
</script>
