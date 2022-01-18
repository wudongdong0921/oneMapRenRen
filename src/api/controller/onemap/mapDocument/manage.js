import serviceFuc from '../../../service/index';
let {
    getDocPage,
    documnetType,
    getDocTreeInfo,
    folderSave,
    getDocFilePage,
    docFileType,
    getPlanResultType,
    importRusult,
    moveFiles,
    movefolders
} = serviceFuc();
// 根据目录类型进行查询: 三维
//?targetType='+type
export function getStatisList(data, cb, error) {
    let obj = {
        page: data.page,
        limit: data.limit,
        dicName: data.dicName
    }
    getDocPage(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function deleteDocuments(data, cb, error) {
    let obj = Object.assign({}, {
        type: "delete"
    }, data)
    documnetType(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function addDocument(data, cb, error) {
    let obj = Object.assign({}, {
        type: "post"
    }, data)
    documnetType(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function updateDocument(data, cb, error) {
    let obj = Object.assign({}, {
        type: "put"
    }, data)
    documnetType(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function docTree(data, cb, error) {
    let obj = {
        id: data.id,
        dictId: data.dictId ? data.dictId : null
    }
    getDocTreeInfo(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getFolderSave(data, cb, error) {
    folderSave(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getFilePage(data, cb, error) {
    let obj = {
        dicId: data.dicId,
        fileRealName: data.fileRealName,
        page: data.page,
        limit: data.limit
    }
    getDocFilePage(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function deleteFile(data, cb, error) {
    let obj = Object.assign({}, {
        type: 'delete'
    }, data)
    docFileType(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function updateFile(data, cb, error) {
    let obj = Object.assign({}, {
        type: 'put'
    }, data)
    docFileType(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getPlanResultTypes(data, cb, error) {
    getPlanResultType(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function importResultType(data, cb, error) {
    let obj = {
        ghcgId: data.ghcgId,
        dicId: data.dicId
    }
    importRusult(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function moveFile(data, cb, error) {
    moveFiles(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}


export function movefolder(data, cb, error) {
    movefolders(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}