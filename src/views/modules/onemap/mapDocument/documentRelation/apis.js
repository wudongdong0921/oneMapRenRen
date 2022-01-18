////////////////////////////////////////////////
// 文档关联接口
// 吴野
// 2021-08-23 10:47:59
////////////////////////////////////////////////
import request from '@/utils/axiosevent';

var getList = function (data, cb) {
    return request({
        type: 'get',
        params: data,
        url: '/docRelevant/findList',
        token: true
    });
}
var getAddMapList = function (data) {
    return request({
        type: 'get',
        params: data,
        url: '/docRelevant/getMapList',
        token: true
    })
}

var addRelation = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/docRelevant/saveMap',
        token: true
    })
}
var deleteItems = function (data) {
    return request({
        type: 'DELETE',
        params: data,
        url: '/docRelevant/deleteMap',
        token: true
    })
}
var getFileTree = function (data) {
    return request({
        type: 'get',
        params: data,
        url: '/docRelevant/getFileTree',
        token: true
    })
}
var saveMapFile = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/docRelevant/saveMapFile',
        token: true
    })
}
export default {
    getList,// 文档关联接口
    getAddMapList,// 新增时获取地图下拉列表数据
    addRelation,// 新增关联数据
    deleteItems,// 删除关联数据
    getFileTree,// 获取文档树
    saveMapFile,// 保存树与地图关联
}