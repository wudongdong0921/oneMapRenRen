import request from '@/utils/axiosevent';
const URL = '/lcbg'
export function getTablesbyFlowId(data){
    return request({
        type: 'post',
        params: data,
        url: URL + '/getTablesbyFlowId',
        target: 'onemap',
        token: true,
    });
}


export function getFieldByTid(data){
    return request({
        type: 'post',
        params: data,
        url: URL + '/getFieldByTid',
        target: 'onemap',
        token: true,
    });
}