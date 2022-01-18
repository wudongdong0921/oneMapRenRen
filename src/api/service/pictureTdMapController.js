import request from '@/utils/axiosevent';
const URL = '/pictureTdMapController';
export function getBaseMapList(data) {
    return request({
        url: URL + '/getPage',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}
export function deleteById(data) {
    return request({
        url: URL + '/deleteById',
        type: 'post',
        params: data,
        target: 'onemap',
    })
}

export function selectById(data) {
    return request({
        url: URL + '/selectById',
        type: 'post',
        params: data,
        target: 'onemap',
    })
}

export function updatePictureTdMap(data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/updatePictureTdMap',
        target: 'onemap',
    })
}

export function getMapSelect(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/getMapSelect',
        target: 'onemap',
    })
}