import request from '@/utils/axiosevent';

// 查询页面列表
var inquiryList = function (data) {
    return request({
        type: 'get',
        url: '/propertySearch/page?pageNumber=' + data.pageNumber + '&pageSize=' + data.pageSize + '&propertyName=' + data.propertyName,
        token: true,
    })
};

// 删除数据
var deleteDatas = function (data) {
    return request({
        type: 'delete',
        params:{
            sxcxId: data
        },
        url: '/propertySearch/delete',
        token: true,
    })
};

// 删除视图
var deleteView = function (data) {
    return request({
        type: 'delete',
        url: '/propertySearch/deleteView?sxcxId=' + data,
    })
};

// 查询数据源
var getLayerDataSourceList = function (data) {
    return request({
        type: 'post',
        params: data,
        url: '/layerDataField/getLayerDataSourceList',
        token: true
    })
};

// 根据数据源id查数据表
var getLayerDataList2 = function (data) {
    return request({
        type: 'post',
        params: {
            sjyId: data
        },
        url: '/layerDataField/getLayerDataList2',
        token: true
    })
};

// 新增或修改属性查询
var insertOrUpdate = function(data) {
    return request({
        type: 'post',
        data: data,
        url: '/propertySearch/insertOrUpdate'
    })
};

// 查看属性详情
var getPropertyInfo = function(data) {
    return request({
        type: 'get',
        url: '/propertySearch/getPropertyInfo?sxcxId=' + data,
    })
};

// 保存配置
var saveConfig = function(data) {
    return request({
        type: 'post',
        data: data,
        url: '/propertySearch/saveConfig'
    })
};

export default {
    inquiryList,    // 查询列表数据
    deleteDatas,    // 删除数据
    deleteView,     // 删除视图
    getLayerDataSourceList,     // 查询数据源
    getLayerDataList2,      // 根据数据源id查数据表
    insertOrUpdate,     // 新增或修改属性查询
    getPropertyInfo,     // 查看基础信息详情
    saveConfig,     // 保存配置
}