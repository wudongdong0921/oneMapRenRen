import request from '@/utils/axiosevent';

var queryModular = function () {
    return request({
        type: 'post',
        params: {type:'LCGLMK'},
        url: '/sys/dict/data/queryChildListByType',
        target: 'security',
        token: true,
    });
}

var getProcessPage = function (data) {
    return request({
        type: 'post',
        params: { page: data.pageNum, limit: data.pageSize, processName: data.processName },
        url: '/ProcessManage/getProcessManagePage',
        target: 'business',
        token: true,
    });
}

var queryAllProcess = function () {
    return request({
        type: 'post',
        url: '/ProcessManage/queryProcessManage',
        target: 'business',
        token: true,
    });
}

var getProcessInfoById = function (id) {
    return request({
        type: 'post',
        params: { id: id },
        url: '/ProcessManage/selectProcessManageById',
        target: 'business',
        token: true,
    });
}

var saveProcessInfo = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/ProcessManage/saveProcessManage',
        target: 'business',
        token: true,
    });
}

var deleteProcessInfoById = function (data) {
    return request({
        type: 'delete',
        data: data,
        url: '/ProcessManage/deleteProcessManageByIds',
        target: 'business',
        token: true,
    });
}

export default {
    getProcessPage: getProcessPage,
    getProcessInfoById: getProcessInfoById,
    saveProcessInfo: saveProcessInfo,
    deleteProcessInfoById: deleteProcessInfoById,
    queryModular: queryModular,
    queryAllProcess: queryAllProcess
}