import request from '@/utils/axiosevent';

//角色表格显示
var getRoleList = function (data) {
    return request({
        type: 'get',
        params: { page: data.pageNum, limit: data.pageSize, name: data.name },
        url: '/sys/role/page',
        token: true,
    });
}
//角色添加
var addRole = function (data) {
   
    return request({
        type: 'post',
        data: data,
        url: '/sys/role',
        token: true,
    });
}
//获取关联人员
var getAllUser = function () {
    
    return request({
        type: 'get',
        //params:{},
        url: '/sys/user/findAllUser',
        token:true
    });
}
//获取行政区划
var getRegiontree =function () {
    return request({
        type: 'post',
        //params:{},
        url: '/public/getDicSelectList?value=XZQY',
        
    });
}
//删除角色
var deleteRole = function (data) {
    return request({
        type: 'delete',
        data: data,
        url: '/sys/role',
        token: true,
    });
}
//获取角色详情
var getRoleInfo = function (id){
    return request({
        type: 'get',
        
        url: '/sys/role/'+id,
        token:true
    });
}
//修改角色
var updateRoleInfo = function (data){
    return request({
        type: 'put',
        data: data,
        url: '/sys/role',
        token: true,
    });
}
//获取数据目录
var getdataCatalogue = function (){
    return request({
        type: 'get',
        url: '/public/selectDataDirMap',
        token:true
    });
}

var getIndicatorTypeTree = function (data){
    return request({
        type: 'post',
        url: '/sys/user/getIndicatorTypeTree?userId=' + data,
        token:true
    });
}

var getParamsIdList = function (data){
    return request({
        type: 'post',
        url: '/sys/role/getParamsIdList',
        token:true
    });
}


export default {
    getRoleList: getRoleList,//角色表格显示
    addRole:addRole,//角色添加
    getAllUser:getAllUser,//获取关联人员
    getRegiontree:getRegiontree,//获取行政区划
    deleteRole:deleteRole,//角色删除
    getRoleInfo:getRoleInfo,//获取角色详情
    updateRoleInfo:updateRoleInfo,//修改角色
    getdataCatalogue:getdataCatalogue,//获取数据目录
    getIndicatorTypeTree, // 获取关联人员
    getParamsIdList, // 选项卡显示
}