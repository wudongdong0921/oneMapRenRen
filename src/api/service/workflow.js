import request from '@/utils/axiosevent';
const URL = '/public'
export function getFlowDefList(data){
    return request({
        type: 'post',
        data: data,
        // DevUrl: "wintoppublicinterfaceGW",
        url: URL + '/getFlowDefList',
        target: 'security',
        token: true,
    });
}