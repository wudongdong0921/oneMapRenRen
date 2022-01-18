<template>
    <div>
        <el-form ref="form" :model="dataForm" :rules="rules">
            <el-form-item label="名称:" label-width="120px" prop="name">
                <el-input v-model="dataForm.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注:" label-width="120px" prop="remark">
                <el-input v-model="dataForm.remark" clearable></el-input>
            </el-form-item>
            <el-form-item label="数据边界:" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item>
                            <el-select v-model="dataForm.codeProvince" @change="changeProvince" clearable style="width:96%">
                                <el-option v-for="item in RegionList" :key="item.id" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-select v-model="dataForm.codeCity" @change="changeCity" clearable style="width:96%">
                                <el-option v-for="item in CityData" :key="item.id" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="dataForm.codeDistrict" @change="changeDistrict" clearable style="width:96%">
                            <el-option v-for="item in District" :key="item.id" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>

        </el-form>
        <div class="tips">*注：边界控制开启后,地图查看、分析仅可操作“行政区划”内数据</div>
    </div>
</template>

<script>
export default {
    //import引入的组件
    components: {},
    props: ['RegionList','areaObj'],
    data() {

        return {

            dataForm: {
                name: '',
                remark: "",
                codeProvince: null,
                provincevalue: null,
                codeCity: null,
                cityvalue: null,

                codeDistrict: null,
                Districtvalue: null,
                chooseDict: null,
            },
            ProvinceData: [],
            CityData: [],
            District: [],
            rules: {
                name: [{
                    required: true,
                    message: this.$t('validate.required'),
                    trigger: 'blur'
                }]
            }

        };
    },
    //方法集合
    methods: {
        setdata(data) {
            this.dataForm.name = data.name;
            this.dataForm.remark = data.remark;
            this.changeProvince(data.areaCodeList[0]);
            this.changeCity(data.areaCodeList[1]);
            setTimeout(() => {
                console.log(data);
                this.dataForm.codeProvince = data.areaCodeList[0];

                this.dataForm.codeCity = data.areaCodeList[1];

                this.dataForm.codeDistrict = data.areaCodeList[2]
            }, 20)

        },
        getformdata() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit("getInfo", this.dataForm)
                };
            });
        },
        resetField() {
            this.$refs.form.resetFields()
        },
        changeProvince(value) {
            this.dataForm.codeCity = ''
            this.dataForm.codeDistrict = ''
            this.CityData = [];
            this.District = []
            if(value) {
                this.CityData = this.areaObj[value].children
            }
        },
        changeCity(value) {
            this.dataForm.codeDistrict = ''
            //this.dataForm.chooseDict = value.dictValue;
            this.dataForm.codeDistrict = '';
            if (value){
                this.District = this.areaObj[value].children
            };
        },
        changeDistrict(value) {
            console.log(value)
            // this.dataForm.codeDistrict = value.dictLabel;
            // this.dataForm.Districtvalue = value.dictValue;
            // this.dataForm.chooseDict = value.dictValue;
        },

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        setTimeout(() => {
            // console.log(this.RegionList)
            // console.log(this.areaObj);
        }, 100);
    },
}
</script>

<style>
.tips {
    font-size: 12px;
    color: #aaa;
    margin-left: 120px;
}
</style>
