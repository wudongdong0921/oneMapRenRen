<template>
    <div class="addrole">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="0">
                <addRoleBasic @getInfo="getbasicInfo" ref="addRoleBasic" :areaObj='areaObj' :RegionList="RegionList" />
            </el-tab-pane>
            <el-tab-pane label="关联人员" name="1">
                <div style="height: 500px;overflow: auto;">
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="userText">
                    </el-input>

                    <el-tree
                        class="filter-tree"
                        :data="userList"
                        :props="{ children: 'children', label: 'name' }"
                        :default-expanded-keys="defaultExpandedKeys"
                        show-checkbox
                        :filter-node-method="filterNode"
                        node-key="id"
                        ref="userTree">
                    </el-tree>
                </div>
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="2">
                <div style="display:flex;width: 50%;float: left">
                    <div style="margin-right: 6px;margin-top: 4px;">后台菜单授权</div>
                    <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" show-checkbox node-key="id" ref="menuListTree"></el-tree>
                </div>
                <div style="display:flex;width: 50%;">
                    <div style="margin-right: 6px;margin-top: 4px;">前台菜单授权</div>
                    <el-tree :data="menuBusinessList" :props="{ label: 'name', children: 'children' }" show-checkbox node-key="id" ref="menuBusinessListTree"></el-tree>
                </div>
            </el-tab-pane>
            <el-tab-pane label="数据权限" name="3">
                <div style="display:flex">
                    <div style="margin-right: 6px;margin-top: 4px;">数据授权</div>
                    <el-tree :data="deptList" :props="{ label: 'name', children: 'children' }" show-checkbox node-key="id" ref="deptListTree"></el-tree>
                </div>
            </el-tab-pane>
            <el-tab-pane label="流程权限" name="4">
                <div style="display:flex">
                    <div style="margin-right: 6px;margin-top: 4px;">流程栏</div>
                    <el-tree :data="flowList" :props="{ label: 'flowname', children: 'children' }" show-checkbox node-key="flowid" ref="flowListTree"></el-tree>
                </div>
            </el-tab-pane>
            
            <el-tab-pane label="数据目录权限" name="5" v-if="tabsShow.sjmlxxbIdList">
                <div style="display:flex">
                    <div style="margin-right: 6px;margin-top: 4px;">数据目录</div>
                    <el-tree :data="sjmlxxbIdList" :props="{ label: 'dirName', children: 'children' }" show-checkbox node-key="id" ref="sjmlxxbIdListTree"></el-tree>   
                </div>
                <menuExtend v-on:change-extendTree="changeExtendTree" :selectFileArray="selectFileArray" :selectStaticArray="selectStaticArray"></menuExtend>
            </el-tab-pane>

            <el-tab-pane label="一张图边界" name="6" v-if="tabsShow.mapAreaList">
                <el-form ref="mapForm" :model="mapDataForm" :rules="mapRules">
                    <el-form-item label="行政区划边界:" label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-select v-model="mapDataForm.codeProvince" @change="mapChangeProvince" clearable style="width:96%">
                                        <el-option v-for="item in mapRegionList" :key="item.id" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-select v-model="mapDataForm.codeCity" @change="mapChangeCity" clearable style="width:96%">
                                        <el-option v-for="item in mapCityData" :key="item.id" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-select v-model="mapDataForm.codeDistrict" @change="mapChangeDistrict" clearable style="width:96%">
                                    <el-option v-for="item in mapDistrict" :key="item.id" :value="item.dictValue" :label="item.dictLabel">{{item.dictLabel}}</el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!-- <el-tab-pane label="行政区划权限" name="5">
            <div style="display:flex">
                <div style="margin-right: 6px;margin-top: 4px;">行政区划授权</div>
                <el-tree :data="RegionList" :props="{ label: 'dictLabel', children: 'children' }" show-checkbox node-key="id" ref="flowListTree"></el-tree>
            </div>
        </el-tab-pane> -->
        </el-tabs>
        <div class="btnBox" style="text-align:center">
            <el-button @click="closedailog">取消</el-button>
            <el-button type="primary" @click="submit()">确认</el-button>
        </div>
    </div>
</template>

<script>
import addRoleBasic from './addRoleBasic'
import apis from './apis'
import axios from 'axios'
import jsTree from '@/utils/jsontree'
import menuExtend from './menuExtend/index.vue'

