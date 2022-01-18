import request from '@/utils/axiosevent';
const URL = '/rramsPlanResultType';
export function getPlanResultType(data) {
    return request({
        type: 'post',
        data: data,
        url: URL + '/getPlanResultType',
        target: 'onemap',
        token: true,
    });
}