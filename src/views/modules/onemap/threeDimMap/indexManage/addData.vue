<template>
    <div v-loading="loading">

        <el-form ref="dataForm" :model="dataForm">
            <el-form-item label="类型:" label-width="120px" prop="targetType">
                <el-radio-group v-model="dataForm.targetType" @change="changeRadio">
                    <el-radio label="0" :disabled='dataForm.targetType !== "0" && type === 1'>菜单</el-radio>
                    <el-radio label="1" :disabled='dataForm.targetType !== "1" && type === 1'>地图</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <!-- 菜单 -->
        <el-form ref="menudataFormList" :model="menudataFormList" :rules="rules" v-if="dataForm.targetType=='0'">
            <el-form-item prop="parentName" label="上级菜单" class="menu-list" label-width="120px">
                <el-popover v-model="menudataFormList.menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
                    <el-tree :data="menuList" :props="{ label: 'directoryName', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle">
                    </el-tree>
                </el-popover>
                <el-input v-model="menudataFormList.parentName" v-popover:menuListPopover :readonly="true">
                    <i v-if="menudataFormList.pid !== '0'" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="名称:" label-width="120px" prop="directoryName">
                <el-input v-model="menudataFormList.directoryName" maxlength="35"></el-input>
            </el-form-item>
            <el-form-item label="标识:" label-width="120px" prop="identification">
                <el-input v-model="menudataFormList.identification" maxlength="35"></el-input>
            </el-form-item>
            <el-form-item prop="sort" label="排序" label-width="120px">
                <el-input-number v-model="menudataFormList.sort" controls-position="right" :min="0" label="排序"></el-input-number>
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
            <el-form-item prop="parentName" label="上级菜单" class="menu-list" label-width="120px">
                <el-popover v-model="mapdataFormL.menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
                    <el-tree :data="menuList" :props="{ label: 'directoryName', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle">
                    </el-tree>
                </el-popover>
                <el-input v-model="mapdataFormL.parentName" v-popover:menuListPopover :readonly="true">
                    <i v-if="mapdataFormL.pid !== '0'" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="mapType" label="地图类型" label-width="120px" v-if="currentType==1">
                <el-select v-model="mapdataFormL.mapType" :disabled='mapDisabled' @change="changeType" clearable style="width:96%">
                    <el-option v-for="item in mapTypeList" :key="item.id" :value="item.id" :label="item.label">{{item.label}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="sort" label="排序" label-width="120px">
                <el-input-number v-model="mapdataFormL.sort" controls-position="right" :min="0" label="排序"></el-input-number>
            </el-form-item>
            <el-form-item label="选择地图:" label-width="120px" prop="mapId" v-if="currentType==1">
                <el-select :disabled='mapDisabled' filterable multiple ref="mapSelect" @change="mapChange" v-model="mapdataFormL.mapId" placeholder="搜索地图" style="width:100%">
                    <el-option v-for="item in mapList" :key="item.mapId" :value="item.mapId" :label="item.mapName">{{item.mapName}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="submit('mapdataFormL')" style="float:right;">确定</el-button>
                <el-button @click="closeEvent" style="float:right;margin-right:10px">取消</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
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
                parentName: "一级菜单",
                identification: '',
                sort: "",
                iconName: "",
                colorValue: "",
                icon: '',
                pid: '0',
                superiorMenuId: "",
                menuListVisible: false,
            },
            mapdataFormL: {
                directoryName: '',
                parentName: "一级菜单",
                sort: "",
                mapId: "",
                pid: '0',
                superiorMenuId: "",
                mapType: 0,     //地图类型
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
                mapType: [{
                    required: true,
                    message: "请选择地图类型",
                    trigger: "blur"
                }],
                mapId: [{
                    required: true,
                    message: "请选择地图",
                    trigger: "blur"
                }],

            },
            loading: true,
            currentType: "0",
            mapObj: {},
            mapDisabled: false,
            mapTypeList: [
                {
                    label: "三维地图",
                    id: 0
                },
                {
                    label: "二维地图",
                    id: 1
                }
            ],
            tem: "",
        };
    },
    //方法集合
    methods: {
        mapChange(e) {
        },
        init() {
            this.loading = false
            this.$nextTick(() => {
                this.$refs['menudataFormList'].resetFields()
                this.iconList = getIconList()
                this.menudataFormList.pid = '0';
                this.mapdataFormL.pid = '0';
                this.menudataFormList.parentName = '一级菜单';
                this.mapdataFormL.parentName = '一级菜单';
                this.getMenuList();
                this.getMapList(this.mapdataFormL.mapType);
            })
        },
        initdata(data) {
            this.$api.getDataDirDetail({
                tdSjmlxxbId: data.tdSjmlxxbId
            }, (res) => {
                this.loading = false;
                res.mapType = parseInt(res.mapType);
                this.getMapList(res.mapType);
                res.sort = res.directoryOrder;
                this.changeRadio(res.targetType);

                //this.currentType = data.targetType;
                res.pid = res.superiorMenuId;
                if (res.superiorMenuId == '0') {
                    res.pid = '0';
                    res.parentName = '一级菜单';
                } else {
                    for (let i = 0; i < this.allMenu.length; i++) {
                        if (String(this.allMenu[i].tdSjmlxxbId) == String(res.superiorMenuId)) {
                            res.parentName = this.allMenu[i].directoryName;
                            console.log(res.pid)
                        }
                    }
                }
                this.dataForm.targetType = res.targetType;
                this.dataForm.tdSjmlxxbId = res.tdSjmlxxbId
                if (res.targetType == 0) {
                    this.menudataFormList = res;
                } else {
                    this.mapdataFormL = res
                    this.mapdataFormL.mapId = res.mapId.split(',')
                    this.mapDisabled = true
                }

            })
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
        // 获取菜单列表
        getMenuList() {
            this.$api.queryTdTreeDataDir('',res => {
                //console.log(res);
                this.allMenu = res;
                var noMapMenu = res.filter(item => {
                    return item.targetType != '1'
                })
                //console.log(noMapMenu)
                this.menuList = this.getTree(noMapMenu)
            })
        },
        //获取地图下拉列表数据
        getMapList(val) {
            if (val == 0) {
                this.$api.getTdMapData(val,res => {
                    this.mapList = res;
                    for (let item of res) {
                        this.mapObj[item.mapId] = item
                    }
                })
            } else if (val == 1) {
                this.$api.getMapData(val,res => {
                    this.mapList = res;
                    for (let item of res) {
                        this.mapObj[item.mapId] = item
                    }
                })
            } else {
                this.mapList = []
            }

        },
        // 上级菜单树, 设置默认值
        deptListTreeSetDefaultHandle() {
            this.menudataFormList.pid = '0'
            this.mapdataFormL.pid = '0'
            this.menudataFormList.parentName = "一级菜单"
            this.mapdataFormL.parentName = "一级菜单"
        },
        // 上级菜单树, 选中
        menuListTreeCurrentChangeHandle(data) {

            if (this.dataForm.targetType == 0) {
                this.menudataFormList.pid = data.tdSjmlxxbId
                this.menudataFormList.parentName = data.directoryName
                this.menudataFormList.menuListVisible = false
            } else if (this.dataForm.targetType == 1) {
                this.mapdataFormL.pid = data.tdSjmlxxbId
                this.mapdataFormL.parentName = data.directoryName
                this.mapdataFormL.menuListVisible = false
            }

        },
        // 图标, 选中
        iconListCurrentChangeHandle(icon) {
            this.menudataFormList.iconName = icon
            this.iconListVisible = false
        },
        changeRadio(val) {
            this.deptListTreeSetDefaultHandle()
            this.currentType = val;
        },
        // 更改地图类型
        changeType: function (val) {
            this.mapdataFormL.mapId = '';
            this.getMapList(val);
        },
        closeEvent: function () {
            this.$emit("closeE")
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var post = {}
                    if (this.dataForm.targetType == 0) {
                        post.directoryName = this.menudataFormList.directoryName;
                        post.identification = this.menudataFormList.identification
                        post.superiorMenuId = this.menudataFormList.pid;
                        post.directoryOrder = this.menudataFormList.sort;
                        post.iconName = this.menudataFormList.iconName;
                        post.colorValue = this.menudataFormList.colorValue;
                        post.mapIds = '';
                        post.mapType = '';
                        post.targetType = this.dataForm.targetType;
                    } else if (this.dataForm.targetType == 1) {
                        let arr = []
                        for (let item of this.mapdataFormL.mapId) {
                            arr.push(this.mapObj[item].mapName);
                        }
                        this.mapdataFormL.directoryName = arr;
                        post.directoryName = this.mapdataFormL.directoryName.join(',');
                        post.iconName = '';
                        post.colorValue = '';
                        post.superiorMenuId = this.mapdataFormL.pid;
                        post.directoryOrder = this.mapdataFormL.sort;
                        post.mapIds = this.mapdataFormL.mapId.join(',');
                        post.mapType = this.mapdataFormL.mapType;
                        post.targetType = this.dataForm.targetType;
                    }
                    if (this.dataForm.tdSjmlxxbId) {
                        post.updateUser = ''
                        post.tdSjmlxxbId = this.dataForm.tdSjmlxxbId
                        this.$api.changeDataDir(post,(res) => {
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            //this.$refs[formName].resetFields()
                            this.$emit("closeE", "add")
                        })
                    } else {
                        post.createUser = ''
                        this.$api.insertDataDir(post,(res) => {
                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            //this.$refs[formName].resetFields()
                            this.$emit("closeE", "add")
                        })
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
        this.$api = this.$API.get(['onemap:threeModule'])
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

        > .el-button {
            padding: 8px;
            margin: 8px 0 0 8px;

            > span {
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
