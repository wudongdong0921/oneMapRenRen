import request from '@/utils/axiosevent';

const URL = '/mapUpdates';

export function findList (data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/findList',
        target: 'onemap',
        token: true,
    });
}

export function saveMapUpdate(data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/saveMapUpdates',
        target: 'onemap',
        token: true,
    });
}

export function deleteMapMsgData(data) {
    return request({
        type: 'delete',
        params: data,
        url: URL + '/delete',
        target: 'onemap',
        token: true,
    });
}