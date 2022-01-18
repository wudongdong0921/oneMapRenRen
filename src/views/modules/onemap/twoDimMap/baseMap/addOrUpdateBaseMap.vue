<template>
<el-form v-loading="loading" v-if="visible" ref="form" :model="dataForm" :rules="rules">
    <el-form-item label="底图名称:" label-width="100px" prop="baseMapName">
        <el-input v-model="dataForm.baseMapName" clearable maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="底图地址:" label-width="100px" prop="baseMapAddress">
        <el-input v-model="dataForm.baseMapAddress" maxlength="500" clearable></el-input>
    </el-form-item>
    <el-form-item label="服务名称:" label-width="100px" prop="serverName">
        <el-input v-model="dataForm.serverName" maxlength="50"></el-input>
    </el-form-item>
    
    <!-- v-loading="!ProvinceData.length" -->
    <el-form-item label="加载范围:" label-width="100px" >
        <el-row>
            <el-col :span="8">
                <el-form-item>
                    <el-select v-model="dataForm.codeProvince" @change="changeProvince" @clear="clearProvince" clearable style="width:96%">
                        <el-option v-for="item in ProvinceData" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item>
                    <el-select v-model="dataForm.codeCity" @change="changeCity" @clear="clearCity" clearable style="width:96%">
                        <el-option v-for="item in CityData" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-select v-model="dataForm.codeDistrict" clearable style="width:96%">
                    <el-option v-for="item in District" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
                </el-select>
            </el-col>
        </el-row>
    </el-form-item>
    <el-form-item label="排序:" label-width="100px" prop="baseMapSort">
        <!-- <el-input v-model="dataForm.baseMapSort" ref="baseMapSort" clearable></el-input> -->
        <el-input-number v-model="dataForm.baseMapSort" ref="baseMapSort" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="启用状态：" label-width="100px">
        <el-switch v-model="baseMapStatusShow" @change="changeE"></el-switch>
    </el-form-item>
    <el-form-item label="备注：" label-width="100px">
        <el-input type="textarea" maxlength="150" show-word-limit v-model="dataForm.remark" clearable></el-input>
    </el-form-item>
    <el-form-item label=" " label-width="100px">
        <el-button type="primary" @click="submit()" style="float:right">提交</el-button>
    </el-form-item>
</el-form>
</template>

<script>

export default {
    props: ['onClose'],
    data() {
        return {
            visible: false,
            loading: true,
            rules: {
                baseMapName: [{
                    required: true,
                    message: "请输入底图名称",
                    trigger: "blur"
                }],
                serverName: [{
                    required: true,
                    message: "请输入服务名称",
                    trigger: "blur"
                }],
                baseMapAddress: [{
                    required: true,
                    message: "请输入底图地址",
                    trigger: "blur"
                }],
                // baseMapSort: [{
                //         required: true,
                //         message: "序号为必填项",
                //         trigger: "blur"
                //     },
                //     {
                //         type: 'number',
                //         message: '序号必须为数字',
                //         trigger: "blur"
                //     }
                // ]
            },
            treeData: {},
            ProvinceData: [],
            CityData: [],
            District: [],
            baseMapStatusShow: false,
            dataForm: {
                "dtxxbId": null,
                "baseMapName": "",
                "serverName": "",
                "baseMapAddress": null,
                "codeProvince": null,
                "codeCity": null,
                "codeDistrict": null,
                "baseMapStatus": false,
                "baseMapSort": 0,
                "remark": "",
            },
        }
    },
    methods: {
        getTree(callback) {
            this.$apis.getRegionTree({}, (res) => {
                for(let item of res) {
                    item.id = Number(item.id)
                }
                var _data = res;
                var treeData = {};
                for (let i = 0; i < _data.length; i++) {
                    const element = _data[i];
                    treeData[element.id] = element;
                };
                this.treeData = treeData;
                for (let i = 0; i < _data.length; i++) {
                    const element = _data[i];
                    if (treeData.hasOwnProperty(element.pid)) {
                        let parentItem = treeData[element.pid];
                        if (!parentItem.hasOwnProperty('children')) {
                            parentItem.children = [];
                        };
                        parentItem.children.push(element);
                    } else {
                        this.ProvinceData.push(element);
                    };
                };
                callback();
            }, (err) => {
                console.error(err);
            })
        },
        init(data) {
            this.ProvinceData = [];
            this.District = [];
            this.CityData = [];
            this.visible = true;
            this.getTree(() => {
                //console.log(this.ProvinceData)
                if (!data) {
                    this.loading = false;
                    return
                }
                this.$apis.getbaseMapDetail(data.dtxxbId, (res) => {
                    this.loading = false;
                    if (res) {
                        this.dataForm = res;
                        res.baseMapStatus == '0' ? (this.baseMapStatusShow = true) : (this.baseMapStatusShow = false);

                        if (res.codeProvince) {
                            this.CityData = this.treeData[res.codeProvince].children;
                            this.dataForm.codeProvince = parseInt(res.codeProvince);
                        };
                        if (res.codeCity) {
                            this.District = this.treeData[res.codeCity].children;
                            this.dataForm.codeCity = parseInt(res.codeCity);
                        };
                        if (res.codeDistrict) {
                            this.dataForm.codeDistrict = parseInt(res.codeDistrict);
                        }
                        //this.dataForm = data;

                    };

                })

            });

        },
        clearProvince() {
            this.dataForm.codeCity = null;
            this.dataForm.codeDistrict = null;
            this.District = [];
            this.CityData = [];
        },
        clearCity() {
            this.dataForm.codeDistrict = null;
            this.District = [];
        },
        changeCity(value) {
            if (value) {
                this.District = this.treeData[value].children;
                this.dataForm.codeDistrict = null;
            };
        },
        changeProvince(value) {
            if (value) {
                this.CityData = this.treeData[value].children;
                this.District = [];
                this.dataForm.codeCity = null;
                this.dataForm.codeDistrict = null;
            };
        },
        changeE(val) {
            //console.log(val)
            if (val) {
                this.dataForm.baseMapStatus = '0'
            } else {
                this.dataForm.baseMapStatus = '1'

            }
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    ////console.log(this.dataForm)
                    if (this.baseMapStatusShow) {
                        this.dataForm.baseMapStatus = '0'
                    } else {
                        this.dataForm.baseMapStatus = '1'
                    }
                    this.$apis.saveBaseMapData(this.dataForm, () => {
                        this.loading = false;
                        this.visible = false;
                        this.$message({
                            type: "success",
                            message: "操作成功",
                        });
                        this.onClose();
                    }, () => {
                        this.loading = false;
                    });
                };
            });
        },
    },
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
    }
}
</script>
