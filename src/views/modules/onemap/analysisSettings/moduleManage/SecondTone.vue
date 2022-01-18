<template>
  <div>
     <el-form ref="form" inline :model="form" :rules="rules" label-width="80px">
         <el-form-item v-if="yearFlag" label="年份：" label-width="160px" prop="year">
            <el-date-picker
                style="width: 200px;"
                v-model="form.year"
                type="year"
                value-format="yyyy"
                placeholder="请选择年份">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="数据源：" label-width="160px" prop="sjyId">
            <el-select v-model="form.sjyId" @change="dataSourceChange" placeholder="请选择数据源" style="width: 200px;">
                <el-option v-for="item in dataSourceList" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="面数据表：" label-width="160px" prop="sjbId">
            <el-select v-model="form.sjbId" placeholder="请选择面数据表" style="width: 200px;">
                <el-option v-for="item in list" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="线数据表：" label-width="160px" prop="xsjbId">
            <el-select v-model="form.xsjbId" placeholder="请选择线数据表" style="width: 200px;">
               <el-option v-for="item in list" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="点数据表：" label-width="160px" prop="dsjbId">
            <el-select v-model="form.dsjbId" placeholder="请选择点数据表" style="width: 200px;">
                <el-option v-for="item in list" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <div style="text-align: center;">
            <el-button class="buttonForType el-button--primary" @click="saveEvent()" icon="el-icon-circle-plus-outxsjbId">保存数据源</el-button>
        </div>
     </el-form>
  </div>
</template>

<script>

export default {
    data() {
        return {
            form: {
                sjyId: '',
                sjbId: '',
                xsjbId: '',
                dsjbId: '',
                year: '',
                ztfxId: '',
                ztsjyId: ''
            },
            rules: {
                sjyId: [{ required: true,message: "请选择数据源", trigger: "blur" }],
                sjbId: [{ required: true,message: "请选择面数据表", trigger: "blur" }],
                xsjbId: [{ required: true,message: "请选择线数据表", trigger: "blur" }],
                dsjbId: [{ required: true,message: "请选择点数据表", trigger: "blur" }],
                year: [{ required: true,message: "请选择年份", trigger: "blur" }]
            },
            dataSourceList: [],
            list: [],
            yearFlag: false,
            closeDialogWhenAfterSaveEvent: false
        }
    },
    mounted(){
        this.$api = this.$API.get(['onemap:analysisSettings']);
    },
    methods: {
        setData(data,type,showYear) {
            for(let item in data) {
                this.form[item] = data[item]
            }
            if(data.isTimeIndex == '0' || showYear == '0') {
                this.yearFlag = true
            }
            if (data.isUniformConfiguration == '0' && data.isTimeIndex == '0') {
                this.closeDialogWhenAfterSaveEvent = true;
            };
            if(type == 'update') {
                this.dataSourceChange(this.form.sjyId,'updata')
            }
            this.$api.lyerDataSource('',res=> {
                this.dataSourceList = res
            })
        },
        dataSourceChange(e,type) {
            if(type !== 'updata') {
                this.form.sjbId = ''
                this.form.xsjbId = ''
                this.form.dsjbId = ''
            }
            this.$api.layerDataList2({sjyId:e},res=> {
                this.list = res
            })
        },
        saveEvent() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var _data = JSON.parse(JSON.stringify(this.form));
                    let data = {
                        ztsjyId: _data.ztsjyId || undefined, // 专题数据原表主键 (String) 修改时必填
                        ztfxId: _data.ztfxId, // 专题分析表主键 (String) 必填
                        sjyId: _data.sjyId, // 数据源主键 (String) 必填
                        sjbId: _data.sjbId, // 数据表主键 (String) 必填
                        year: _data.year, // 年份 (String) 必填
                        versionNumber: _data.versionNumber || undefined, // 年份 (String) 修改时必填，添加时忽略
                        dsjbId: _data.dsjbId, // 点数据表主键
                        xsjbId: _data.xsjbId // 线数据表主键
                    }
                    this.$api.saveOrUpdateSpecificData(data, (res) => {
                        this.$emit('closeDialog',true,'saveSource', this.closeDialogWhenAfterSaveEvent)
                        this.$message({
                            message: "操作成功",
                            type: "success",
                        });
                    });
                }
            });
        }
    }
}
</script>

<style />