export default {
    //import引入的组件
    components: {
        addRoleBasic,menuExtend
    },
    props: ['type'],
    watch: {
      userText(val) {
        this.$refs.userTree.filter(val);
      }
    },
    data() {

        return {
            dataForm: {
                id: '',
                name: '',
                userIdList: [],
                menuIdList: [],
                deptIdList: [],
                workflowList: [],
                sjmlxxbIdList: [],
                RegionIdList: [],
                remark: '',
                defalutChecked: [],
            },
            mapDataForm: {
                codeProvince: '',
                codeCity: '',
                codeDistrict: ''
            },
            mapRules: {},
            value: "",
            userList: [],
            menuList: [],
            menuBusinessList: [],
            deptList: [],
            flowList: [],
            sjmlxxbIdList: [],
            RegionList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            activeName: "0",
            dis_sjmlxxbIdList: [],
            mapRegionList: [],
            mapCityData: [],
            mapDistrict: [],
            yztbjIdList: [],
            userText: '',
            setUserList: {},
            areaObj: {},
            defaultExpandedKeys: [],
            tabsShow: {
                mapAreaList: false,
                sjmlxxbIdList: false
            },
            selectFileArray: [],
            selectStaticArray: [],
        };
    },
    //方法集合
    methods: {
        init(id) {
            if (id) {
                this.dataForm.id = id
            }
            this.$nextTick(()=> {
                setTimeout(() => {
                    this.$refs.menuListTree.setCheckedKeys([])
                    this.$refs.menuBusinessListTree.setCheckedKeys([])
                    this.$refs.deptListTree.setCheckedKeys([])
                    this.$refs.flowListTree.setCheckedKeys([])
                    if(this.$refs.sjmlxxbIdListTree) this.$refs.sjmlxxbIdListTree.setCheckedKeys([])
                }, 100);
            })
            
            Promise.all([
                this.getUserList(),
                this.getMenuList(),
                this.getMenuBusinessList(),
                this.getDeptList(),
                this.getFlowLists(),
                // this.getFlowList(),
                this.getsjmlxxbIdList(),
                this.getRegiontree()
            ]).then(() => {
                if (this.dataForm.id) {
                    setTimeout(() => {
                    
                        this.getInfo()
                    }, 20)

                }

            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        getMapData(data) {
            if(data.yztbjIdList) {
                this.mapChangeProvince(data.yztbjIdList[0])
                this.mapChangeCity(data.yztbjIdList[1])
                this.mapDataForm.codeProvince = data.yztbjIdList[0]
                this.mapDataForm.codeCity = data.yztbjIdList[1]
                this.mapDataForm.codeDistrict = data.yztbjIdList[2]
                this.yztbjIdList = data.yztbjIdList
            }
            
        },
        // setTree(data) {
        //     let setNodes = []
        //     for(let item of data.userIdList) {
        //         setNodes.push(this.setUserList[item])
        //     }
        //     this.$refs.userTree.setCheckedNodes(setNodes)
        // },
        setTree(data) {
            let setNodes = []
            for (let item of data.userIdList) {
                if (data.userIdList.length == 1) {
                    if (this.$refs.userTree.getNode(this.setUserList[item]).childNodes.length > 0) {
                        break;
                    }
                }
                setNodes.push(this.setUserList[item])
            }
            setNodes.forEach(item => this.$refs.userTree.setChecked(item, true));
        },
        mapChangeProvince(e) {
            this.mapDataForm.codeCity = ''
            this.mapDataForm.codeDistrict = ''
            this.mapCityData = []
            this.mapDistrict = []
            this.yztbjIdList[1] = ''
            this.yztbjIdList[2] = ''
            this.yztbjIdList[0] = e
            if(e) this.mapCityData = this.areaObj[e].children
        },
        mapChangeCity(e) {
            this.mapDistrict = []
            this.yztbjIdList[1] = e
            this.yztbjIdList[2] = ''
            this.mapDataForm.codeDistrict = ''
            if(e) this.mapDistrict = this.areaObj[e].children
        },
        mapChangeDistrict(e) {
            this.yztbjIdList[2] = e
        },
        handleClick(tab, event) {

        },
        getbasicInfo(data) {
            this.dataForm.name = data.name;
            this.dataForm.remark = data.remark;
            this.dataForm.RegionIdList[0] = data.codeProvince
            this.dataForm.RegionIdList[1] = data.codeCity
            this.dataForm.RegionIdList[2] = data.codeDistrict
        },
        // 封装tree
        getTreeClass(data) {
            let obj = {}
            let dataList = []
            data.forEach((key) => {
                if (key.typename && !obj.hasOwnProperty(key.typename)) {
                    obj[key.typename] = []
                    obj[key.typename].push({
                        flowid: key.flowid,
                        flowname: key.flowname,
                        id: key.id
                    })
                } else if (key.typename && obj.hasOwnProperty(key.typename)) {
                    obj[key.typename].push({
                        flowid: key.flowid,
                        flowname: key.flowname,
                        id: key.id
                    })
                } else {
                    if (!obj.hasOwnProperty('其他')) {
                        obj['其他'] = []
                    }
                    obj['其他'].push({
                        flowid: key.flowid,
                        flowname: key.flowname,
                        id: key.id
                    })
                }
            })
            for (let item in obj) {
                dataList.push({
                    flowname: item,
                    children: obj[item]
                })
            }
            return dataList
        },
        getTree(res) {
            var _data = {}; // 递归源对象
            var treeData = [];
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                _data[element.id] = element;
            };
            for (let i = 0; i < res.length; i++) {
                const child = res[i];
                if (_data.hasOwnProperty(child.pid)) {
                    const parent = _data[child.pid];
                    if (!parent.hasOwnProperty('children')) parent['children'] = [];
                    parent['children'].push(child);
                } else {
                    treeData.push(child);
                }
            };

            return treeData;
        },
        //获取关联人员
        getUserList() {
            this.userList = []
            apis.getIndicatorTypeTree(this.$store.state.user.id)
            .then(res=> {
                for(let item of res.data) {
                    this.setUserList[item.id] = item
                }
                this.userList = jsTree(res.data,{})
                for(let item of this.userList) {
                    this.defaultExpandedKeys.push(item.id)
                }
            })
        },
        // 获取菜单列表
        getMenuList() {
            return this.$http.get('/sys/menu/select').then(({
                data: res
            }) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.menuList = res.data
            }).catch(() => { })
        },
        getMenuBusinessList() {
            return this.$http.get('/sys/menu/selectBusiness').then(({
                data: res
            }) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.menuBusinessList = res.data
            }).catch(() => { })
        },
        // 获取部门列表
        getDeptList() {
            return this.$http.get('/sys/dept/list').then(({
                data: res
            }) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.deptList = res.data
            }).catch(() => { })
        },
        // 流程栏
        getFlowLists() {
            return this.$http.post('/public/getFlowDefList').then(({
                data: res
            }) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.flowList = this.getTreeClass(res.data)
            }).catch(() => { })
        },
        //流程权限
        getFlowList() {

            axios({
                method: "post",
                url: window.SITE_CONFIG["wintoppublicinterfaceGW"] + "/workflow/getFlowDefList",
            }).then((res) => {
                if (res.data.code == 200) {
                    this.flowList = this.getTreeClass(res.data.data)
                };
            }).catch((err) => {
                console.log(err);
            });
        },
        //数据目录  
        getsjmlxxbIdList() {
            apis.getdataCatalogue().then((data) => {
                var _data = JSON.parse(JSON.stringify(data.data));
                // this.dis_sjmlxxbIdList = _data;
                for (let i = 0; i < _data.length; i++) {
                    const element = _data[i];
                    this.dis_sjmlxxbIdList.push(element.id);
                };
                this.sjmlxxbIdList = this.getTree(_data)
            })

        },
        //获取行政区划
        getRegiontree() {
            apis.getRegiontree().then(RegionList => {
                if(RegionList.data){
                  for(let item of RegionList.data) {
                    this.areaObj[item.dictValue] = item
                  }
                  this.RegionList = this.getTree(RegionList.data)
                  this.mapRegionList = this.RegionList
                }

            })
        },

        // 获取信息
        getInfo() {
        
            apis.getRoleInfo(this.dataForm.id).then(res => {
                this.dataForm = {
                    ...this.dataForm,
                    ...res.data
                }
            
                this.selectFileArray = res.data.docList;
                this.selectStaticArray = [res.data.openStatis];
                this.$refs.addRoleBasic.setdata(this.dataForm)
                this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true));
                this.dataForm.menuIdList.forEach(item => this.$refs.menuBusinessListTree.setChecked(item, true));
                // this.$nextTick(()=> {
                //     this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList);
                //     this.$refs.flowListTree.setCheckedKeys(this.dataForm.workflowList);
                // })
                this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList);
                this.$refs.flowListTree.setCheckedKeys(this.dataForm.workflowList);
                this.getMapData(this.dataForm)
                this.setTree(this.dataForm)
                // var unCheckList = [];
                // for (let i = 0; i < this.dis_sjmlxxbIdList.length; i++) {
                //     const element = this.dis_sjmlxxbIdList[i];
                //     if (this.dataForm.sjmlxxbIdList && this.dataForm.sjmlxxbIdList.indexOf(element) == -1) {
                //         unCheckList.push(element);
                //     }
                // };
                if(this.dataForm.sjmlxxbIdList) {
                    // this.$nextTick(()=> {
                    //   if(this.$refs.sjmlxxbIdListTree) this.$refs.sjmlxxbIdListTree.setCheckedKeys(this.dataForm.sjmlxxbIdList);
                    // })
                    // for (let d = 0; d < unCheckList.length; d++) {
                    //     const element = unCheckList[d];
                    //     this.$refs.sjmlxxbIdListTree.setChecked(element, false);
                    // };
                    this.dataForm.sjmlxxbIdList.forEach(value => {
                        this.$refs.sjmlxxbIdListTree.setChecked(value, true, false);
                    })
                }
            })

            // }).catch(() => {})
        },
        submit() {
            this.dataForm.userIdList = this.$refs.userTree.getCheckedKeys()
            this.$refs.addRoleBasic.getformdata();
            this.dataForm.deptIdList = this.$refs.deptListTree.getCheckedKeys();
            this.dataForm.menuIdList = this.$refs.menuListTree.getCheckedKeys();
            this.$refs.menuListTree.getHalfCheckedKeys().forEach(item => this.dataForm.menuIdList.push(item));
            this.$refs.menuBusinessListTree.getCheckedKeys().forEach(item => this.dataForm.menuIdList.push(item));
            this.$refs.menuBusinessListTree.getHalfCheckedKeys().forEach(item => this.dataForm.menuIdList.push(item));
            this.dataForm.workflowList = this.$refs.flowListTree.getCheckedKeys(true)
            // HNXGTKJ-1032
            if(this.$refs.sjmlxxbIdListTree) this.dataForm.sjmlxxbIdList = this.$refs.sjmlxxbIdListTree.getCheckedKeys();
            if (this.type == 0) {
                apis.addRole({
                    "areaCodeList": this.dataForm.RegionIdList, //区块代码列表
                    "deptIdList": this.dataForm.deptIdList, //部门ID列表
                    "menuIdList": this.dataForm.menuIdList, //菜单ID列表
                    "name": this.dataForm.name, //角色名称
                    "remark": this.dataForm.remark, //备注
                    "workflowList": this.dataForm.workflowList, //流程ID列表
                    "userIdList": this.dataForm.userIdList ? this.dataForm.userIdList : [], //用户ID列表
                    "sjmlxxbIdList": this.dataForm.sjmlxxbIdList, //数据目录ID列表
                    "yztbjIdList": this.yztbjIdList,
                    "docList": this.selectFileArray,
                    "openStatis": this.selectStaticArray.join(',')
                }).then((res) => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.$emit("closeE");
                })
            } else {
                apis.updateRoleInfo({
                    "id": this.dataForm.id,
                    "areaCodeList": this.dataForm.RegionIdList, //区块代码列表
                    "deptIdList": this.dataForm.deptIdList, //部门ID列表
                    "menuIdList": this.dataForm.menuIdList, //菜单ID列表
                    "name": this.dataForm.name, //角色名称
                    "remark": this.dataForm.remark, //备注
                    "workflowList": this.dataForm.workflowList, //流程ID列表
                    "userIdList": this.dataForm.userIdList ? this.dataForm.userIdList : [], //用户ID列表
                    "sjmlxxbIdList": this.dataForm.sjmlxxbIdList, //数据目录ID列表
                    "yztbjIdList": this.yztbjIdList,
                    "docList": this.selectFileArray,
                    "openStatis": this.selectStaticArray.join(',')
                })
                    .then(res => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$emit("closeE");
                    })
            }
        },
        closedailog() {
            this.$emit("closeE");
        },
         changeExtendTree(key, array) {
            if (key == 'selectStaticArray') {
                if (array.length == 0) {
                    this[key] = ['0'];
                } else {
                    this[key] = array;
                }
            } else {
                this[key] = array;
            }
        },


    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        if (this.type == 0) {
            this.init()
        }
        apis.getParamsIdList().then(res=> {
            for(let item of res.data) {
                if(item.value == 1) {
                    this.tabsShow[item.label] = true
                }
            }
        })
    },
}
</script>

<style>
.btnBox {
    text-align: center;
    margin-top: 70px;
}

.addrole .el-tree-node__content>.el-checkbox {
    margin-right: 8px !important;
}

.addrole .el-tree {
    min-width: 120px;
}

.addrole .el-transfer-panel__item.el-checkbox {
    display: block;
}
.tips {
    font-size: 12px;
    color: #aaa;
    margin-left: 120px;
}
</style>
