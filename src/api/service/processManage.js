export function getProcessPage (data) {
    return request({
        type: 'post',
        params: { page: data.pageNum, limit: data.pageSize, processName: data.processName },
        url: '/ProcessManage/getProcessManagePage',
        target: 'business',
        token: true,
    });
}
export function getProcessPage2 (data) {
    return request({
        type: 'post',
        params: { page: data.pageNum, limit: data.pageSize, processName: data.processName },
        url: '/ProcessManage/getProcessManagePage',
        target: 'business',
        token: true,
    });
}