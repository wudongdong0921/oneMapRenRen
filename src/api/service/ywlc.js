import request from '@/utils/axiosevent';
const URL = '/ywlc'
export function getBusinessPageById(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/getPageById',
        target: 'onemap',
        token: true,
    });
}

export function getBusinessProcessById(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/getProcessById',
        target: 'onemap',
        token: true,
    });
}

export function insertBusinessProcess(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/insertProcess',
        target: 'onemap',
        token: true,
    });
}

export function updateBusinessProcess(data){
    return request({
        type: 'post',
        data: data,
        url: URL + '/updateProcess',
        target: 'onemap',
        token: true,
    });
}

export function deleteBusinessProcess(data){
    return request({
        type: 'get',
        params: data,
        url: URL + '/deleteProcess',
        target: 'onemap',
        token: true,
    });
}