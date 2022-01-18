import request from '@/utils/axiosevent';
var getFileManageList = function (data) {
    return request({
        type: 'get',
        params: data,
        url: '/documnet/getAllRoot',
        token: true,
    });
}
export default {
    getFileManageList, // 获取文件管理权限树
}