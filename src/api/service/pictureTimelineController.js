import request from '@/utils/axiosevent';
const URL = '/pictureTimelineController';
export function getTimeList(data) { // 时间轴列表查询
    return request({
        url: URL + '/getPageOfType',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}
export function getdeleteTimeline(data) { // 时间轴删除
    return request({
        url: URL + '/deletePictureTimelineTypeById',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}
export function getSelectTimeline (data) { // 修改
    return request({
        url: URL + '/selectPictureTimelineTypeById',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}
export function getUpdataTimeline (data) { // 新增
    return request({
        url: URL + '/updataPictureTimelineType',
        type: 'post',
        data: data,
        target: 'onemap',
    })
}
export function getSelectMapInfo(data) { // 获取地图名称下拉框列表数据
    return request({
        url: URL + '/selectMapInfoByDataIsNotNull',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}
export function getUpdataTimelineData(data) { // 新增时间轴列表数据
    return request({
        url: URL + '/updataPictureTimelineData',
        type: 'post',
        data: data,
        target: 'onemap',
    })
}
export function getPageOfData(data) { // 获取时间轴列表数据
    return request({
        url: URL + '/getPageOfData',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}
export function getSelectTimelineDataById(data) { // 修改
    return request({
        url: URL + '/selectPictureTimelineDataById',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}

export function getDeleteTimelineDataById(data) { // 删除
    return request({
        url: URL + '/deletePictureTimelineDataById',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}