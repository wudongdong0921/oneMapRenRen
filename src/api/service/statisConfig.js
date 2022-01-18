import request from '@/utils/axiosevent';
const URL = '/statisConfig';
export function dataStaticGetList(data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/getList',
        target: 'onemap',
        token: true,
    });
}
export function dataStaticDelete(data) {
    return request({
        type: 'delete',
        params: data,
        url: URL + '/delete',
        target: 'onemap',
        token: true,
    });
}

export function dataStaticGetById(data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/getById',
        target: 'onemap',
        token: true,
    });
}

export function dataStaticSave(data){
    return request ({
        type: 'post',
        data: data,
        token: true,
        target: 'onemap',
        url: URL + '/save'
    })
}