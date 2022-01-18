import request from '@/utils/axiosevent';

const URL = '/pictureSubbandController';
//坐标系 分页
export function getCoordinate (data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/getPage',
        target: 'onemap',
        token: true,
    });
}

export function updateStatu (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/updateStatus',
        target: 'onemap',
        token: true,
    });
}