<template>
<div v-loading="loading">

    <el-form ref="dataForm" :model="dataForm">
        <el-form-item label="类型:" label-width="120px" prop="targetType">
            <el-radio-group v-model="dataForm.targetType" @change="changeRadio">
                <el-radio label="0" :disabled='dataForm.targetType !== "0" && type === 1'>菜单</el-radio>
                <el-radio label="1" :disabled='dataForm.targetType !== "1" && type === 1'>地图</el-radio>
                <el-radio label="3" :disabled='dataForm.targetType !== "3" && type === 1'>分析</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <!-- v-if="dataForm.targetType=='0'" -->
    <!-- 菜单 -->
    <el-form ref="menudataFormList" :model="menudataFormList" :rules="rules" v-if="dataForm.targetType=='0'">
        <el-form-item prop="parentName" :label="$t('menu.parentName')" class="menu-list" label-width="120px">
            <el-popover v-model="menudataFormList.menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
                <el-tree :data="menuList" :props="{ label: 'directoryName', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle">
                </el-tree>
            </el-popover>
            <el-input v-model="menudataFormList.parentName" v-popover:menuListPopover :readonly="true" :placeholder="$t('menu.parentName')">
                <i v-if="menudataFormList.pid !== '0'" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
            </el-input>
        </el-form-item>
        <el-form-item label="名称:" label-width="120px" prop="directoryName">
            <el-input v-model="menudataFormList.directoryName" maxlength="35"></el-input>
        </el-form-item>
        <el-form-item label="标识:" label-width="120px" prop="identification">
            <el-input v-model="menudataFormList.identification" maxlength="35"></el-input>
        </el-form-item>
        <el-form-item prop="sort" :label="$t('menu.sort')" label-width="120px">
            <el-input-number v-model="menudataFormList.sort" controls-position="right" :min="0" :label="$t('menu.sort')"></el-input-number>
        </el-form-item>
        <el-form-item prop="iconName" :label="$t('menu.icon')" label-width="120px" class="icon-list" v-if="currentType==0">
            <el-popover v-model="iconListVisible" ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-sys__menu-icon-popover">
                <div class="mod-sys__menu-icon-inner">
                    <div class="mod-sys__menu-icon-list">
                        <el-button v-for="(item, index) in iconList" :key="index" @click="iconListCurrentChangeHandle(item)" :class="{ 'is-active': menudataFormList.icon === item }">
                            <svg class="icon-svg" aria-hidden="true">
                                <use :xlink:href="`#${item}`"></use>
                            </svg>
                        </el-button>
                    </div>
                </div>
            </el-popover>
            <el-input v-model="menudataFormList.iconName" clearable v-popover:iconListPopover :placeholder="$t('menu.icon')"></el-input>
        </el-form-item>

        <el-form-item label="背景颜色:" label-width="120px" prop="colorValue" v-if="currentType==0">
            <el-color-picker v-model="menudataFormList.colorValue"></el-color-picker>
        </el-form-item>
        <el-form-item label=" ">

            <el-button type="primary" @click="submit('menudataFormList')" style="float:right;">确定</el-button>
            <el-button @click="closeEvent" style="float:right;margin-right:10px">取消</el-button>
        </el-form-item>
    </el-form>

    <!-- 地图 -->
    <el-form ref="mapdataFormL" :model="mapdataFormL" :rules="rules" v-if="dataForm.targetType=='1'">
        <el-form-item prop="parentName" :label="$t('menu.parentName')" class="menu-list" label-width="120px">
            <el-popover v-model="mapdataFormL.menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
                <el-tree :data="menuList" :props="{ label: 'directoryName', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle">
                </el-tree>
            </el-popover>
            <el-input v-model="mapdataFormL.parentName" v-popover:menuListPopover :readonly="true" :placeholder="$t('menu.parentName')">
                <i v-if="mapdataFormL.pid !== '0'" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
            </el-input>
        </el-form-item>
        <!-- <el-form-item label="名称:" label-width="120px" prop="directoryName">
            <el-input v-model="mapdataFormL.directoryName"></el-input>
        </el-form-item> -->
        <el-form-item prop="sort" :label="$t('menu.sort')" label-width="120px">
            <el-input-number v-model="mapdataFormL.sort" controls-position="right" :min="0" :label="$t('menu.sort')"></el-input-number>
        </el-form-item>
        <el-form-item label="选择地图:" label-width="120px" prop="mapId" v-if="currentType==1">
            <el-select :disabled='mapDisabled' filterable multiple ref="mapSelect" @change="mapChange" v-model="mapdataFormL.mapId" placeholder="搜索地图" style="width:100%">
                <el-option v-for="item in mapList" :key="item.mapId" :value="item.mapId" :label="item.mapName">{{item.mapName}}</el-option>
            </el-select>
            <!-- <el-popover v-model="popover" ref="menuListPopover" placement="bottom-start" trigger="click">
                <el-tree :data="mapList" :props="{ label: 'mapName', children: 'children' }" node-key="dictValue" ref="flowListTree" :highlight-current="true" accordion @current-change="menuListTreeCurrentChangeHandle" />
            </el-popover>
            <el-input v-model="dataForm.evaluate" v-popover:menuListPopover :readonly="true" /> -->
        </el-form-item>
        <el-form-item label=" ">

            <el-button type="primary" @click="submit('mapdataFormL')" style="float:right;">确定</el-button>
            <el-button @click="closeEvent" style="float:right;margin-right:10px">取消</el-button>
        </el-form-item>
    </el-form>

    <!-- 分析 -->
    <el-form ref="analysedataForm" :model="analysedataForm" :rules="rules" v-if="dataForm.targetType=='3'">
        <el-form-item prop="parentName" :label="$t('menu.parentName')" class="menu-list" label-width="120px">
            <el-popover v-model="analysedataForm.menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
                <el-tree :data="menuList" :props="{ label: 'directoryName', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle">
                </el-tree>
            </el-popover>
            <el-input v-model="analysedataForm.parentName" v-popover:menuListPopover :readonly="true" :placeholder="$t('menu.parentName')">
                <i v-if="analysedataForm.pid !== '0'" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
            </el-input>
        </el-form-item>
        <!-- <el-form-item label="名称:" label-width="120px" prop="directoryName">
            <el-input v-model="analysedataForm.directoryName"></el-input>
        </el-form-item> -->
        <el-form-item prop="sort" :label="$t('menu.sort')" label-width="120px">
            <el-input-number v-model="analysedataForm.sort" controls-position="right" :min="0" :label="$t('menu.sort')"></el-input-number>
        </el-form-item>
        <el-form-item label="选择业务分析:" label-width="120px" prop="analyzeBusinessId" v-if="currentType==3">
            <el-row>
                <el-col :span="8">
                    <el-form-item>
                        <el-select v-model="analysedataForm.theCategory" @change="changeType" @clear="clearAnalyseType" clearable style="width:96%">
                            <el-option v-for="(item,index) in baoSource" :key="'baoSource' + index" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item>
                        <el-select ref="analySelect" v-model="analysedataForm.analyzeBusinessId" @change="changeAnalyse" clearable style="width:96%">
                            <el-option v-for="item in analyseData" :key="item.value" :value="item.value" :label="item.label">{{item.label}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label=" ">

            <el-button type="primary" @click="submit('analysedataForm')" style="float:right;">确定</el-button>
            <el-button @click="closeEvent" style="float:right;margin-right:10px">取消</el-button>
        </el-form-item>
    </el-form>

    <!-- <el-form-item label="授权标识符:" label-width="120px" prop="authId" v-if="currentType!=0">
            <el-input v-model.number="dataForm.authId" clearable></el-input>
        </el-form-item>
        <el-form-item prop="defaultFlag" :label="'默认标识'" label-width="120px" v-if="currentType!=0">
            <el-input-number v-model="dataForm.defaultFlag" controls-position="right" :min="0" :label="'默认标识'"></el-input-number>
        </el-form-item> -->

</div>
</template>

<script>
import apis from './apis'
import {
    getIconList
} from '@/utils'
export default {
    //import引入的组件
    components: {},
    props: ['type'],
    data() {
        return {
            allMenu: [],
            menuList: [],
            mapList: [],
            menuListVisible: false,
            iconList: [],
            iconListVisible: false,
            dataForm: {
                id: '',
                targetType: "0",
                superiorMenuId: "",
                pid: ""
            },
            menudataFormList: {
                directoryName: '',
                identification: '',
                parentName: "",
                sort: "",
                iconName: "",
                colorValue: "",
                icon: '',
                pid: '',
                superiorMenuId: "",
                menuListVisible: false,
            },
            mapdataFormL: {
                directoryName: '',
                parentName: "",
                sort: "",
                mapId: "",
                pid: '',
                superiorMenuId: "",
                menuListVisible: false,
            },
            analysedataForm: {
                directoryName: '',
                parentName: "",
                sort: "",
                theCategory: '',
                analyzeBusinessId: '',
                pid: '',
                superiorMenuId: "",
                menuListVisible: false,
            },
            rules: {
                targetType: [{
                    required: true,
                    message: "请选择类型",
                    trigger: "blur"
                }],
                parentName: [{
                    required: true,
                    message: "请选择上级菜单",
                    trigger: "blur"
                }],
                directoryName: [{
                    required: true,
                    message: "请输入名称",
                    trigger: "blur"
                }],
                mapId: [{
                    required: true,
                    message: "请选择地图",
                    trigger: "blur"
                }],
                analyse: [{
                    required: true,
                    message: "请选择业务分析",
                    trigger: "blur"
                }],

            },
            loading: true,
            analyseTypeData: [],
            analyseData: [],
            currentType: "0",
            baoSource: [],
            mapObj: {},
            mapDisabled: false
        };
    },
    //方法集合
    methods: {
        // menudataFormList() {

        // },
        mapChange(e){
            // this.mapdataFormL.directoryName = []
            // this.$nextTick(()=>{
            //     this.mapdataFormL.directoryName = this.$refs.mapSelect.selectedLabel
            //     console.log(this.mapdataFormL.directoryName);
            // })
            // 
        },
        init() {
            this.loading = false
            this.$nextTick(() => {
                this.$refs['menudataFormList'].resetFields()
                this.iconList = getIconList()
                this.menudataFormList.pid = '0'
                this.mapdataFormL.pid = '0'
                this.analysedataForm.pid = '0'
                this.menudataFormList.parentName = this.$t('menu.parentNameDefault')
                this.mapdataFormL.parentName = this.$t('menu.parentNameDefault')
                this.analysedataForm.parentName = this.$t('menu.parentNameDefault')
                this.getMenuList();
                //this.getAnalyzeList();
            })
        },
        initdata(data) {
            this.$apis.getDataDirDetail({
                sjmlxxbId: data.sjmlxxbId
            }, (res) => {
                this.loading = false;
                res.sort = res.directoryOrder;
                res.pid = '0';
                res.parentName = this.$t('menu.parentNameDefault')
                this.changeRadio(res.targetType);

                //this.currentType = data.targetType;
                for (let i = 0; i < this.allMenu.length; i++) {
                    const element = this.allMenu[i];
                    if (String(element.sjmlxxbId) == String(res.superiorMenuId)) {
                        res.pid = element.sjmlxxbId
                        res.parentName = element.directoryName

                        // console.log(element.sjmlxxbId);
                        break;
                    }
                }

                // console.log(res.superiorMenuId);
                

                this.dataForm.targetType = res.targetType;
                this.dataForm.sjmlxxbId = res.sjmlxxbId
                if (res.targetType == 0) {
                    this.menudataFormList = res;
                } else if (data.targetType == 1) {
                    this.mapdataFormL = res
                    this.mapdataFormL.mapId = res.mapId.split(',')
                    this.mapDisabled = true
                } else {
                    this.getAnalyzeList()
                    if (res.theCategory) {
                        this.handleFileList(res.theCategory)
                    }
                    this.analysedataForm = res;
                }

            }, (err) => {})

        },
        getTree(res) {
            var _data = {}; // 递归源对象
            var treeData = [];
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                _data[element.sjmlxxbId] = element;
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
        // 获取菜单列表
        getMenuList() {
            this.$apis.queryTreeDataDir("", res => {
                //console.log(res);
                this.allMenu = res;
                var noMapMenu = res.filter(item => {
                    return item.targetType != '1'
                })
                //console.log(noMapMenu)
                this.menuList = this.getTree(noMapMenu)
            }, (err) => {})
        },
        //获取地图下拉列表数据
        getMapList() {
            this.$apis.getMapData({},res => {
                // console.log(res);
                this.mapList = res;
                for(let item of res) {
                    this.mapObj[item.mapId] = item
                }
            }, (err) => {})
        },
        handleFileList(data) {

            this.$apis.getBusinessAnalysis(data, (res) => {
                this.analyseData = res
            })
        },
        getAnalyzeList() {
            this.$apis.getDict("YWFX",(res) => {
                this.baoSource = res;
            });
        },
        // 上级菜单树, 设置默认值
        deptListTreeSetDefaultHandle() {
            this.menudataFormList.pid = '0'
            this.mapdataFormL.pid = '0'
            this.analysedataForm.pid = '0'
            this.menudataFormList.parentName = this.$t('menu.parentNameDefault')
            this.mapdataFormL.parentName = this.$t('menu.parentNameDefault')
            this.analysedataForm.parentName = this.$t('menu.parentNameDefault')
        },
        // 上级菜单树, 选中
        menuListTreeCurrentChangeHandle(data) {

            if (this.dataForm.targetType == 0) {
                this.menudataFormList.pid = data.sjmlxxbId
                this.menudataFormList.parentName = data.directoryName
                this.menudataFormList.menuListVisible = false
            } else if (this.dataForm.targetType == 1) {
                this.mapdataFormL.pid = data.sjmlxxbId
                this.mapdataFormL.parentName = data.directoryName
                this.mapdataFormL.menuListVisible = false
            } else {
                this.analysedataForm.pid = data.sjmlxxbId
                this.analysedataForm.parentName = data.directoryName
                this.analysedataForm.menuListVisible = false
            }

        },
        // 图标, 选中
        iconListCurrentChangeHandle(icon) {
            this.menudataFormList.iconName = icon
            this.iconListVisible = false
        },
        changeRadio(val) {
            //console.log(val);

            this.deptListTreeSetDefaultHandle()
            this.currentType = val;
            if (val == 1) {

                this.getMapList()

            } else if (val == 3) {
                this.getAnalyzeList()
            }
        },
        changeType: function (val) {
            //console.log(val);
            this.analysedataForm.analyzeBusinessId = ''
            this.handleFileList(val)
        },
        changeAnalyse: function (val) {
            //console.log(val);
            this.analysedataForm.analyzeBusinessId = val;
            this.$nextTick(()=>{
                this.analysedataForm.directoryName = this.$refs.analySelect.selectedLabel
            })

        },
        clearAnalyseType: function (val) {

            this.analysedataForm.analyzeBusinessId = 0
        },
        closeEvent: function () {

            this.$emit("closeE")
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var post = {}
                    if (this.dataForm.targetType == 0) {
                        post.directoryName = this.menudataFormList.directoryName
                        post.identification = this.menudataFormList.identification
                        post.superiorMenuId = this.menudataFormList.pid
                        post.directoryOrder = this.menudataFormList.sort
                        post.iconName = this.menudataFormList.iconName
                        post.colorValue = this.menudataFormList.colorValue
                        post.mapIds = ''
                        post.targetType = this.dataForm.targetType
                        post.analyzeBusinessId = ''
                    } else if (this.dataForm.targetType == 1) {
                        let arr = []
                        for(let item of this.mapdataFormL.mapId) {
                            arr.push(this.mapObj[item].mapName)
                        }
                        this.mapdataFormL.directoryName = arr
                        post.directoryName = this.mapdataFormL.directoryName.join(',')
                        post.superiorMenuId = this.mapdataFormL.pid
                        post.directoryOrder = this.mapdataFormL.sort
                        post.iconName = ''
                        post.colorValue = ''
                        post.mapIds = this.mapdataFormL.mapId.join(',')
                        post.targetType = this.dataForm.targetType
                        post.analyzeBusinessId = ''
                    } else {
                        post.directoryName = this.analysedataForm.directoryName
                        post.superiorMenuId = this.analysedataForm.pid
                        post.directoryOrder = this.analysedataForm.sort
                        post.iconName = ''
                        post.colorValue = ''
                        post.mapIds = ''
                        post.targetType = this.dataForm.targetType
                        post.analyzeBusinessId = this.analysedataForm.analyzeBusinessId
                    }
                    if (this.dataForm.sjmlxxbId) {
                        post.updateUser = ''
                        post.sjmlxxbId = this.dataForm.sjmlxxbId
                        this.$apis.changeDataDir(post,(res) => {
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            //this.$refs[formName].resetFields()
                            this.$emit("closeE", "add")
                        }, (err) => { })
                    } else {
                        post.createUser = ''
                        this.$apis.insertDataDir(post, (res) => {
                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            //this.$refs[formName].resetFields()
                            this.$emit("closeE", "add")
                        }, (err) => {})
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$apis = this.$API.get(['onemap:twoDimMap']);
        this.init();

    },
}
</script>

<style lang="scss">
.mod-sys__menu {

    .menu-list,
    .icon-list {

        .el-input__inner,
        .el-input__suffix {
            cursor: pointer;
        }
    }

    &-icon-popover {
        width: 458px;
        overflow: hidden;
    }

    &-icon-inner {
        width: 478px;
        max-height: 258px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    &-icon-list {
        width: 458px;
        padding: 0;
        margin: -8px 0 0 -8px;

        >.el-button {
            padding: 8px;
            margin: 8px 0 0 8px;

            >span {
                display: inline-block;
                vertical-align: middle;
                width: 18px;
                height: 18px;
                font-size: 18px;
            }
        }
    }
}
</style>
