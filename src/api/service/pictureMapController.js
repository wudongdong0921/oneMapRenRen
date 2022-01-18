import request from '@/utils/axiosevent';
const URL = '/pictureMapController';

export function getMapSelectForMap(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getMapSelect',
        target: 'onemap',
        token: true
    })
}

export function getPage(data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/getPage',
        target: 'onemap',
        token: true
    })
}

export function deleteByMapManageId(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/deleteById',
        target: 'onemap',
        token: true
    })
}

export function selectByMapManageId(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/selectById',
        target: 'onemap',
        token: true
    })
}

export function updataPictureMap(data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/updataPictureMap',
        target: 'onemap',
        token: true
    })
}