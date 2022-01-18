import request from '@/utils/axiosevent';

// 新增统计配置
var saveStatis = function (data) {
    return request ({
        type: 'post',
        data: data,
        token: true,
        url: '/statisConfig/save'
    })
}

// 获取分页列表 
var getStatisList = function (data) {
    return request ({
        type: 'get',
        // data: data,
        token: true,
        url: '/statisConfig/getList?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize + '&statisName=' + data.statisName
    })
}

// 删除统计配置
var deleteStatis = function(data) {
    return request ({
        type: 'delete',
        token: true,
        url: '/statisConfig/delete?ids=' + data
    })
}

// 获取数据源列表
var getLayerDataSourceList = function() {
    return request ({
        type: 'post',
        token: true,
        url: '/layerDataField/getLayerDataSourceList'
    })
}

// 获取数据表
var getLayerDataList = function(data) {
    return request ({
        type: 'post',
        token: true,
        url: '/layerDataField/getLayerDataList2?sjyId=' + data
    })
}

// 获取字段
var findLayerDataFieldSelectList = function(data) {
    return request({
        type: 'post',
        token: true,
        url: '/layerDataField/findLayerDataFieldSelectList?sjbId=' + data
    })
}

// 修改 根据id查询数据
var getById = function(data) {
    return request ({
        type: 'get',
        token: true,
        url: '/statisConfig/getById?id=' + data
    })
}

// 分组参照字典
var getDicSelectListForSpecific = function(data) {
    return request ({
        type: 'post',
        token: true,
        url: '/specificAnalysisV2/getDicSelectListForSpecific2?remark=分析'
    })
}

export default {
    saveStatis, // 新增统计配置
    getStatisList,  // 获取分页列表 
    deleteStatis,   // 删除统计配置
    getLayerDataSourceList, // 获取数据源列表
    getLayerDataList,   // 获取数据表
    findLayerDataFieldSelectList,   // 获取字段
    getById,    // 根据id查询数据
    getDicSelectListForSpecific,    // 分组参照字典
}