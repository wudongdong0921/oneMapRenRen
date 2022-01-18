import request from '@/utils/axiosevent';

// 获取底图列表
var getBaseMapList = function (name) {
    return request({
        type: 'post',
        params: {
            'baseMapName': name // 底图名称关键字
        },
        url: '/PictureBaseMap/selectPictureBaseMapByNameList',
        token: true
    });
};

// 添加或修改底图数据
var saveBaseMapData = function (data) {
    return request({
        type: 'post',
        data: {
            "dtxxbId": data.dtxxbId, // 底图信息ID
            "baseMapName": data.baseMapName, // 底图名称
            "serverName": data.serverName, // 服务名称
            "baseMapAddress": data.baseMapAddress, // 底图地址
            "codeProvince": data.codeProvince, // 省代码
            "codeCity": data.codeCity, // 市代码
            "codeDistrict": data.codeDistrict, // 区代码
            "baseMapStatus": data.baseMapStatus, // 地图状态
            "baseMapSort": data.baseMapSort, // 地图排序
            "remark": data.remark, // 地图备注
        },
        url: '/PictureBaseMap/addPictureBaseMapInfo',
        token: true
    });
};

// 批量删除底图数据接口
var deleteBaseMapData = function (array) {
    return request({
        type: 'post',
        params: {
            dtxxbIds: array.join(','), // 逗号分隔ID 字符串
        },
        url: '/PictureBaseMap/deletePictureBaseMapBYIdsInfo',
        token: true
    });
};
//查询底图信息
var getbaseMapDetail = function (id) {
    return request({
        type: 'post',
        params: {
            'dtxxbId': id
        },
        url: '/PictureBaseMap/selectPictureBaseMapInfo',
        token: true
    });
};
//坐标系 分页
var getCoordinateList = function (data) {
    return request({
        type: 'get',
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            subband: data.subband ? parseInt(data.subband) : "",
            status: data.status,
        },
        url: '/pictureSubbandController/getPage',
    });
}
//批量更新状态
var updateStatus = function (data) {
    // debugger;

    var str = [];
    for (let i = 0; i < data.fdhxxbIds.length; i++) {
        const element = data.fdhxxbIds[i];
        str.push('fdhxxbIds=' + element);
    }
    str.push('status=' + data.status);
    return request({
        type: 'post',
        url: '/pictureSubbandController/updateStatus?' + str.join('&'),
    });
}
//获取地图列表
var getMapList = function (data) {
    return request({
        type: 'get',
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            mapName: data.mapName,
            mapDataType: data.mapDataType
        },
        url: '/pictureMapController/getPage',

    });
}
//新增/修改地图
var updateMap = function (data) {
    return request({
        type: 'post',
        data: {
            dtxxbId: data.dtxxbId,
            mapName: data.mapName,
            mapAddress: data.mapAddress,
            mapDataType: data.mapDataType,
            mapOrder: data.mapOrder,
            mapServerName: data.mapServerName,
            // mapServerAddress: data.mapServerAddress,
            sjyId: data.sjyId,
            sjbId: data.sjbId,
            legendAddress: data.legendAddress,
            minShowLevel: data.minShowLevel,
            maxShowLevel: data.maxShowLevel,
            twoDimensionalIsdisplay: data.twoDimensionalIsdisplay,
            threeDimensionalIsdisplay: data.threeDimensionalIsdisplay,
            dynamicProjection: data.dynamicProjection,
        },
        url: '/pictureMapController/updataPictureMap',
    });
}
//删除地图
var deleteMap = function (id) {
    return request({
        type: 'post',
        params: {
            dtxxbId: id
        },
        url: '/pictureMapController/deleteById',
    });
}
//地图详情
var getMapDetail = function (id) {
    return request({
        type: 'post',
        params: {
            dtxxbId: id
        },
        url: '/pictureMapController/selectById',
    });
}
//根据目录类型查询
//?targetType='+type
var queryTreeDataDir = function (type) {

    return request({
        type: 'post',
        // params: {
        //     targetType:type
        // },
        url: '/zrzy/queryTreeDataDir?targetType=' + type,
        token: true
    });
}

// async function queryTreeDataDirAdd(type) {

// }

//数据目录添加
var insertDataDir = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/zrzy/insertDataDir',
        token: true
    });
}
//删除数据目录
var deleteDataDir = function (id) {
    return request({
        type: 'post',
        url: '/zrzy/deleteDataDir?sjmlxxbId=' + id,
        token: true
    });
}
//修改数据目录
var changeDataDir = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/zrzy/updateDataDir',
        token: true
    });
}
//根据编号查询数据目录
var getDataDirDetail = function (data) {
    return request({
        type: 'post',
        params: data,
        url: '/zrzy/queryDataDirById',
        token: true
    });
}
//获取地图下拉列表数据
var getMapData = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/pictureMapController/getMapSelect',
    });
}


// 获取字典项
var getDict = function (code, success) {

    return request({
        type: 'post',
        url: '/specificAnalysisV2/getDicSelectList?value=' + code + "&pid=0",
    });

};
//获取业务分析
var getBusinessAnalysis = function (id) {
    return request({
        type: 'post',
        params: {
            theCategory: id
        },
        url: '/caBusinessAnalysis/getBusinessAnaylsisForSelect',
    });
}
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
        token: true
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
        token: true
    });
}
//规划成果类型批量删除
var deleteRramsPlanResultType = function (data) {
    //console.log(data.ghcglxIds);
    return request({
        type: 'post',
        //params:data,   
        url: '/rramsPlanResultType/deleteRramsPlanResultType?ghcglxIds=' + data.ghcglxIds,
        token: true
    });
}
//规划成果类型修改
var updateRramsPlanResultType = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanResultType/updateRramsPlanResultType',
        token: true
    });
}
//规划成果类型添加
var addRramsPlanResultType = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanResultType/addRramsPlanResultType',
        token: true
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
        token: true
    });
}
//修改规划行政区划信息
var updatePlanningDistrict = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanAr/updateRramsPlanAr',
        token: true
    });
}
//删除规划行政区划
var deletePlanningDistrict = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/rramsPlanAr/deleteRramsPlanAr',
        token: true
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
        token: true
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
        token: true
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
    getBaseMapList: getBaseMapList, // 获取底图列表
    saveBaseMapData: saveBaseMapData,// 添加或修改底图数据
    getbaseMapDetail: getbaseMapDetail,//查询底图信息
    deleteBaseMapData: deleteBaseMapData, // 批量删除底图数据接口

    getCoordinateList: getCoordinateList,//坐标系 分页
    updateStatus: updateStatus,//批量更新状态
    getMapList: getMapList,//获取地图列表
    updateMap: updateMap,//新增/修改地图
    deleteMap: deleteMap,//删除地图
    getMapDetail: getMapDetail,//地图详情

    queryTreeDataDir: queryTreeDataDir,//根据目录类型查询
    insertDataDir: insertDataDir,//数据目录添加
    deleteDataDir: deleteDataDir,//删除数据目录
    changeDataDir: changeDataDir,//修改数据目录
    getDataDirDetail: getDataDirDetail,//根据编号查询数据目录
    getMapData: getMapData,//获取地图下拉列表数据
    getDict: getDict,//获取字典项
    getBusinessAnalysis: getBusinessAnalysis,//获取业务分析

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
