<template>
    <el-form ref="from" :model="dataForm" :rules="rules">
        <el-form-item label="查询名称" label-width="130px">
            <el-input v-model="searchName" disabled placeholder="查询名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="130px" prop="sort">
            <el-input-number :min="0" v-model="dataForm.sort"></el-input-number>
        </el-form-item>
        <el-form-item label="包含流程" label-width="130px" prop="process">
            <el-select v-model="dataForm.process" style="width:100%;" @change="processChange" placeholder="请选择">
                <div v-for="(item,index) in processList" :key="index">
                    <el-option :label="item.flowname" :value="item.flowid"></el-option>
                </div>
            </el-select>
        </el-form-item>
        <el-form-item label="查询业务数据表" label-width="130px" prop="dataSheet">
            <el-select v-model="dataForm.dataSheet" style="width:100%;" @change="dataSheetChange" placeholder="请选择">
                <div v-for="(item,index) in dataSheetSelectList" :key="index">
                    <el-option :label="item.name" :value="item.id"></el-option>
                </div>
            </el-select>
        </el-form-item>
        <el-form-item label="查询展示字段" label-width="130px" prop="field">
            <el-select v-model="dataForm.field" style="width:100%;" @change="fieldChange" placeholder="请选择">
                <div v-for="(item,index) in fieldSelectList" :key="index">
                    <el-option :label="item.name" :value="item.id"></el-option>
                </div>
            </el-select>
        </el-form-item>
        <el-form-item style="text-align:right; margin:0; margin-top:50px;">
            <el-button @click="closeDiaLog">取消</el-button>
            <el-button type="primary" @click="sub">确认</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        searchName: String,
        businessQueryId: String,
        processList: Array
    },
    data() {
        return {
            dataForm: {
                dataSheet: '',
                process: '',
                field: '',
                sort: null
            },
            rules: {
                name: { required: true, message: '请输入', trigger: 'blur' },
                dataSheet: { required: true, message: '请选择', trigger: 'blur' },
                process: { required: true, message: '请选择', trigger: 'blur' },
                field: { required: true, message: '请选择', trigger: 'blur' },
                sort: { required: true, message: '请选择', trigger: 'blur' }
            },
            flag: false,
            ywlcxxbId: '',
            processSelectList: [],
            dataSheetSelectList: [],
            fieldSelectList: []
        }
    },
    mounted() {
        this.$api = this.$API.get(['onemap:inquiryManage']);
    },
    methods: {
        //请求下拉数据
        getSelectData(list, url, data) {
            this.$api[url](data, res => {
                    for (let item of res) {
                        list.push(item)
                    }
                }, (err) => { })
        },
        //监听流程修改
        processChange(e, flag) {
            if (flag !== 1) {
                this.dataSheetSelectList = []
                this.fieldSelectList = []
                this.dataForm.dataSheet = ''
                this.dataForm.field = ''
            }
            this.getSelectData(this.dataSheetSelectList, 'getTablesbyFlowIds', { flowId: e })
            this.dataForm.process = e
        },
        //监听数据表修改
        dataSheetChange(e, flag) {
            if (flag !== 1) {
                this.fieldSelectList = []
                this.dataForm.field = ''
            }
            this.getSelectData(this.fieldSelectList, 'getFieldByTids', { tableId: e })
            this.dataForm.dataSheet = e
        },
        //监听字段修改
        fieldChange(e) {
            this.dataForm.field = e
        },
        sub() {
            this.$refs["from"].validate(valid => {
                if (!valid) return
                let ajaxData = {
                    businessQueryId: this.businessQueryId, //id
                    processTypeId: this.dataForm.process, // 包含流程 value 字典项编码
                    businessData: this.dataForm.dataSheet, // 业务数据表 (String) 
                    showBusiness: this.dataForm.field, // 业务展示字段 (String) 
                    processOrder: this.dataForm.sort, // 排序 (Integer)
                }
                let url = this.flag ? 'updateProcesss' : 'insertProcesss'
                if (this.flag) ajaxData.ywlcxxbId = this.ywlcxxbId
                this.$api[url](ajaxData, res => {
                    // if (res.data.code !== 200) return this.$message.error(res.data.msg)
                    this.$message({ message: '操作成功', type: "success" })
                    this.closeDiaLog()
                    this.$emit('getList')
                }, err => {
                    this.$message.error(err.response.data.msg)
                })
            })
        },
        changeSearchName(data, flag) {
            this.dataForm.sort = data.sort
            this.dataForm.process = data.processTypeId
            this.dataForm.dataSheet = data.businessData
            this.dataForm.field = data.field
            this.ywlcxxbId = data.ywlcxxbId
            this.flag = flag
            this.processChange(this.dataForm.process, 1)
            this.dataSheetChange(this.dataForm.dataSheet, 1)
        },
        closeDiaLog() {
            this.$emit('newQueryClose')
        }
    }
}
</script>