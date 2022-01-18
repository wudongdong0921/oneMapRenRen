import request from '@/utils/axiosevent';
import Cookies from "@/utils/storage";

const URL = '/docRelevant';

export function getMapList(data) {
    return request({
        type: 'get',
        params: data,
        token: true,
        target: 'onemap',
        url: URL + '/getMapList'
    })
}
export function saveMap(data) {
    return request({
        type: 'post',
        data: data,
        token: true,
        target: 'onemap',
        url: URL + '/saveMap'
    })
}

export function getDocfindList(data) {
    return request({
        type: 'get',
        params: data,
        target: 'onemap',
        url: URL + '/findList',
        token: true
    });
}

export function deleteItems(data) {
    return request({
        type: 'DELETE',
        params: data,
        target: 'onemap',
        url: URL + '/deleteMap',
        token: true
    })
}
export function getFileTrees(data) {
    return request({
        type: 'get',
        params: data,
        target: 'onemap',
        url: URL + '/getFileTree',
        token: true
    })
}
export function saveMapFiles(data) {
    return request({
        type: 'post',
        data: data,
        target: 'onemap',
        url: URL + '/saveMapFile',
        token: true
    })
}