import request from '@/utils/axiosevent';
const URL = '/caBusinessAnalysis';
export function getUpdateBusiness(data) { // 修改业务分析类别
    return request({
        url: URL + '/updateBusinessAnaylsis',
        type: 'post',
        data: data,
        target: 'onemap',
    })
}
export function getSaveBusiness(data) { // 新增业务分析类别
    return request({
        url: URL + '/saveBusinessAnaylsis',
        type: 'post',
        data: data,
        target: 'onemap',
    })
}
export function getBusinessAnaylsisList(data) { // 新增业务分析类别
    return request({
        url: URL + '/getBusinessAnaylsisList',
        type: 'post',
        params: data,
        target: 'onemap',
    })
}
export function getFXLX(data) { // 新增业务分析类别
    return request({
        url: URL + '/getFXLX',
        type: 'get',
        params: data,
        target: 'onemap',
    })
}

export function getBusinessAnaylsisForSelect(data) { 
    return request({
        type: 'post',
        params: data,
        url: URL + '/getBusinessAnaylsisForSelect',
        target: 'onemap',
        token: true,
    })
}
export function getBusinessAnaylsisById2(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getBusinessAnaylsisById2',
        target: 'onemap',
        token: true,
    })
}
export function updateBusinessAnaylsisState(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/updateBusinessAnaylsisState',
        target: 'onemap',
        token: true,
    })
}