<template>
    <el-form v-loading="loading" ref="from" :model="dataForm" :rules="rules">
        <el-form-item label="地图名称" label-width="100px" prop="mapName">
            <el-select v-model="dataForm.mapName" style="width:100%;" @change="mapNameChange" placeholder="请选择">
                <div v-for="(item,index) in mapNameSelectList" :key="index">
                    <el-option :label="item.mapName" :value="item.dtxxbId"></el-option>
                </div>
            </el-select>
        </el-form-item>
        <el-form-item label="年份" label-width="100px" prop="years">
            <el-date-picker v-model="dataForm.years" type="year" value-format="yyyy"></el-date-picker>
        </el-form-item>
        <el-form-item label="排序" label-width="100px" prop="sort">
            <el-input-number :min="0" v-model="dataForm.sort"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
            <el-input v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right; margin:0; margin-top:150px;">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="verification">确认</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    data() {
        return {
            loading: false,
            dataForm: {
                years: '',
                mapName: '',
                sort: '',
                remark: '',
                timelineLabel: ''
            },
            rules: {
                years: { required: true, message: '必填项不能为空', trigger: 'blur' },
                mapName: { required: true, message: '必填项不能为空', trigger: 'blur' },
                sort: { required: true, message: '必填项不能为空', trigger: 'blur' }
            },
            startState: '1',
            sjzglsjbId: '',
            time: null,
            mapNameSelectList: [],
            timelineLabel: ''
        };
    },
    mounted() {
        this.$apis = this.$API.get(['onemap:toolManage'])
        //获取地图名称下拉框列表数据
        this.$apis.selectMapInfo({}, (res) => {
            this.mapNameSelectList = []
            for (let item of res.data) {
                this.mapNameSelectList.push(item)
            }
        }, (err) => {
            this.$message.error(err.data.msg)
        })
    },
    methods: {
        //获取地图名称value
        mapNameChange(e) {
            this.timelineLabel = e
        },
        //新增时间轴列表数据
        verification() {
            this.$refs.from.validate(valid => {
                if (!valid) return
                this.$apis.updataTimelineData({
                    // this.$http.post('/pictureTimelineController/updataPictureTimelineData', {
                    timelineTypeId: this.$route.params.sjzgllxbId,
                    sjzglsjbId: this.sjzglsjbId,
                    timelineLabel: this.timelineLabel,
                    timelineValue: +this.dataForm.years,
                    remark: this.dataForm.remark,
                    sort: +this.dataForm.sort
                }, (res) => {
                    this.$message({ message: '操作成功', type: 'success' })
                    this.$emit('timePackageClose')
                    this.$emit('getTimeList')
                }, (err) => {
                    this.$message.error(err.response.data.msg)
                })
            })
        },
        //点击取消
        close() {
            this.$emit('timePackageClose')
            this.$message({
                message: '已取消',
                type: 'info'
            })
        },
        //接收指定行数据
        rowData(data) {
            this.dataForm.sort = data.sort
            this.dataForm.years = data.timelineValue
            this.dataForm.timelineLabel = data.timelineLabel
            this.dataForm.remark = data.remark
            this.timelineTypeId = data.timelineTypeId
            this.sjzglsjbId = data.sjzglsjbId
            this.dataForm.mapName = data.mapName
        }
    }
}
</script>
<style scoped>
</style>