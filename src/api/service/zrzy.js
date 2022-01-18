import request from '@/utils/axiosevent';
const URL = '/zrzy'

export function queryTreeData (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/queryTreeDataDir',
        target: 'onemap',
        token: true,
    });
}

export function deleteData (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/deleteDataDir',
        target: 'onemap',
        token: true,
    });
}


export function queryDataDirById (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/queryDataDirById',
        target: 'onemap',
        token: true,
    });
}

export function updateDataDir (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/updateDataDir',
        target: 'onemap',
        token: true,
    });
}


export function insertData (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/insertDataDir',
        target: 'onemap',
        token: true,
    });
}
