import request from '@/utils/axiosevent';

// 文档管理
// 新增文档目录
var addDocument = function (data) {
    console.log(data)
    return request({
        type: 'post',
        data: data,
        token: true,
        url: '/documnet'
    })
} 

// 文档管理分页接口
var getDocPage = function (data) {
    return request ({
        type: 'get',
        // param: {
        //     page: data.page,
        //     limit: data.limit,
        //     dicName: data.dicName
        // },
        token: true,
        url: '/documnet/page?page=' + data.page + "&limit=" + data.limit + "&dicName=" + data.dicName
        // url: '/documnet/page'
    })
}

// 修改文档目录接口
var updateDocument = function(data) {
    return request ({
        type: 'put',
        data: data,
        token: true,
        url: '/documnet'
    })
}

// 批量删除文档目录接口
var deleteDocuments = function (data) {
    return request ({
        type: 'delete',
        data: data,
        token: true,
        url: '/documnet'
    })
}

// 文档目录树接口
var docTree = function(data, dictId) {
    return request ({
        type: 'get',
        token: true,
        url: '/documnet/info?id=' + data + '&dictId=' + (dictId? dictId: null),
    })
}

// 上传文件接口 
var upload = function(data) {
    return request({
        type: 'post',
        data: data,
        token: true,
        url: '/doc.file/upload'
    })
}

// 删除文件接口
var deleteFile = function(data) {
    return request({
        type: 'delete',
        data: data,
        token: true,
        url: '/doc.file'
    })
}

// 修改文件接口
var updateFile = function(data){
    return request({
        type: 'put',
        data: data,
        token: true,
        url: '/doc.file'
    })
}

// 文件分页查询接口
var getFilePage = function(data) {
    return request({
        type: 'get',
        token: true,
        url: '/doc.file/page?dicId=' + data.dicId + "&fileRealName=" + data.fileRealName + "&page=" + data.page + "&limit=" + data.limit
    })
}

// 查询文件详情接口
var fileDetail = function (data) {
    return request ({
        type: 'get',
        // data: data,
        token: true,
        url: '/doc.file/' + data,
    })
}

// 移动文件接口
var moveFile = function (data) {
    return request({
        type: 'post',
        data: data,
        token: true,
        url: '/doc.file/movefile'
    })
}

// 查询规划成果类型
var getPlanResultType = function (data) {
    return request ({
        type: 'post',
        data: data,
        token: true,
        url: '/rramsPlanResultType/getPlanResultType'
    })
}

// 移动文件夹
var moveFolder = function (data) {
    return request ({
        type: 'post',
        data: data,
        token: true,
        url: '/documnet/movefolder'
    })
}

// 规划成果导入接口
var importResultType = function (data) {
    return request ({
        type: 'post',
        // data: data,
        tokrn: true,
        url: '/doc.file/imports?ghcgId=' + data.ghcgId + "&dicId=" + data.dicId
    })
}

// 在子页面新增文件夹
var folderSave = function(data) {
    return request ({
        type: 'post',
        data: data,
        token: true,
        url: '/documnet/folderSave'
    })
}

export default {
    addDocument,    // 新增文档目录
    getDocPage,        // 文档管理分页接口
    updateDocument, // 修改文档目录接口
    deleteDocuments,    // 批量删除文档目录接口
    docTree,        // 文档目录树接口
    upload,         // 上传文件接口 
    deleteFile,     // 删除文件接口
    updateFile,     // 修改文件接口
    getFilePage,    // 文件分页查询接口
    fileDetail,     // 查询文件详情接口
    moveFile,       // 移动文件接口
    getPlanResultType,  // 查询规划成果类型
    moveFolder,     // 移动文件夹
    importResultType,   // 规划成果导入接口
    folderSave,     // 在子页面新增文件夹
}