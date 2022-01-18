import request from '@/utils/axiosevent';
const URL = '/specificAnalysisV2';
export function getDicSelectListForSpecific2(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getDicSelectListForSpecific2',
        target: 'onemap',
        token: true,
    });
}
export function getDicSelectList(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getDicSelectList',
        target: 'onemap',
        token: true,
    });
}
export function getSpecificAnalysis(data) { //
    return request({
        type: 'post',
        params: data,
        url: URL + '/getSpecificAnalysis',
        target: 'onemap',
        token: true,
    });
}
export function getQuerySpecificAnalysisTableTree(data) {//
    return request({
        type: 'post',
        params: data,
        url: URL + '/querySpecificAnalysisTableTree',
        target: 'onemap',
        token: true,
    });
}
export function getSaveOrUpdateSpecificAnalysis(data) {//
    return request({
        type: 'post',
        data: data,
        url: URL + '/saveOrUpdateSpecificAnalysis',
        target: 'onemap',
        token: true,
    });
}
export function getDelSpecificAnalysis(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/delSpecificAnalysis',
        target: 'onemap',
        token: true,
    });
}
export function getSaveOrUpdateSpecificData(data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/saveOrUpdateSpecificData',
        target: 'onemap',
        token: true,
    });
}
export function getDelSpecificData(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/delSpecificData',
        target: 'onemap',
        token: true,
    });
}
export function getOneSourceAndConfigs(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getOneSourceAndConfigs',
        target: 'onemap',
        token: true,
    });
}
export function getSaveOrUpdateSpecificConfig(data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/saveOrUpdateSpecificConfig',
        target: 'onemap',
        token: true,
    });
}
export function getDelSpecificConfig(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/delSpecificConfig',
        target: 'onemap',
        token: true,
    });
}
export function getDicSelectListForSpecific(data) {
    return request({
        type: 'post',
        params: data,
        url: URL + '/getDicSelectListForSpecific',
        target: 'onemap',
        token: true,
    });
}