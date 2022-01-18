import request from '@/utils/axiosevent';

const URL = '/PictureBaseMap';
// 获取底图列表
export function selectBaseMap (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/selectPictureBaseMapByNameList',
        target: 'onemap',
        token: true,
    });
}

// 添加或修改底图数据
export function saveBaseMap (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/addPictureBaseMapInfo',
        target: 'onemap',
        token: true,
    });
}

// 批量删除底图数据接口
export function deleteBaseMap (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/deletePictureBaseMapBYIdsInfo',
        target: 'onemap',
        token: true,
    });
}

//查询底图信息
export function selectBaseMapDetail (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/selectPictureBaseMapInfo',
        target: 'onemap',
        token: true,
    });
}

