import request from '@/utils/axiosevent';
const URL = '/PictureTdDataDirectory';
export function queryTdTreeDataDirs(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/queryTdTreeDataDir',
        target: 'onemap',
        token: true
    })
}

export function deleteTdDataDir(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/deleteTdDataDir',
        target: 'onemap',
        token: true
    })
}
export function queryTdDataDirById(data){
    return request({
        type: 'post',
        params: data,
        url: URL + '/queryTdDataDirById',
        target: 'onemap',
        token: true
    })
}

export function updateTdDataDir(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/updateTdDataDir',
        target: 'onemap',
        token: true
    })
}

export function insertTdDataDir(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/insertTdDataDir',
        target: 'onemap',
        token: true
    })
}