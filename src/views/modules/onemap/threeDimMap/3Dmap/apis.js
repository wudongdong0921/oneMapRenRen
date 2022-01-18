import request from '@/utils/axiosevent';

// 三维地图读取地图列表
var getMapList = function (data) {
    return request({
        type: 'get',
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            mapName: data.mapName,
            mapType: data.mapType
        },
        url: '/pictureTdMapController/getPage'
    })

}

// 删除地图
var deleteMap = function (id) {
    return request({
        type: 'post',
        params: {
            tdDtxxbId: id
        },
        url: '/pictureTdMapController/deleteById'
    })
}

// 地图详情
var getMapDetail = function (id) {
    return request({
        type: 'post',
        params: {
            'tdDtxxbId': id
        },
        url: '/pictureTdMapController/selectById'
    })
}

// 新增/修改地图
// 不传tdDtxxbId是新增否则为修改
var updateMap = function (data) {

    if (data.tdDtxxbId) {
        return request({
            type: 'post',
            data: {
                mapName: data.mapName,
                mapAddress: data.mapAddress,
                mapType: data.mapType,
                mapOrder: data.mapOrder,
                status: data.status,
                tdDtxxbId: data.tdDtxxbId,
                isShow: data.isShow,
                minShowLevel: data.minShowLevel,
                maxShowLevel: data.maxShowLevel,
            },
            url: '/pictureTdMapController/updatePictureTdMap'
        })
    } else {
        return request({
            type: 'post',
            data: {
                mapName: data.mapName,
                mapAddress: data.mapAddress,
                mapType: data.mapType,
                mapOrder: data.mapOrder,
                status: data.status,
                minShowLevel: data.minShowLevel,
                maxShowLevel: data.maxShowLevel,
            },
            url: '/pictureTdMapController/updatePictureTdMap'
        })
    }

}

// 根据目录类型进行查询: 三维
//?targetType='+type
var queryTdTreeDataDir = function (type) {
    return request({
        type: 'post',
        url: '/PictureTdDataDirectory/queryTdTreeDataDir',
        token: true
    })
}

// 删除数据目录
var deleteDataDir = function (id) {
    return request({
        type: 'post',
        url: '/PictureTdDataDirectory/deleteTdDataDir?tdSjmlxxbId=' + id,
        token: true
    })
}

// 根据编号查询数据目录
var getDataDirDetail = function (data) {
    return request({
        type: 'post',
        params: data,
        url: '/PictureTdDataDirectory/queryTdDataDirById',
        token: true
    })
}

// 获取地图下拉列表数据:三维
var getTdMapData = function (data) {
    return request({
        type: 'post',
        data: {
            mapType: data
        },
        url: '/pictureTdMapController/getMapSelect'
    })
}

// 获取地图下拉列表数据：二维
var getMapData = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/pictureMapController/getMapSelect',
    });
}

// 修改数据目录
var changeDataDir = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/PictureTdDataDirectory/updateTdDataDir',
        token: true
    })
}

// 添加数据目录
var insertDataDir = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/PictureTdDataDirectory/insertTdDataDir',
        token: true
    })
}

export default {
    getMapList: getMapList,                 // 三维地图：读取地图列表
    deleteMap: deleteMap,                   // 三维地图：删除地图
    getMapDetail: getMapDetail,             // 三维地图：地图详情
    updateMap: updateMap,                   // 三维地图：新增/修改地图
    queryTdTreeDataDir: queryTdTreeDataDir, // 数据目录：根据目录类型查询
    deleteDataDir: deleteDataDir,           // 数据目录：删除数据目录中的单个数据
    getDataDirDetail: getDataDirDetail,     // 数据目录：根据编号查询数据目录
    getTdMapData: getTdMapData,             // 数据目录：获取地图下拉列表数据：二维
    getMapData: getMapData,                 // 数据目录：获取地图下拉列表数据：三维
    changeDataDir: changeDataDir,           // 数据目录：修改数据目录
    insertDataDir: insertDataDir,           // 数据目录：添加数据目录
}