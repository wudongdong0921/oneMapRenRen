import request from '@/utils/axiosevent';

const URL = '/layerDataField';

export function getLayerDataSource (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/getLayerDataSourceList',
        target: 'onemap',
        token: true,
    });
}

export function getLayerDataField (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getLayerDataFieldList',
        target: 'onemap',
        token: true,
    });
}


export function resetLayerData (data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/resetLayerDataField',
        target: 'onemap',
        token: true,
    });
}

// saveLayerDataAndField
export function saveLayerData (data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/saveLayerDataAndField',
        target: 'onemap',
        token: true,
    });
}

export function getLayerDataList2(data){
    return request ({
        type: 'post',
        params: data,
        token: true,
        target: 'onemap',
        url: URL + '/getLayerDataList2'
    })
}

export function findLayerDataFieldSelectLists(data){
    return request({
        type: 'post',
        params: data,
        target: 'onemap',
        token: true,
        url: URL + '/findLayerDataFieldSelectList'
    })
}

export function getLayerDataTree(data){
    return request({
        type: 'post',
        data: data,
        target: 'onemap',
        token: true,
        url: URL + '/getLayerDataTree'
    })
}