<template>
    <el-form v-loading="loading" ref="from" :model="dataForm" :rules="rules">
        <el-form-item label="时间轴名称:" label-width="100px" prop="timeAxisName">
            <el-input v-model="dataForm.timeAxisName" maxlength="20" show-word-limit placeholder="时间轴名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="轮播间隔" label-width="100px" prop="carouselTime">
            <el-input v-model="dataForm.carouselTime" maxlength="5" show-word-limit style="width:110px;"></el-input><span class="carousel-time">秒</span>
        </el-form-item>
        <el-form-item label="排序" label-width="100px" prop="sort">
            <el-input-number :min="0" v-model="dataForm.sort"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
            <el-input v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" label-width="100px">
            <el-switch style="user-select:none;" @change='monitorFlag' v-model="flag" :active-text='switchActiveText' :width="55" active-color='rgb(94, 185, 123)'></el-switch>
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
        let validator = (rule, value, callback) => {
            if (!Number.isInteger(+value) || value.indexOf('.') !== -1) return callback(new Error())
            callback()
        };
        return {
            loading: false,
            dataForm: {
                timeAxisName: '',
                carouselTime: '',
                sort: '',
                remark: ''
            },
            rules: {
                timeAxisName: { required: true, message: '必填项不能为空', trigger: 'blur' },
                carouselTime: [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
                    { validator: validator, message: '轮播间隔必须为整数', trigger: 'blur' }
                ],
                sort: { required: true, message: '必填项不能为空', trigger: 'blur' }
            },
            flag: true,
            switchActiveText: '',
            startState: '0',
            sjzgllxbId: ''
        };
    },
    methods: {
        //监听启用状态
        monitorFlag(e) {
            if (e) this.switchActiveText = 'ON'
            else if (!e) this.switchActiveText = 'OFF'
            if (e) this.startState = '0'
            if (!e) this.startState = '1'
        },
        //新增时间轴列表数据
        verification() {
            this.$refs.from.validate(valid => {
                if (!valid) return
                // this.$http.post('/pictureTimelineController/updataPictureTimelineType', {
                  this.$apis.updataTimeline({
                    sjzgllxbId: this.sjzgllxbId,
                    timelineName: this.dataForm.timeAxisName,
                    byInterval: this.dataForm.carouselTime,
                    startState: this.startState,
                    sort: this.dataForm.sort,
                    remark: this.dataForm.remark
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
            this.dataForm.timeAxisName = data.timelineName
            this.dataForm.carouselTime = data.byInterval
            this.startState = data.startState
            this.sjzgllxbId = data.sjzgllxbId
            this.dataForm.sort = data.sort
            this.dataForm.remark = data.remark
            if (this.startState === '0') {
                this.flag = true
                this.switchActiveText = 'ON'
                this.startState = '0'
            } else if (this.startState === '1') {
                this.flag = false
                this.switchActiveText = 'OFF'
                this.startState = '1'
            }
        }
    },
    mounted() {
      this.$apis = this.$API.get(['onemap:toolManage'])
    }
}
</script>
<style lang='scss' scoped>
/deep/ .el-switch {
    position: relative;
    height: 24px;
    line-height: 24px;
    &.is-checked {
        .el-switch__core {
            background: #179bff;
            &:after {
                margin-left: -22px;
            }
        }
    }
    .el-switch__label,
    .el-switch__core {
        height: 24px;
    }
    .el-switch__core {
        border-radius: 12px;
        border: none;
        background: #f1f1f1;
        &:after {
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
            width: 22px;
            height: 22px;
        }
    }
    .el-switch__label.is-active {
        color: #333;
    }
    .el-switch__label--right {
        margin-left: 0px;
        &.is-active {
            color: #fff;
            right: 30px;
        }
        position: absolute;
        right: 5px;
        color: #999;
        > span {
            font-size: 12px;
        }
    }
}
.carousel-time {
    margin-left: 10px;
}
</style>