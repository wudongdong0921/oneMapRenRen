import request from '@/utils/axiosevent';

// 获取底图列表
export function mixins (data) {
    return request({
        type: data.method,
        params: data.data,
        url: data.url,
        target: 'onemap',
        token: true,
    });
}