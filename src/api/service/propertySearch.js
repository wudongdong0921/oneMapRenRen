import request from '@/utils/axiosevent';
const URL = '/propertySearch';
// 查询页面列表
export function inquiryListS(data) {
    return request({
        type: 'get',
        params:data,
        target: 'onemap',
        url: URL + '/page',
        token: true,
    })
};
export function alterView(data) {
    return request({
        type: 'post',
        data:data,
        target: 'onemap',
        url: URL + '/alterView',
        token: true,
    })
};
export function createView(data) {
    return request({
        type: 'post',
        data:data,
        target: 'onemap',
        url: URL + '/createView',
        token: true,
    })
};

// 删除数据
export function deleteDatasS(data) {
    return request({
        type: 'delete',
        params: data,
        target: 'onemap',
        url: URL + '/delete',
        token: true,
    })
};

// 删除视图
export function deleteViewS(data) {
    return request({
        type: 'delete',
        params: data,
        target: 'onemap',
        url: URL + '/deleteView',
    })
};

// 新增或修改属性查询
export function insertOrUpdateS(data) {
    return request({
        type: 'post',
        data: data,
        target: 'onemap',
        url: URL + '/insertOrUpdate'
    })
};

// 查看属性详情
export function getPropertyInfoS(data) {
    return request({
        type: 'get',
        params: data,
        target: 'onemap',
        url: URL + '/getPropertyInfo',
    })
};

// 查看属性详情
export function propertySearchShowConfig(data) {
    return request({
        type: 'get',
        params: data,
        target: 'onemap',
        url: URL + '/showConfig',
    })
};

// 保存配置
export function saveConfigS(data) {
    return request({
        type: 'post',
        data: data,
        target: 'onemap',
        url: URL + '/saveConfig'
    })
};