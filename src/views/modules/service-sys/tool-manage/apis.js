import request from '@/utils/axiosevent';

var queryCategory = function () {
    return request({
        type: 'post',
        params: {type:'GJLB'},
        url: '/sys/dict/data/queryChildListByType',
        target: 'security',
        token: true,
    });
}

var queryTool = function (data) {
    return request({
        type: 'post',
        params: {currentCategory:data},
        url: '/ToolUpload/queryToolUploadList',
        target: 'security',
        token: true,
    });
}

var deleteTool = function (data) {
    return request({
        type: 'post',
        params: {id:data},
        url: '/ToolUpload/deleteTooluploadById',
        target: 'security',
        token: true,
    });
}

var queryToolById = function (data) {
    return request({
        type: 'post',
        params: {id:data},
        url: '/ToolUpload/selectToolUploadById',
        target: 'security',
        token: true,
    });
}

var saveTool = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/ToolUpload/saveToolUpload',
        target: 'security',
        token: true,
    });
}

export default {
    queryCategory: queryCategory,
    queryTool: queryTool,
    saveTool: saveTool,
    queryToolById:queryToolById,
    deleteTool: deleteTool,
}