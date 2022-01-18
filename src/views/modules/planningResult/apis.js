import request from '@/utils/axiosevent';



//规划成果类型信息列表查询
var getPlanResultList = function (data) {
    return request({
        type: 'post',
        data: {
            'planResultName': data.planResultName,
            'orderField': data.orderField,
            'order': data.order
        },
        params: {
            'page': data.pageNum,
            'limit': data.pageSize,
            
        },
        url: '/rramsPlanResultType/getPageList',
        token: true,
        target:'achievement'
    });
}
//规划成果类型详情
var getPlanResultInfo = function (id) {
    return request({
        type: 'post',
        params: {
            'ghcglxId': id
        },
        url: '/rramsPlanResultType/getInfoById',
        token: true,
        target:'achievement'
    });
}
//规划成果类型批量删除
var deleteRramsPlanResultType = function (data) {
    //console.log(data.ghcglxIds);
    return request({
        type: 'post',
        //params:data,   
        url: '/rramsPlanResultType/deleteRramsPlanResultType?ghcglxIds=' + data.ghcglxIds,
        token: true,
        target:'achievement'
    });
}
//规划成果类型修改
var updateRramsPlanResultType = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanResultType/updateRramsPlanResultType',
        token: true,
        target:'achievement'
    });
}
//规划成果类型添加
var addRramsPlanResultType = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanResultType/addRramsPlanResultType',
        token: true,
        target:'achievement'
    });
}

//规划成果类型添加
var addRramsPlanResultType = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanResultType/addRramsPlanResultType',
        token: true,
        target:'achievement'
    });
}
//获取规划行政区划信息表
var getplanningDistrictList = function (data) {
    //debugger;
    return request({
        type: 'post',
        data: {
            'adName': data.adName,
            'ghcglxId': data.ghcglxId
        },
        params: {
            'page': data.pageNum,
            'limit': data.pageSize,
        },
        url: '/rramsPlanAr/getList',
        token: true,
        target:'achievement'
    });
}
//修改规划行政区划信息
var updatePlanningDistrict = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanAr/updateRramsPlanAr',
        token: true,
        target:'achievement'
    });
}
//删除规划行政区划
var deletePlanningDistrict = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanAr/deleteRramsPlanAr',
        token: true,
        target:'achievement'
    });
}
//规划行政区划详情
var PlanningDistrictInfo = function (id) {
    return request({
        type: 'post',
        params: {
            'ghxzqhId': id
        },
        url: '/rramsPlanAr/getInfoById',
        token: true,
        target:'achievement'
    });
}

//获取地图数据源
var getLayerDataSourceList = function () {
    return request({
        type: 'post',
        url: '/layerDataField/getLayerDataSourceList',
        token: true
    });
}
//获取数据表
var getLayerDataList2 = function (sjyId) {
    return request({
        type: 'post',
        params: {
            'sjyId': sjyId
        },
        url: '/layerDataField/getLayerDataList2',
        token: true
    });

}

//获取规划行政区划信息表NEW
var getplanningDistrictListNew = function (data) {
    //debugger;
    return request({
        type: 'post',
        data: {
            'adName': data.adName,
            'ghcglxId': data.ghcglxId
        },
        params: {
            'page': data.pageNum,
            'limit': data.pageSize,
        },
        url: '/rramsPlanAr/getNewList',
        token: true,
        target:'achievement'
    });
}

// 获取更新信息列表
var findMapMsgList = function(data) {
    return request({
        type: 'get',
        // data: data,
        token: true,
        url: '/mapUpdates/findList?dtxxbId=' + data
    })
}

// 保存/修改地图更新信息
var saveMapUpdates = function(data) {
    return request({
        type:'post',
        data: data,
        token: true,
        url: '/mapUpdates/saveMapUpdates'
    })
}

// 删除更新信息 
var deleteMapMsg = function (data) {
    return request ({
        type: 'delete',
        token: true,
        url: '/mapUpdates/delete?id=' + data
    })
}


export default {
  

    getPlanResultList: getPlanResultList,//规划成果类型信息列表查询
    deleteRramsPlanResultType: deleteRramsPlanResultType,//规划成果类型批量删除
    updateRramsPlanResultType: updateRramsPlanResultType,//规划成果类型修改
    addRramsPlanResultType: addRramsPlanResultType,//规划成果类型添加
    getPlanResultInfo: getPlanResultInfo,//规划成果类型详情

    getplanningDistrictList: getplanningDistrictList,//获取规划行政区划信息表
    updatePlanningDistrict: updatePlanningDistrict,//修改规划行政区划信息
    deletePlanningDistrict: deletePlanningDistrict,//删除规划行政区划
    PlanningDistrictInfo: PlanningDistrictInfo,//规划行政区划详情

    getLayerDataSourceList,//获取地图数据源
    getLayerDataList2,//获取数据表
    getplanningDistrictListNew:getplanningDistrictListNew, //获取规划行政区划信息表NEW

    findMapMsgList: findMapMsgList,     // 获取更新信息列表
    saveMapUpdates: saveMapUpdates,     // 保存/修改地图更新信息
    deleteMapMsg: deleteMapMsg,         // 删除更新信息
};
