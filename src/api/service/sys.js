import request from '@/utils/axiosevent';
const URL = '/sys'

export  function queryModular() {
    return request({
        type: 'post',
        params: {type:'LCGLMK'},
        url: URL + '/dict/data/queryChildListByType',
        target: 'security',
        token: true,
    });
}

export  function selectRegion() {
    return request({
        type: 'get',
        params: {},
        url: URL + '/region/tree',
        target: 'security',
        token: true,
    });
}