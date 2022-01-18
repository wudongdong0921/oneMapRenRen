import request from '@/utils/axiosevent';
const URL = '/ywcx'
export function insertProcess(data){
    return request({
        type: 'post',
        params: data,
        url: URL + '/insertProcess',
        target: 'onemap',
        token: true,
    });
}
export function updateProcess(data){
    return request({
        type: 'post',
        params: data,
        url: URL + '/updateProcess',
        target: 'onemap',
        token: true,
    });
}
export function getProcessById(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/getProcessById',
        target: 'onemap',
        token: true,
    });
}
export function deleteProcess(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/deleteProcess',
        target: 'onemap',
        token: true,
    });
}
export function getPageById(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/getPageById',
        target: 'onemap',
        token: true,
    });
}
export function updateSearch(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/updateSearch',
        target: 'onemap',
        token: true,
    });
}
export function insertSearch(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/insertSearch',
        target: 'onemap',
        token: true,
    });
}
export function queryById(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/queryById',
        target: 'onemap',
        token: true,
    });
}

export  function deleteSearch(data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/deleteSearch',
        target: 'onemap',
        token: true,
    });
}

export  function getPageList(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getPageList',
        target: 'onemap',
        token: true,
    });
}