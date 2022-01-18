import request from '@/utils/axiosevent';
import Cookies from "@/utils/storage";

const URL = '/layer';

export function selectDataSource (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/selectDataSourceList',
        target: 'onemap',
        token: true,
    });
}

export function selectLayerData (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/selectLayerDataInfo',
        target: 'onemap',
        token: true,
    });
}

export function addLayerData (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/addLayerDataInfo',
        target: 'onemap',
        token: true,
    });
}

export function testConnection (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/TestConnection',
        target: 'onemap',
        token: true,
        headers: {
            'token': Cookies.get('token') || ''
        },
    });
}

export function updataCa (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/updataCaData',
        target: 'onemap',
        token: true,
    });
}

export function selectSjbList (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/selectSjbListBySjyId',
        target: 'onemap',
        token: true,
    });
}